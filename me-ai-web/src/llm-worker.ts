/**
 * Dedicated Web Worker for WebGPU/ONNX model inference.
 * Uses the same message protocol the main thread expects.
 * Dynamic import() is allowed in workers but disallowed in Service Workers.
 */
import {
  env,
  AutoTokenizer,
  AutoModelForCausalLM,
  AutoModelForImageTextToText,
  TextStreamer,
  InterruptableStoppingCriteria,
} from "@huggingface/transformers";



// WASM files are served from the site root (public/ in dev, copied in build).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(env.backends.onnx.wasm as any).wasmPaths = import.meta.env.BASE_URL;

function isImageTextToTextModel(model_id: string): boolean {
  return /Qwen3\.5/i.test(model_id);
}

type LoadOptions = { dtype?: string; device?: string };

class TextGenerationPipeline {
  static model_id: string | null = null;
  static load_options: LoadOptions | null = null;
  static tokenizer: InstanceType<typeof AutoTokenizer> | null = null;
  static model: InstanceType<typeof AutoModelForCausalLM> | InstanceType<typeof AutoModelForImageTextToText> | null = null;

  static async getInstance(
    model_id: string,
    progress_callback: ((x: unknown) => void) | null = null,
    load_options: LoadOptions = {}
  ): Promise<[InstanceType<typeof AutoTokenizer>, InstanceType<typeof AutoModelForCausalLM> | InstanceType<typeof AutoModelForImageTextToText>]> {
    const dtype = load_options.dtype ?? "q4f16";
    const device = load_options.device ?? "webgpu";
    const optsKey = `${dtype}:${device}`;

    if (
      this.model_id !== model_id ||
      (this.load_options && `${this.load_options.dtype ?? "q4f16"}:${this.load_options.device ?? "webgpu"}` !== optsKey)
    ) {
      if (this.model && "dispose" in this.model && typeof (this.model as { dispose: () => Promise<void> }).dispose === "function") {
        try {
          await (this.model as { dispose: () => Promise<void> }).dispose();
        } catch { /* no-op */ }
      }
      this.tokenizer = null;
      this.model = null;
    }
    this.model_id = model_id;
    this.load_options = { dtype, device };

    this.tokenizer ??= await AutoTokenizer.from_pretrained(model_id, {
      progress_callback: progress_callback ?? undefined,
    });

    const ModelClass = isImageTextToTextModel(model_id)
      ? AutoModelForImageTextToText
      : AutoModelForCausalLM;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.model ??= (await (ModelClass as any).from_pretrained(model_id, {
      dtype,
      device,
      progress_callback: progress_callback ?? undefined,
    })) as InstanceType<typeof AutoModelForCausalLM>;

    return Promise.all([this.tokenizer, this.model]) as Promise<[InstanceType<typeof AutoTokenizer>, InstanceType<typeof AutoModelForCausalLM> | InstanceType<typeof AutoModelForImageTextToText>]>;
  }
}

const stopping_criteria = new InterruptableStoppingCriteria();

function isHarmonyModel(model_id: string): boolean {
  return model_id.includes("gpt-oss");
}

function parseHarmonyOutput(raw: string): { thinking: string | null; response: string } {
  const finalIdx = raw.indexOf("final");
  if (finalIdx === -1) return { thinking: null, response: raw.trim() };

  const response = raw.slice(finalIdx + "final".length).trim();
  const analysisIdx = raw.indexOf("analysis");
  let thinking: string | null = null;
  if (analysisIdx !== -1) {
    const afterAnalysis = raw.slice(analysisIdx + "analysis".length);
    const endMatch = afterAnalysis.search(/assistant|final/);
    thinking = (endMatch !== -1 ? afterAnalysis.slice(0, endMatch) : afterAnalysis).trim() || null;
  }
  return { thinking, response };
}

type Reply = (msg: Record<string, unknown>) => void;

async function check(reply: Reply): Promise<void> {
  try {
    const gpu = (navigator as unknown as { gpu?: { requestAdapter: () => Promise<{ info?: Record<string, unknown>; limits?: Record<string, unknown>; features?: Set<string> } | null> } }).gpu;
    if (!gpu) throw new Error("WebGPU API is not available in this browser");
    const adapter = await gpu.requestAdapter();
    if (!adapter) throw new Error("WebGPU is not supported (no adapter found)");

    const info = (adapter as Record<string, unknown> | null)?.['info'] as Record<string, unknown> || {};
    const limits = (adapter as Record<string, unknown> | null)?.['limits'] as Record<string, unknown> || {};
    reply({
      status: "webgpu-info",
      data: {
        vendor: info.vendor || "unknown",
        architecture: info.architecture || "unknown",
        device: info.device || "unknown",
        description: info.description || "unknown",
        features: adapter ? [...((adapter as unknown as { features?: Iterable<string> }).features ?? [])].sort() : [],
        limits: {
          maxBufferSize: limits.maxBufferSize,
          maxStorageBufferBindingSize: limits.maxStorageBufferBindingSize,
          maxComputeWorkgroupSizeX: limits.maxComputeWorkgroupSizeX,
          maxComputeWorkgroupSizeY: limits.maxComputeWorkgroupSizeY,
          maxComputeWorkgroupSizeZ: limits.maxComputeWorkgroupSizeZ,
          maxComputeInvocationsPerWorkgroup: limits.maxComputeInvocationsPerWorkgroup,
          maxComputeWorkgroupStorageSize: limits.maxComputeWorkgroupStorageSize,
        },
      },
    });
  } catch (e) {
    reply({ status: "error", data: String(e) });
  }
}

async function load(
  model_id: string,
  load_options: LoadOptions & { options?: LoadOptions } = {},
  reply: Reply
): Promise<void> {
  reply({ status: "loading", data: "Loading model..." });

  try {
    const [tokenizer, model] = await TextGenerationPipeline.getInstance(
      model_id,
      (x) => reply(x as Record<string, unknown>),
      load_options
    );

    reply({ status: "loading", data: "Compiling shaders and warming up model..." });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const warmupInputs = (tokenizer as any).apply_chat_template(
      [{ role: "user", content: "hi" }],
      { add_generation_prompt: true, return_dict: true }
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (model as any).generate({ ...warmupInputs, max_new_tokens: 1 });

    reply({ status: "ready" });
  } catch (e) {
    console.error("[llm-worker] Load error:", e);
    reply({ status: "error", data: String(e) });
  }
}

interface ChatMessage {
  role: string;
  content?: string;
}

interface GenerateOptions {
  maxTokens?: number;
  enableThinking?: boolean;
  do_sample?: boolean;
  temperature?: number;
  top_p?: number;
  top_k?: number;
  repetition_penalty?: number;
}

async function generate(
  messages: ChatMessage[],
  options: GenerateOptions = {},
  reply: Reply
): Promise<void> {
  const {
    maxTokens = 4096,
    enableThinking = true,
    do_sample = false,
    temperature = 0.7,
    top_p = 0.95,
    top_k = 50,
    repetition_penalty = 1.1,
  } = options;

  try {
    const modelId = TextGenerationPipeline.model_id;
    if (!modelId) throw new Error("No model loaded");
    const useHarmony = isHarmonyModel(modelId);
    const [tokenizer, model] = await TextGenerationPipeline.getInstance(modelId);

    const templateOpts: { add_generation_prompt: boolean; return_dict: boolean; enable_thinking?: boolean } = {
      add_generation_prompt: true,
      return_dict: true,
    };
    if (!useHarmony) templateOpts.enable_thinking = !!enableThinking;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const inputs = (tokenizer as any).apply_chat_template(messages, templateOpts);

    let startTime: number | undefined;
    let numTokens = 0;
    let tps: number | undefined;

    const token_callback_function = () => {
      startTime ??= performance.now();
      if (numTokens++ > 0) tps = (numTokens / (performance.now() - startTime)) * 1000;
    };

    let harmonyRawBuffer = "";
    const harmony_callback = (output: string) => {
      harmonyRawBuffer += output;
      reply({ status: "phase", phase: "generating" });
    };

    let fullOutput = "";
    let thinkingDone = !enableThinking;
    let thinkBuffer = "";

    const think_callback = (output: string) => {
      fullOutput += output;

      if (!thinkingDone) {
        const closeIdx = fullOutput.indexOf("</think>");
        if (closeIdx !== -1) {
          thinkingDone = true;
          thinkBuffer = fullOutput.slice(0, closeIdx).trim();
          reply({ status: "thinking-done", content: thinkBuffer, tps, numTokens });
          const afterClose = fullOutput.slice(closeIdx + "</think>".length).trimStart();
          reply({ status: "phase", phase: "generating" });
          if (afterClose) reply({ status: "update", output: afterClose, tps, numTokens });
          return;
        }

        thinkBuffer = fullOutput;
        reply({ status: "phase", phase: "thinking" });
        reply({ status: "thinking", content: output, tps, numTokens });
        return;
      }

      if (fullOutput === output) {
        reply({ status: "phase", phase: "generating" });
      }
      reply({ status: "update", output, tps, numTokens });
    };

    const inputTokens = inputs.input_ids.dims[1];
    reply({ status: "start", phase: "preparing", inputTokens });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const streamer = new TextStreamer(tokenizer as any, {
      skip_prompt: true,
      skip_special_tokens: true,
      callback_function: useHarmony ? harmony_callback : think_callback,
      token_callback_function,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (model as any).generate({
      ...inputs,
      do_sample,
      num_beams: 1,
      max_new_tokens: maxTokens,
      temperature: do_sample ? temperature : undefined,
      top_p: do_sample ? top_p : undefined,
      top_k: do_sample ? top_k : undefined,
      repetition_penalty,
      streamer,
      stopping_criteria,
    });

    if (useHarmony && harmonyRawBuffer) {
      const { thinking, response } = parseHarmonyOutput(harmonyRawBuffer);
      if (thinking) {
        reply({ status: "phase", phase: "thinking" });
        reply({ status: "thinking-done", content: thinking, tps, numTokens });
      }
      reply({ status: "phase", phase: "generating" });
      reply({ status: "update", output: response || harmonyRawBuffer.trim(), tps, numTokens });
    }

    if (!useHarmony && !thinkingDone && thinkBuffer.length > 0) {
      reply({ status: "thinking-done", content: thinkBuffer, tps, numTokens });
      reply({ status: "phase", phase: "generating" });
      reply({
        status: "update",
        output:
          "[Thinking used all tokens — no response generated. Try a shorter prompt.]",
        tps,
        numTokens,
      });
    }
  } catch (e) {
    console.error("[llm-worker] Generation error:", e);
    reply({ status: "error", data: String(e) });
  }

  reply({ status: "complete" });
}

interface WorkerMessageData {
  type: string;
  data?: ChatMessage[];
  modelId?: string;
  options?: GenerateOptions;
}

self.onmessage = async (e: MessageEvent<WorkerMessageData>) => {
  const { type, data, modelId, options } = e.data;
  const reply: Reply = (msg) => self.postMessage(msg);

  switch (type) {
    case "check":
      await check(reply);
      break;
    case "load":
      await load(
        modelId || "onnx-community/gpt-oss-20b-ONNX",
        (e.data as WorkerMessageData & { options?: LoadOptions }).options ?? {},
        reply
      );
      break;
    case "generate":
      stopping_criteria.reset();
      await generate(data ?? [], options ?? {}, reply);
      break;
    case "interrupt":
      stopping_criteria.interrupt();
      break;
    case "reset":
      stopping_criteria.reset();
      break;
    case "getStatus":
      reply({
        status: "status-report",
        modelId: TextGenerationPipeline.model_id,
        loaded: !!(TextGenerationPipeline.tokenizer && TextGenerationPipeline.model),
      });
      break;
    case "clearCache":
      try {
        if ("caches" in self) {
          const cache = await caches.open("transformers-cache");
          const requests = await cache.keys();
          const toDelete = modelId
            ? requests.filter((r) => r.url.includes(modelId))
            : requests;
          await Promise.all(toDelete.map((r) => cache.delete(r)));
        }
      } catch { /* no-op */ }
      TextGenerationPipeline.tokenizer = null;
      TextGenerationPipeline.model = null;
      TextGenerationPipeline.model_id = null;
      TextGenerationPipeline.load_options = null;
      reply({ status: "cacheCleared", modelId: modelId ?? null });
      break;
  }
};
