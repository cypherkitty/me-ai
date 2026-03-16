/** ONNX model catalog — delegates to me-ai-core. */
export { getOnnxModels as getModels, getOnnxModelGroups as getModelGroups, getOnnxModelInfo as getModelInfo } from "./core.js";
export type { OnnxModel as Model, OnnxModelGroup as ModelGroup } from "./core.js";

import { getOnnxModels, getOnnxModelGroups } from "./core.js";

/** All ONNX models as a flat array. Populated once core is ready. */
export const MODELS = getOnnxModels();

/** ONNX models grouped by family. */
export const MODEL_GROUPS = getOnnxModelGroups();
