/** Available ONNX models for browser inference */
export const MODELS = [
  { id: "onnx-community/Qwen3-0.6B-ONNX", name: "Qwen3 0.6B", size: "~400 MB", description: "Fastest, best for quick answers" },
  { id: "onnx-community/Qwen3-1.7B-ONNX", name: "Qwen3 1.7B", size: "~1.1 GB", description: "Balanced speed and quality" },
  { id: "onnx-community/Qwen3-4B-ONNX", name: "Qwen3 4B", size: "~2.6 GB", description: "Better reasoning, slower" },
  { id: "onnx-community/DeepSeek-R1-Distill-Qwen-1.5B-ONNX", name: "DeepSeek R1 1.5B", size: "~1 GB", description: "Strong reasoning, CoT focused" },
  { id: "onnx-community/Phi-4-mini-instruct-ONNX", name: "Phi-4 Mini", size: "~2.5 GB", description: "Microsoft, good at reasoning" },
  { id: "onnx-community/Phi-3-mini-128k-instruct-ONNX", name: "Phi-3 Mini 128k", size: "~2.6 GB", description: "128k context, reliable" },
  { id: "onnx-community/gemma-3-270m-it-ONNX", name: "Gemma 3 270M", size: "~190 MB", description: "Smallest, ultra fast" },
];
