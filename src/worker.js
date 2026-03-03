import {
  env,
  AutoTokenizer,
  AutoModelForCausalLM,
  AutoModelForImageTextToText,
  TextStreamer,
  InterruptableStoppingCriteria,
} from "@huggingface/transformers";

// HuggingFace recently migrated to XetHub CDN which doesn't support Range
// requests properly — it returns a full 200 body instead of 206 Partial.
// The uncancelled body corrupts concurrent HTTP/2 streams, causing
// JSON.parse("{") errors. Wrapping fetch with `cache: 'no-store'` prevents
// the browser from serving stale/corrupted responses from its HTTP cache.
// The transformers-cache (Cache API) still handles persistent caching.
const _fetch = env.fetch;
env.fetch = (url, options = {}) => _fetch(url, { ...options, cache: "no-store" });

function isImageTextToTextModel(model_id) {
  return /Qwen3\.5/i.test(model_id);
}

class TextGenerationPipeline {
  static model_id = null;
  static tokenizer = null;
  static model = null;

  static async getInstance(model_id, progress_callback = null) {
    if (this.model_id && this.model_id !== model_id) {
      if (this.model?.dispose) {
        try { await this.model.dispose(); } catch {}
      }
      this.tokenizer = null;
      this.model = null;
    }
    this.model_id = model_id;

    this.tokenizer ??= AutoTokenizer.from_pretrained(model_id, {
      progress_callback,
    });

    const ModelClass = isImageTextToTextModel(model_id)
      ? AutoModelForImageTextToText
      : AutoModelForCausalLM;

    this.model ??= ModelClass.from_pretrained(model_id, {
      dtype: "q4f16",
      device: "webgpu",
      progress_callback,
    });

    return Promise.all([this.tokenizer, this.model]);
  }
}

const stopping_criteria = new InterruptableStoppingCriteria();

// ── Harmony format detection (GPT-OSS) ─────────────────────────────
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

// ── Check WebGPU ────────────────────────────────────────────────────
async function check() {
  try {
    if (!navigator.gpu) throw new Error("WebGPU API is not available in this browser");
    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) throw new Error("WebGPU is not supported (no adapter found)");

    const info = adapter.info || {};
    const limits = adapter.limits || {};
    self.postMessage({
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
    self.postMessage({ status: "error", data: e.toString() });
  }
}

// ── Load model ──────────────────────────────────────────────────────
async function load(model_id) {
  self.postMessage({ status: "loading", data: "Loading model..." });

  try {
    const [tokenizer, model] = await TextGenerationPipeline.getInstance(
      model_id,
      (x) => self.postMessage(x),
    );

    self.postMessage({ status: "loading", data: "Compiling shaders and warming up model..." });

    const warmupInputs = tokenizer.apply_chat_template(
      [{ role: "user", content: "hi" }],
      { add_generation_prompt: true, return_dict: true },
    );
    await model.generate({ ...warmupInputs, max_new_tokens: 1 });

    self.postMessage({ status: "ready" });
  } catch (e) {
    console.error("[worker] Load error:", e);
    self.postMessage({ status: "error", data: e.toString() });
  }
}

// ── Streaming generation ────────────────────────────────────────────
async function generate(messages, { maxTokens = 4096, enableThinking = true } = {}) {
  try {
    const modelId = TextGenerationPipeline.model_id;
    const useHarmony = isHarmonyModel(modelId);
    const [tokenizer, model] = await TextGenerationPipeline.getInstance(modelId);

    const templateOpts = { add_generation_prompt: true, return_dict: true };
    if (!enableThinking && !useHarmony) templateOpts.enable_thinking = false;
    const inputs = tokenizer.apply_chat_template(messages, templateOpts);

    let startTime;
    let numTokens = 0;
    let tps;

    const token_callback_function = () => {
      startTime ??= performance.now();
      if (numTokens++ > 0) tps = (numTokens / (performance.now() - startTime)) * 1000;
    };

    // Harmony path — collect all tokens, parse once at end
    let harmonyRawBuffer = "";
    const harmony_callback = (output) => {
      harmonyRawBuffer += output;
      self.postMessage({ status: "phase", phase: "generating" });
    };

    // <think> path — Qwen3, DeepSeek R1, etc.
    let fullOutput = "";
    let isThinking = false;
    let thinkingDone = false;
    let thinkBuffer = "";

    const think_callback = (output) => {
      fullOutput += output;

      if (!thinkingDone) {
        if (!isThinking && fullOutput.includes("<think>")) {
          isThinking = true;
          self.postMessage({ status: "phase", phase: "thinking" });
          const afterOpen = fullOutput.split("<think>")[1] || "";
          if (afterOpen && !afterOpen.includes("</think>")) {
            thinkBuffer = afterOpen;
            self.postMessage({ status: "thinking", content: thinkBuffer, tps, numTokens });
          }
        }

        const closeIdx = fullOutput.indexOf("</think>");
        if (closeIdx !== -1) {
          thinkingDone = true;
          const openIdx = fullOutput.indexOf("<think>");
          if (openIdx !== -1) {
            thinkBuffer = fullOutput.slice(openIdx + "<think>".length, closeIdx).trim();
            self.postMessage({ status: "thinking-done", content: thinkBuffer, tps, numTokens });
          }
          const afterClose = fullOutput.slice(closeIdx + "</think>".length).trimStart();
          self.postMessage({ status: "phase", phase: "generating" });
          if (afterClose) self.postMessage({ status: "update", output: afterClose, tps, numTokens });
          return;
        }

        if (isThinking) {
          thinkBuffer += output;
          self.postMessage({ status: "thinking", content: output, tps, numTokens });
          return;
        }

        if (numTokens > 3 && !fullOutput.includes("<think>")) {
          thinkingDone = true;
          self.postMessage({ status: "phase", phase: "generating" });
          self.postMessage({ status: "update", output: fullOutput, tps, numTokens });
          return;
        }
        return;
      }

      self.postMessage({ status: "update", output, tps, numTokens });
    };

    const inputTokens = inputs.input_ids.dims[1];
    self.postMessage({ status: "start", phase: "preparing", inputTokens });

    const streamer = new TextStreamer(tokenizer, {
      skip_prompt: true,
      skip_special_tokens: true,
      callback_function: useHarmony ? harmony_callback : think_callback,
      token_callback_function,
    });

    await model.generate({
      ...inputs,
      do_sample: false,
      num_beams: 1,
      max_new_tokens: maxTokens,
      streamer,
      stopping_criteria,
    });

    if (useHarmony && harmonyRawBuffer) {
      const { thinking, response } = parseHarmonyOutput(harmonyRawBuffer);
      if (thinking) {
        self.postMessage({ status: "phase", phase: "thinking" });
        self.postMessage({ status: "thinking-done", content: thinking, tps, numTokens });
      }
      self.postMessage({ status: "phase", phase: "generating" });
      self.postMessage({ status: "update", output: response || harmonyRawBuffer.trim(), tps, numTokens });
    }

    if (!useHarmony && !thinkingDone && isThinking && thinkBuffer.length > 0) {
      self.postMessage({ status: "thinking-done", content: thinkBuffer, tps, numTokens });
      self.postMessage({
        status: "update",
        output: "[Thinking used all tokens — no response generated. Try a shorter prompt.]",
        tps, numTokens,
      });
    }
  } catch (e) {
    console.error("Generation error:", e);
    self.postMessage({ status: "error", data: e.toString() });
  }

  self.postMessage({ status: "complete" });
}

// ── Message router ──────────────────────────────────────────────────
self.addEventListener("message", async (e) => {
  const { type, data, modelId, options } = e.data;

  switch (type) {
    case "check":
      check();
      break;
    case "load":
      load(modelId || "onnx-community/gpt-oss-20b-ONNX");
      break;
    case "generate":
      stopping_criteria.reset();
      generate(data, options);
      break;
    case "interrupt":
      stopping_criteria.interrupt();
      break;
    case "reset":
      stopping_criteria.reset();
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
      } catch {}
      TextGenerationPipeline.tokenizer = null;
      TextGenerationPipeline.model = null;
      TextGenerationPipeline.model_id = null;
      self.postMessage({ status: "cacheCleared", modelId: modelId ?? null });
      break;
  }
});
