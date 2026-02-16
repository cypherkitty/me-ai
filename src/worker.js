import {
  AutoTokenizer,
  AutoModelForCausalLM,
  TextStreamer,
  InterruptableStoppingCriteria,
} from "@huggingface/transformers";

/**
 * Singleton pipeline: lazy-loads the tokenizer + model once,
 * then reuses them for every generation call.
 * When switching models, we only swap the in-memory reference but
 * Transformers.js keeps the downloaded files cached in IndexedDB.
 */
class TextGenerationPipeline {
  static model_id = null;  // Currently loaded model ID
  static tokenizer = null;
  static model = null;

  static async getInstance(model_id, progress_callback = null) {
    // If model changed, release GPU memory but DON'T clear browser cache
    if (this.model_id && this.model_id !== model_id) {
      // Dispose WebGPU resources for the old model
      if (this.model?.dispose) {
        try {
          await this.model.dispose();
        } catch (e) {
          console.warn("Model dispose failed:", e);
        }
      }
      this.tokenizer = null;
      this.model = null;
    }
    this.model_id = model_id;

    // from_pretrained uses browser cache (IndexedDB) automatically
    this.tokenizer ??= AutoTokenizer.from_pretrained(model_id, {
      progress_callback,
    });

    this.model ??= AutoModelForCausalLM.from_pretrained(model_id, {
      dtype: "q4f16",
      device: "webgpu",
      progress_callback,
    });

    return Promise.all([this.tokenizer, this.model]);
  }
}

const stopping_criteria = new InterruptableStoppingCriteria();

// ── Check WebGPU availability and report adapter info ──────────────
async function check() {
  try {
    if (!navigator.gpu) {
      throw new Error("WebGPU API is not available in this browser");
    }

    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) {
      throw new Error("WebGPU is not supported (no adapter found)");
    }

    // Gather rich GPU adapter info
    const info = adapter.info || {};
    const limits = adapter.limits || {};
    const features = adapter.features
      ? [...adapter.features].sort()
      : [];

    self.postMessage({
      status: "webgpu-info",
      data: {
        vendor: info.vendor || "unknown",
        architecture: info.architecture || "unknown",
        device: info.device || "unknown",
        description: info.description || "unknown",
        features,
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

// ── Download model + compile shaders ───────────────────────────────
async function load(model_id) {
  self.postMessage({ status: "loading", data: "Loading model..." });

  try {
    const [tokenizer, model] = await TextGenerationPipeline.getInstance(
      model_id,
      (x) => {
        self.postMessage(x);
      },
    );

    self.postMessage({
      status: "loading",
      data: "Compiling shaders and warming up model...",
    });

    // Warm-up run to compile WebGPU shaders
    const inputs = tokenizer("a");
    await model.generate({ ...inputs, max_new_tokens: 1 });

    self.postMessage({ status: "ready" });
  } catch (e) {
    console.error("Load error:", e);
    self.postMessage({ status: "error", data: e.toString() });
  }
}

// ── Streaming generation ───────────────────────────────────────────
async function generate(messages, { maxTokens = 4096, enableThinking = true } = {}) {
  try {
    const [tokenizer, model] = await TextGenerationPipeline.getInstance(
      TextGenerationPipeline.model_id
    );

    const templateOpts = {
      add_generation_prompt: true,
      return_dict: true,
    };
    if (!enableThinking) {
      templateOpts.enable_thinking = false;
    }

    const inputs = tokenizer.apply_chat_template(messages, templateOpts);

    let startTime;
    let numTokens = 0;
    let tps;

    // ── <think> tracking ──────────────────────────────────────────
    let fullOutput = "";
    let isThinking = false;    // currently inside <think>...</think>
    let thinkingDone = false;  // </think> has been seen
    let thinkBuffer = "";      // accumulated thinking text

    const token_callback_function = () => {
      startTime ??= performance.now();
      if (numTokens++ > 0) {
        tps = (numTokens / (performance.now() - startTime)) * 1000;
      }
    };

    const callback_function = (output) => {
      fullOutput += output;

      // ── Phase 1: Haven't seen </think> yet ──────────────────────
      if (!thinkingDone) {
        // Detect opening <think>
        if (!isThinking && fullOutput.includes("<think>")) {
          isThinking = true;
          self.postMessage({ status: "phase", phase: "thinking" });
          // Grab anything after <think> as thinking content
          const afterOpen = fullOutput.split("<think>")[1] || "";
          if (afterOpen && !afterOpen.includes("</think>")) {
            thinkBuffer = afterOpen;
            self.postMessage({ status: "thinking", content: thinkBuffer, tps, numTokens });
          }
        }

        // Detect closing </think>
        const closeIdx = fullOutput.indexOf("</think>");
        if (closeIdx !== -1) {
          thinkingDone = true;
          // Extract final thinking content
          const openIdx = fullOutput.indexOf("<think>");
          if (openIdx !== -1) {
            thinkBuffer = fullOutput.slice(openIdx + "<think>".length, closeIdx).trim();
            self.postMessage({ status: "thinking-done", content: thinkBuffer, tps, numTokens });
          }
          // Stream anything after </think>
          const afterClose = fullOutput.slice(closeIdx + "</think>".length).trimStart();
          if (afterClose) {
            self.postMessage({ status: "phase", phase: "generating" });
            self.postMessage({ status: "update", output: afterClose, tps, numTokens });
          } else {
            self.postMessage({ status: "phase", phase: "generating" });
          }
          return;
        }

        // Still inside <think>, stream thinking content
        if (isThinking) {
          thinkBuffer += output;
          self.postMessage({ status: "thinking", content: output, tps, numTokens });
          return;
        }

        // No <think> tag seen after a few tokens — model is responding directly
        if (numTokens > 3 && !fullOutput.includes("<think>")) {
          thinkingDone = true;
          self.postMessage({ status: "phase", phase: "generating" });
          self.postMessage({ status: "update", output: fullOutput, tps, numTokens });
          return;
        }

        return;
      }

      // ── Phase 2: After </think>, stream the real response ───────
      self.postMessage({ status: "update", output, tps, numTokens });
    };

    const inputTokens = inputs.input_ids.dims[1];

    // Let the UI know we're preparing (tokenising the prompt)
    self.postMessage({ status: "start", phase: "preparing", inputTokens });

    const streamer = new TextStreamer(tokenizer, {
      skip_prompt: true,
      skip_special_tokens: true,
      callback_function,
      token_callback_function,
    });

    await model.generate({
      ...inputs,
      do_sample: false,
      max_new_tokens: maxTokens,
      streamer,
      stopping_criteria,
    });

    // Safety: if model used all tokens and never closed </think>
    if (!thinkingDone && isThinking && thinkBuffer.length > 0) {
      self.postMessage({ status: "thinking-done", content: thinkBuffer, tps, numTokens });
      self.postMessage({
        status: "update",
        output: "[Thinking used all tokens — no response generated. Try a shorter prompt.]",
        tps,
        numTokens,
      });
    }
  } catch (e) {
    console.error("Generation error:", e);
    self.postMessage({ status: "error", data: e.toString() });
  }

  self.postMessage({ status: "complete" });
}

// ── Message router ─────────────────────────────────────────────────
self.addEventListener("message", async (e) => {
  const { type, data, modelId, options } = e.data;

  switch (type) {
    case "check":
      check();
      break;
    case "load":
      load(modelId || "onnx-community/Qwen3-0.6B-ONNX");
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
  }
});
