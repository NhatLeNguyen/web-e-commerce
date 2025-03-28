import { loadLayersModel, node } from "@tensorflow/tfjs-node";
import { readFileSync } from "fs";
import { resolve } from "path";
import { fileURLToPath } from "url";

// Định nghĩa __dirname và __filename trong ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, "../../..");

let model;
async function loadModel() {
  const modelPath = resolve(
    __dirname,
    "ecommerce-image-search/saved-model/efficientnetb5_saved_model"
  );
  return await loadLayersModel(`file://${modelPath}`);
}

async function extractFeatures(imagePath) {
  if (!model) model = await loadModel();

  const imgBuffer = readFileSync(imagePath);
  let tensor = node
    .decodeImage(imgBuffer, 3)
    .resizeNearestNeighbor([224, 224])
    .toFloat()
    .div(255.0)
    .expandDims();

  const features = model.predict(tensor);
  return features.arraySync()[0];
}

async function precomputeFeatures() {
  const cachePath = resolve(__dirname, "dataset_features.json");
  const cache = JSON.parse(readFileSync(cachePath));
  return { datasetFeatures: cache.features, datasetPaths: cache.paths };
}

export { precomputeFeatures, extractFeatures };
