/**
 * Dedicated Web Worker for WebGPU/ONNX model inference.
 * Uses the same message protocol the main thread expects.
 * Dynamic import() is allowed in workers but disallowed in Service Workers.
 */
import {
  env,
  AutoTokenizer,
  AutoProcessor,
  AutoModelForCausalLM,
  AutoModelForImageTextToText,
  Gemma4ForConditionalGeneration,
  TextStreamer,
  InterruptableStoppingCriteria,
} from "@huggingface/transformers";
import type { ChatMessage } from "me-ai-core";



// WASM files are served from the site root (public/ in dev, copied in build).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(env.backends.onnx.wasm as any).wasmPaths = import.meta.env.BASE_URL;

function isImageTextToTextModel(model_id: string): boolean {
  return /Qwen3\.5/i.test(model_id);
}

function isGemma4Model(model_id: string): boolean {
  return /gemma-4/i.test(model_id);
}

type TokenizerInstance = InstanceType<typeof AutoTokenizer>;
type ProcessorInstance = InstanceType<typeof AutoProcessor>;
type LoadOptions = { dtype?: string; device?: string };
type DisposableModel = { dispose?: () => Promise<unknown> | unknown };
type GenerationInputs = {
  input_ids: { dims: number[] };
} & Record<string, unknown>;
type TokenizerWithChatTemplate = TokenizerInstance & {
  apply_chat_template(
    messages: ChatMessage[],
    options: {
      add_generation_prompt: boolean;
      return_dict: boolean;
      enable_thinking?: boolean;
    }
  ): GenerationInputs;
};
type Gemma4MessageContent = { type: "text"; text: string };
type Gemma4Message = {
  role: string;
  content: Gemma4MessageContent[];
};
type Gemma4Processor = ProcessorInstance & {
  tokenizer?: ConstructorParameters<typeof TextStreamer>[0];
  apply_chat_template(
    messages: Gemma4Message[],
    options: { add_generation_prompt: boolean; enable_thinking: boolean }
  ): string;
  (
    prompt: string,
    text?: undefined,
    audio?: undefined,
    options?: { add_special_tokens: boolean }
  ): GenerationInputs;
};

class TextGenerationPipeline {
  static model_id: string | null = null;
  static load_options: LoadOptions | null = null;
  static tokenizer: TokenizerInstance | null = null;
  static processor: ProcessorInstance | null = null;
  static model:
    | InstanceType<typeof AutoModelForCausalLM>
    | InstanceType<typeof AutoModelForImageTextToText>
    | InstanceType<typeof Gemma4ForConditionalGeneration>
    | null = null;

  static async getInstance(
    model_id: string,
    progress_callback: ((x: unknown) => void) | null = null,
    load_options: LoadOptions = {}
  ): Promise<{
    tokenizer: TokenizerInstance | null;
    processor: ProcessorInstance | null;
    model:
      | InstanceType<typeof AutoModelForCausalLM>
      | InstanceType<typeof AutoModelForImageTextToText>
      | InstanceType<typeof Gemma4ForConditionalGeneration>;
  }> {
    const dtype = load_options.dtype ?? "q4f16";
    const device = load_options.device ?? "webgpu";
    const optsKey = `${dtype}:${device}`;

    if (
      this.model_id !== model_id ||
      (this.load_options && `${this.load_options.dtype ?? "q4f16"}:${this.load_options.device ?? "webgpu"}` !== optsKey)
    ) {
      const disposable = this.model as DisposableModel | null;
      if (disposable && typeof disposable.dispose === "function") {
        try {
          await disposable.dispose();
        } catch { /* no-op */ }
      }
      this.tokenizer = null;
      this.processor = null;
      this.model = null;
    }
    this.model_id = model_id;
    this.load_options = { dtype, device };

    if (isGemma4Model(model_id)) {
      this.processor ??= await AutoProcessor.from_pretrained(model_id, {
        progress_callback: progress_callback ?? undefined,
      });
    } else {
      this.tokenizer ??= await AutoTokenizer.from_pretrained(model_id, {
        progress_callback: progress_callback ?? undefined,
      });
    }

    const ModelClass = isGemma4Model(model_id)
      ? Gemma4ForConditionalGeneration
      : isImageTextToTextModel(model_id)
        ? AutoModelForImageTextToText
        : AutoModelForCausalLM;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.model ??= (await (ModelClass as any).from_pretrained(model_id, {
      dtype,
      device,
      progress_callback: progress_callback ?? undefined,
    })) as
      | InstanceType<typeof AutoModelForCausalLM>
      | InstanceType<typeof AutoModelForImageTextToText>
      | InstanceType<typeof Gemma4ForConditionalGeneration>;

    return {
      tokenizer: this.tokenizer,
      processor: this.processor,
      model: this.model,
    };
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

function normalizeGemma4Messages(messages: ChatMessage[]): Gemma4Message[] {
  return messages.map((message) => ({
    role: message.role,
    content: [{ type: "text", text: message.content }],
  }));
}

async function buildInputs(
  modelId: string,
  messages: ChatMessage[],
  enableThinking: boolean,
  tokenizer: TokenizerInstance | null,
  processor: ProcessorInstance | null
) {
  if (isGemma4Model(modelId)) {
    if (!processor) throw new Error("Gemma 4 processor is not loaded");
    const gemma4Processor = processor as Gemma4Processor;
    const prompt = gemma4Processor.apply_chat_template(
      normalizeGemma4Messages(messages),
      { add_generation_prompt: true, enable_thinking: !!enableThinking }
    );
    return gemma4Processor(prompt, undefined, undefined, { add_special_tokens: false });
  }

  if (!tokenizer) throw new Error("Tokenizer is not loaded");
  const useHarmony = isHarmonyModel(modelId);
  const templateOpts: { add_generation_prompt: boolean; return_dict: boolean; enable_thinking?: boolean } = {
    add_generation_prompt: true,
    return_dict: true,
  };
  if (!useHarmony) templateOpts.enable_thinking = !!enableThinking;
  return (tokenizer as TokenizerWithChatTemplate).apply_chat_template(messages, templateOpts);
}

function stripGemma4ControlTokens(raw: string): string {
  return raw
    .replace(/<bos>|<eos>|<pad>|<\|turn>|<turn\|>|<\|think\|>/g, "")
    .replace(/<\|channel>|<channel\|>/g, "")
    .trim();
}

function parseGemma4Output(raw: string): { thinking: string | null; response: string } {
  const match = raw.match(/<\|channel>(?:thought\n)?([\s\S]*?)<channel\|>/);
  if (!match) {
    return { thinking: null, response: stripGemma4ControlTokens(raw) };
  }
  const thinking = match[1]?.trim() || null;
  const response = stripGemma4ControlTokens(raw.replace(match[0], ""));
  return { thinking, response };
}

function getGemma4ThinkingParts(raw: string): {
  thinking: string;
  response: string;
  isThinking: boolean;
} {
  const match = /<\|channel>(?:thought\n)?/.exec(raw);
  if (!match) {
    return {
      thinking: "",
      response: stripGemma4ControlTokens(raw),
      isThinking: false,
    };
  }

  const thinkingStart = match.index + match[0].length;
  const closeIdx = raw.indexOf("<channel|>", thinkingStart);

  if (closeIdx === -1) {
    return {
      thinking: raw.slice(thinkingStart),
      response: "",
      isThinking: true,
    };
  }

  return {
    thinking: raw.slice(thinkingStart, closeIdx),
    response: stripGemma4ControlTokens(raw.slice(closeIdx + "<channel|>".length)),
    isThinking: false,
  };
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
    const { tokenizer, processor, model } = await TextGenerationPipeline.getInstance(
      model_id,
      (x) => reply(x as Record<string, unknown>),
      load_options
    );

    reply({ status: "loading", data: "Compiling shaders and warming up model..." });

    const warmupInputs = await buildInputs(
      model_id,
      [{ role: "user", content: "hi" }],
      false,
      tokenizer,
      processor
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (model as any).generate({ ...warmupInputs, max_new_tokens: 1 });

    reply({ status: "ready" });
  } catch (e) {
    console.error("[llm-worker] Load error:", e);
    reply({ status: "error", data: String(e) });
  }
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
    const useGemma4 = isGemma4Model(modelId);
    const { tokenizer, processor, model } = await TextGenerationPipeline.getInstance(modelId);
    const inputs = await buildInputs(
      modelId,
      messages,
      enableThinking,
      tokenizer,
      processor
    );

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

    let gemma4RawBuffer = "";
    let gemma4ThinkingLength = 0;
    let gemma4ResponseLength = 0;
    let gemma4ThinkingClosed = !enableThinking;
    const gemma4_callback = (output: string) => {
      gemma4RawBuffer += output;

      const { thinking, response, isThinking } = getGemma4ThinkingParts(gemma4RawBuffer);

      if (enableThinking && thinking) {
        const nextThinking = thinking.slice(gemma4ThinkingLength);
        if (nextThinking) {
          reply({ status: "phase", phase: "thinking" });
          reply({ status: "thinking", content: nextThinking, tps, numTokens });
          gemma4ThinkingLength = thinking.length;
        } else if (isThinking) {
          reply({ status: "phase", phase: "thinking" });
        }
      }

      if (!isThinking && !gemma4ThinkingClosed && enableThinking) {
        gemma4ThinkingClosed = true;
        reply({ status: "thinking-done", content: thinking.trim(), tps, numTokens });
        reply({ status: "phase", phase: "generating" });
      }

      if (response) {
        const nextResponse = response.slice(gemma4ResponseLength);
        if (nextResponse) {
          reply({ status: "phase", phase: "generating" });
          reply({ status: "update", output: nextResponse, tps, numTokens });
          gemma4ResponseLength = response.length;
        }
        return;
      }

      if (!enableThinking || !thinking) {
        reply({ status: "phase", phase: "generating" });
      }
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

    const streamTokenizer =
      (processor as Gemma4Processor | null)?.tokenizer ?? tokenizer;
    if (!streamTokenizer) {
      throw new Error("No tokenizer available for streaming");
    }
    const streamer = new TextStreamer(streamTokenizer, {
      skip_prompt: true,
      skip_special_tokens: !useGemma4,
      callback_function: useHarmony ? harmony_callback : useGemma4 ? gemma4_callback : think_callback,
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
    } else if (useGemma4 && gemma4RawBuffer) {
      const { thinking, response } = parseGemma4Output(gemma4RawBuffer);
      if (enableThinking && thinking && !gemma4ThinkingClosed) {
        reply({ status: "phase", phase: "thinking" });
        reply({ status: "thinking-done", content: thinking, tps, numTokens });
      }
      const finalResponse = response || stripGemma4ControlTokens(gemma4RawBuffer);
      if (finalResponse.length > gemma4ResponseLength) {
        reply({ status: "phase", phase: "generating" });
        reply({ status: "update", output: finalResponse.slice(gemma4ResponseLength), tps, numTokens });
      }
    }

    if (!useHarmony && !useGemma4 && !thinkingDone && thinkBuffer.length > 0) {
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
      TextGenerationPipeline.processor = null;
      TextGenerationPipeline.model = null;
      TextGenerationPipeline.model_id = null;
      TextGenerationPipeline.load_options = null;
      reply({ status: "cacheCleared", modelId: modelId ?? null });
      break;
  }
};
