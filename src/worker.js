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
        try { await this.model.dispose(); } catch {}
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
async function load(model_id, load_options = {}) {
  self.postMessage({ status: "loading", data: "Loading model..." });

  try {
    const [tokenizer, model] = await TextGenerationPipeline.getInstance(
      model_id,
      (x) => self.postMessage(x),
      load_options,
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
async function generate(messages, {
  maxTokens = 4096,
  enableThinking = true,
  do_sample = false,
  temperature = 0.7,
  top_p = 0.95,
  top_k = 50,
  repetition_penalty = 1.1,
} = {}) {
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

    // Harmony path — collect all tokens, parse once at end
    let harmonyRawBuffer = "";
    const harmony_callback = (output) => {
      harmonyRawBuffer += output;
      self.postMessage({ status: "phase", phase: "generating" });
    };

    // <think> path — Qwen3, DeepSeek R1, etc.
    // When enableThinking=true: prompt ends with "<think>\n", model generates thinking then emits
    // "</think>" as a regular text token, then the response. Everything before </think> is thinking.
    // When enableThinking=false: prompt already contains "<think>\n\n</think>\n\n", model goes
    // straight to the response — no </think> will appear in the output.
    let fullOutput = "";
    let thinkingDone = !enableThinking; // if thinking disabled, skip straight to response mode
    let thinkBuffer = "";

    const think_callback = (output) => {
      fullOutput += output;

      if (!thinkingDone) {
        const closeIdx = fullOutput.indexOf("</think>");
        if (closeIdx !== -1) {
          thinkingDone = true;
          thinkBuffer = fullOutput.slice(0, closeIdx).trim();
          self.postMessage({ status: "thinking-done", content: thinkBuffer, tps, numTokens });
          const afterClose = fullOutput.slice(closeIdx + "</think>".length).trimStart();
          self.postMessage({ status: "phase", phase: "generating" });
          if (afterClose) self.postMessage({ status: "update", output: afterClose, tps, numTokens });
          return;
        }

        // Still inside think block — stream to thinking
        thinkBuffer = fullOutput;
        self.postMessage({ status: "phase", phase: "thinking" });
        self.postMessage({ status: "thinking", content: output, tps, numTokens });
        return;
      }

      // Response mode
      if (fullOutput === output) {
        // First response chunk — signal generating phase
        self.postMessage({ status: "phase", phase: "generating" });
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
        self.postMessage({ status: "phase", phase: "thinking" });
        self.postMessage({ status: "thinking-done", content: thinking, tps, numTokens });
      }
      self.postMessage({ status: "phase", phase: "generating" });
      self.postMessage({ status: "update", output: response || harmonyRawBuffer.trim(), tps, numTokens });
    }

    if (!useHarmony && !thinkingDone && thinkBuffer.length > 0) {
      // Generation ended without </think> — all tokens were thinking
      self.postMessage({ status: "thinking-done", content: thinkBuffer, tps, numTokens });
      self.postMessage({ status: "phase", phase: "generating" });
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
      load(modelId || "onnx-community/gpt-oss-20b-ONNX", e.data.options ?? {});
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
      TextGenerationPipeline.load_options = null;
      self.postMessage({ status: "cacheCleared", modelId: modelId ?? null });
      break;
  }
});
