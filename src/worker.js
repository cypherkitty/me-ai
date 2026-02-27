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

// ── Harmony format detection ────────────────────────────────────────
// GPT-OSS uses a channel-based format: <|channel|analysis<|message|>...
// <|channel|final<|message|>... instead of <think>...</think>.
function isHarmonyModel(model_id) {
  return model_id.includes("gpt-oss");
}

/**
 * Streaming parser for the GPT-OSS Harmony format.
 *
 * With skip_special_tokens=false, raw output looks like:
 *   <|channel|analysis<|message|[thinking]<|end|
 *   <|start|assistant<|channel|final<|message|[response]<|return|
 *
 * We buffer the stream and emit typed events as we detect boundaries.
 */
class HarmonyParser {
  constructor() {
    this.buf = "";
    this.channel = null; // null | "analysis" | "final" | "skip"
    this.thinkBuffer = "";
  }

  // Returns an array of { t, text } event objects
  push(raw) {
    this.buf += raw;
    const events = [];
    let changed = true;

    while (changed) {
      changed = false;

      if (this.channel === null) {
        const ci = this.buf.indexOf("<|channel|");
        if (ci !== -1) {
          // Drop everything before the channel marker (e.g. "<|start|assistant")
          this.buf = this.buf.slice(ci + "<|channel|".length);
          const mi = this.buf.indexOf("<|message|");
          if (mi !== -1) {
            const name = this.buf.slice(0, mi);
            this.buf = this.buf.slice(mi + "<|message|".length);
            this.channel =
              name === "analysis" ? "analysis" :
              name === "final"    ? "final"    : "skip";
            changed = true;
          }
          // else: wait for more data
        }
      } else if (this.channel === "analysis") {
        const ei = this.buf.indexOf("<|end|");
        if (ei !== -1) {
          const text = this.buf.slice(0, ei);
          this.buf = this.buf.slice(ei + "<|end|".length);
          this.channel = null;
          if (text) { this.thinkBuffer += text; events.push({ t: "think-chunk", text }); }
          events.push({ t: "think-done", text: this.thinkBuffer });
          changed = true;
        } else {
          // Stream what is safe to emit; hold back enough chars to detect "<|end|"
          const safe = this.buf.length - "<|end|".length;
          if (safe > 0) {
            const text = this.buf.slice(0, safe);
            this.buf = this.buf.slice(safe);
            this.thinkBuffer += text;
            events.push({ t: "think-chunk", text });
          }
        }
      } else if (this.channel === "final") {
        const ri = this.buf.indexOf("<|return|");
        const ei = this.buf.indexOf("<|end|");
        const stop = Math.min(
          ri === -1 ? Infinity : ri,
          ei === -1 ? Infinity : ei,
        );
        if (isFinite(stop)) {
          const text = this.buf.slice(0, stop);
          this.buf = this.buf.slice(stop);
          this.channel = null;
          if (text) events.push({ t: "content", text });
          changed = true;
        } else {
          const safe = this.buf.length - "<|return|".length;
          if (safe > 0) {
            const text = this.buf.slice(0, safe);
            this.buf = this.buf.slice(safe);
            if (text) events.push({ t: "content", text });
          }
        }
      } else {
        // skip (commentary / tool calls) — discard until <|end|
        const ei = this.buf.indexOf("<|end|");
        if (ei !== -1) {
          this.buf = this.buf.slice(ei + "<|end|".length);
          this.channel = null;
          changed = true;
        } else {
          this.buf = this.buf.slice(-"<|end|".length); // hold back tail
        }
      }
    }

    return events;
  }
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
    const modelId = TextGenerationPipeline.model_id;
    const useHarmony = isHarmonyModel(modelId);

    const [tokenizer, model] = await TextGenerationPipeline.getInstance(modelId);

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

    const token_callback_function = () => {
      startTime ??= performance.now();
      if (numTokens++ > 0) {
        tps = (numTokens / (performance.now() - startTime)) * 1000;
      }
    };

    // ── Harmony path (GPT-OSS) ─────────────────────────────────────
    let harmonyContentStarted = false;
    let harmonyThinkingStarted = false;
    let harmonyThinkingDone = false;
    const harmony = useHarmony ? new HarmonyParser() : null;

    const harmony_callback = (output) => {
      const events = harmony.push(output);
      for (const ev of events) {
        if (ev.t === "think-chunk") {
          if (!harmonyThinkingStarted) {
            harmonyThinkingStarted = true;
            self.postMessage({ status: "phase", phase: "thinking" });
          }
          self.postMessage({ status: "thinking", content: ev.text, tps, numTokens });
        } else if (ev.t === "think-done") {
          harmonyThinkingDone = true;
          self.postMessage({ status: "thinking-done", content: ev.text, tps, numTokens });
        } else if (ev.t === "content") {
          if (!harmonyContentStarted) {
            harmonyContentStarted = true;
            self.postMessage({ status: "phase", phase: "generating" });
          }
          self.postMessage({ status: "update", output: ev.text, tps, numTokens });
        }
      }
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
      // Keep special tokens for Harmony so we can parse channel boundaries
      skip_special_tokens: !useHarmony,
      callback_function: useHarmony ? harmony_callback : think_callback,
      token_callback_function,
    });

    await model.generate({
      ...inputs,
      do_sample: false,
      max_new_tokens: maxTokens,
      streamer,
      stopping_criteria,
    });

    // Safety: flush remaining Harmony buffer content
    if (useHarmony) {
      if (harmony.channel === "final" && harmony.buf.trim()) {
        self.postMessage({ status: "update", output: harmony.buf.trim(), tps, numTokens });
      }
      if (harmony.channel === "analysis" && harmony.thinkBuffer) {
        self.postMessage({ status: "thinking-done", content: harmony.thinkBuffer, tps, numTokens });
        self.postMessage({
          status: "update",
          output: "[Thinking used all tokens — no response generated. Try a shorter prompt.]",
          tps,
          numTokens,
        });
      }
      if (!harmonyContentStarted && !harmonyThinkingStarted) {
        // Model produced no recognized output — show raw buffer as fallback
        const raw = harmony.buf.replace(/<\|[^|]+\|>/g, "").trim();
        if (raw) self.postMessage({ status: "update", output: raw, tps, numTokens });
      }
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
