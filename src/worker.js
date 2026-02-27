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
      // Keep all output tensors on the GPU buffer between decode steps —
      // avoids GPU→CPU copies on every token, the biggest decode bottleneck.
      session_options: {
        preferredOutputLocation: "gpu-buffer",
        // Graph capture: after the first decode step the WebGPU command
        // sequence is recorded and replayed without CPU re-dispatch,
        // recovering the utilisation drop seen during autoregressive decode.
        enableGraphCapture: true,
      },
    });

    return Promise.all([this.tokenizer, this.model]);
  }
}

const stopping_criteria = new InterruptableStoppingCriteria();

// ── Harmony format detection ────────────────────────────────────────
// GPT-OSS uses a Harmony channel format. After Transformers.js decodes
// with skip_special_tokens=true (the default), all <|token|> markers are
// stripped, leaving plain channel-name boundaries:
//   analysis[thinking text]assistant[role]final[response text]
// We parse this post-hoc once generation is complete.
function isHarmonyModel(model_id) {
  return model_id.includes("gpt-oss");
}

/**
 * Parse the complete GPT-OSS Harmony output (after all tokens are decoded).
 *
 * The decoded stream looks like:
 *   "analysis<thinking>assistant<role>final<response>"
 * where the channel names are literal word boundaries left after special
 * token stripping. We split on them to extract thinking and response.
 *
 * Returns { thinking: string|null, response: string }
 */
function parseHarmonyOutput(raw) {
  // Locate the "final" boundary — everything after it is the response
  const finalIdx = raw.indexOf("final");
  if (finalIdx === -1) {
    // No "final" channel found — return everything as the response
    return { thinking: null, response: raw.trim() };
  }

  const response = raw.slice(finalIdx + "final".length).trim();

  // Locate the "analysis" channel for thinking content
  const analysisIdx = raw.indexOf("analysis");
  let thinking = null;
  if (analysisIdx !== -1) {
    // Thinking is between "analysis" and the next channel marker
    // The next marker is typically "assistant" or "final"
    const afterAnalysis = raw.slice(analysisIdx + "analysis".length);
    // Find where thinking ends: at "assistant" or "final"
    const endMatch = afterAnalysis.search(/assistant|final/);
    if (endMatch !== -1) {
      thinking = afterAnalysis.slice(0, endMatch).trim();
    } else {
      thinking = afterAnalysis.trim();
    }
  }

  return { thinking: thinking || null, response };
}

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

    // Warm-up: use apply_chat_template so the full generation path
    // (including KV cache allocation and graph capture) is exercised.
    const warmupInputs = tokenizer.apply_chat_template(
      [{ role: "user", content: "hi" }],
      { add_generation_prompt: true, return_dict: true },
    );
    await model.generate({ ...warmupInputs, max_new_tokens: 1 });

    self.postMessage({ status: "ready" });
  } catch (e) {
    console.error("Load error:", e);
    self.postMessage({ status: "error", data: e.toString() });
  }
}

// ── Streaming generation ───────────────────────────────────────────
async function generate(messages, { maxTokens = 4096, enableThinking = true } = {}) {
  try {
    const modelId = TextGenerationPipeline.model_id;
    const useHarmony = isHarmonyModel(modelId);

    const [tokenizer, model] = await TextGenerationPipeline.getInstance(modelId);

    const templateOpts = {
      add_generation_prompt: true,
      return_dict: true,
    };
    // enable_thinking is a Qwen3-specific option; skip for Harmony models
    if (!enableThinking && !useHarmony) {
      templateOpts.enable_thinking = false;
    }

    const inputs = tokenizer.apply_chat_template(messages, templateOpts);

    let startTime;
    let numTokens = 0;
    let tps;

    const token_callback_function = () => {
      startTime ??= performance.now();
      if (numTokens++ > 0) {
        tps = (numTokens / (performance.now() - startTime)) * 1000;
      }
    };

    // ── Harmony path (GPT-OSS) ─────────────────────────────────────
    // Collect the full output, then parse it once generation is done.
    // Streaming per-token parsing is unreliable because Transformers.js
    // strips all <|token|> markers, leaving only plain channel names as
    // word boundaries — impossible to detect mid-stream reliably.
    let harmonyRawBuffer = "";

    const harmony_callback = (output) => {
      harmonyRawBuffer += output;
      // Keep the phase indicator alive while generating
      self.postMessage({ status: "phase", phase: "generating" });
    };

    // ── <think> path (Qwen3, DeepSeek R1, etc.) ───────────────────
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
          if (afterClose) {
            self.postMessage({ status: "phase", phase: "generating" });
            self.postMessage({ status: "update", output: afterClose, tps, numTokens });
          } else {
            self.postMessage({ status: "phase", phase: "generating" });
          }
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
      num_beams: 1,       // greedy, no beam search overhead
      max_new_tokens: maxTokens,
      streamer,
      stopping_criteria,
    });

    // Parse and emit Harmony output after generation completes
    if (useHarmony && harmonyRawBuffer) {
      const { thinking, response } = parseHarmonyOutput(harmonyRawBuffer);
      if (thinking) {
        self.postMessage({ status: "phase", phase: "thinking" });
        self.postMessage({ status: "thinking-done", content: thinking, tps, numTokens });
      }
      self.postMessage({ status: "phase", phase: "generating" });
      self.postMessage({ status: "update", output: response || harmonyRawBuffer.trim(), tps, numTokens });
    }

    // Safety: <think> path — model used all tokens without closing </think>
    if (!useHarmony && !thinkingDone && isThinking && thinkBuffer.length > 0) {
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
  }
});
