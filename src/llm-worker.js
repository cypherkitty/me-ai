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

const _fetch = env.fetch;
env.fetch = (url, options = {}) => _fetch(url, { ...options, cache: "no-store" });

// WASM files are served from the site root (public/ in dev, copied in build).
env.backends.onnx.wasm.wasmPaths = self.location.origin + "/";

function isImageTextToTextModel(model_id) {
  return /Qwen3\.5/i.test(model_id);
}

class TextGenerationPipeline {
  static model_id = null;
  static load_options = null;
  static tokenizer = null;
  static model = null;

  static async getInstance(model_id, progress_callback = null, load_options = {}) {
    const dtype = load_options.dtype ?? "q4f16";
    const device = load_options.device ?? "webgpu";
    const optsKey = `${dtype}:${device}`;

    if (
      this.model_id !== model_id ||
      (this.load_options && `${this.load_options.dtype ?? "q4f16"}:${this.load_options.device ?? "webgpu"}` !== optsKey)
    ) {
      if (this.model?.dispose) {
        try { await this.model.dispose(); } catch { }
      }
      this.tokenizer = null;
      this.model = null;
    }
    this.model_id = model_id;
    this.load_options = { dtype, device };

    this.tokenizer ??= AutoTokenizer.from_pretrained(model_id, {
      progress_callback,
    });

    const ModelClass = isImageTextToTextModel(model_id)
      ? AutoModelForImageTextToText
      : AutoModelForCausalLM;

    this.model ??= ModelClass.from_pretrained(model_id, {
      dtype,
      device,
      progress_callback,
    });

    return Promise.all([this.tokenizer, this.model]);
  }
}

const stopping_criteria = new InterruptableStoppingCriteria();

function isHarmonyModel(model_id) {
  return model_id.includes("gpt-oss");
}

function parseHarmonyOutput(raw) {
  const finalIdx = raw.indexOf("final");
  if (finalIdx === -1) return { thinking: null, response: raw.trim() };

  const response = raw.slice(finalIdx + "final".length).trim();
  const analysisIdx = raw.indexOf("analysis");
  let thinking = null;
  if (analysisIdx !== -1) {
    const afterAnalysis = raw.slice(analysisIdx + "analysis".length);
    const endMatch = afterAnalysis.search(/assistant|final/);
    thinking = (endMatch !== -1 ? afterAnalysis.slice(0, endMatch) : afterAnalysis).trim() || null;
  }
  return { thinking, response };
}

async function check(reply) {
  try {
    if (!navigator.gpu) throw new Error("WebGPU API is not available in this browser");
    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) throw new Error("WebGPU is not supported (no adapter found)");

    const info = adapter.info || {};
    const limits = adapter.limits || {};
    reply({
      status: "webgpu-info",
      data: {
        vendor: info.vendor || "unknown",
        architecture: info.architecture || "unknown",
        device: info.device || "unknown",
        description: info.description || "unknown",
        features: adapter.features ? [...adapter.features].sort() : [],
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
    reply({ status: "error", data: e.toString() });
  }
}

async function load(model_id, load_options = {}, reply) {
  reply({ status: "loading", data: "Loading model..." });

  try {
    const [tokenizer, model] = await TextGenerationPipeline.getInstance(
      model_id,
      (x) => reply(x),
      load_options,
    );

    reply({ status: "loading", data: "Compiling shaders and warming up model..." });

    const warmupInputs = tokenizer.apply_chat_template(
      [{ role: "user", content: "hi" }],
      { add_generation_prompt: true, return_dict: true },
    );
    await model.generate({ ...warmupInputs, max_new_tokens: 1 });

    reply({ status: "ready" });
  } catch (e) {
    console.error("[llm-worker] Load error:", e);
    reply({ status: "error", data: e.toString() });
  }
}

async function generate(messages, options = {}, reply) {
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
    const useHarmony = isHarmonyModel(modelId);
    const [tokenizer, model] = await TextGenerationPipeline.getInstance(modelId);

    const templateOpts = { add_generation_prompt: true, return_dict: true };
    if (!useHarmony) templateOpts.enable_thinking = !!enableThinking;
    const inputs = tokenizer.apply_chat_template(messages, templateOpts);

    let startTime;
    let numTokens = 0;
    let tps;

    const token_callback_function = () => {
      startTime ??= performance.now();
      if (numTokens++ > 0) tps = (numTokens / (performance.now() - startTime)) * 1000;
    };

    let harmonyRawBuffer = "";
    const harmony_callback = (output) => {
      harmonyRawBuffer += output;
      reply({ status: "phase", phase: "generating" });
    };

    let fullOutput = "";
    let thinkingDone = !enableThinking;
    let thinkBuffer = "";

    const think_callback = (output) => {
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

    const streamer = new TextStreamer(tokenizer, {
      skip_prompt: true,
      skip_special_tokens: true,
      callback_function: useHarmony ? harmony_callback : think_callback,
      token_callback_function,
    });

    await model.generate({
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
        output: "[Thinking used all tokens — no response generated. Try a shorter prompt.]",
        tps, numTokens,
      });
    }
  } catch (e) {
    console.error("[llm-worker] Generation error:", e);
    reply({ status: "error", data: e.toString() });
  }

  reply({ status: "complete" });
}

self.onmessage = async (e) => {
  const { type, data, modelId, options } = e.data;
  const reply = (msg) => self.postMessage(msg);

  switch (type) {
    case "check":
      await check(reply);
      break;
    case "load":
      await load(modelId || "onnx-community/gpt-oss-20b-ONNX", e.data.options ?? {}, reply);
      break;
    case "generate":
      stopping_criteria.reset();
      await generate(data, options, reply);
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
      } catch { }
      TextGenerationPipeline.tokenizer = null;
      TextGenerationPipeline.model = null;
      TextGenerationPipeline.model_id = null;
      TextGenerationPipeline.load_options = null;
      reply({ status: "cacheCleared", modelId: modelId ?? null });
      break;
  }
};
