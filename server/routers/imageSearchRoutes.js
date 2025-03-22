import { Router } from "express";
import multer from "multer";
const router = Router();
import cosineSimilarity from "cosine-similarity";
import { unlinkSync } from "fs";
import { basename } from "path";
import {
  precomputeFeatures,
  extractFeatures,
} from "../utils/precomputeFeatures.js";

const upload = multer({ dest: "uploads/" });

let datasetFeatures = [];
let datasetPaths = [];

(async () => {
  const { datasetFeatures: features, datasetPaths: paths } =
    await precomputeFeatures();
  datasetFeatures = features;
  datasetPaths = paths;
  console.log("Dataset features loaded");
})();

router.post("/search", upload.single("image"), async (req, res) => {
  try {
    const queryFeatures = await extractFeatures(req.file.path);

    const similarities = datasetFeatures.map((features, index) => ({
      path: datasetPaths[index],
      similarity: cosineSimilarity(queryFeatures, features),
    }));

    const results = similarities
      .filter((result) => result.similarity >= 0.5)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 5)
      .map((result) => {
        const filename = basename(result.path);
        let productName;
        try {
          const parts = filename.split("_");
          const productNameParts = parts[1]
            ? parts.slice(1, -1)
            : ["Unknown Product"];
          productName = productNameParts
            .join(" ")
            .toLowerCase()
            .replace("_", " ");
        } catch (e) {
          productName = "Unknown Product";
        }
        return {
          path: `http://localhost:5173/dataset${
            result.path.split("dataset")[1]
          }`,
          productName,
          similarity: result.similarity,
        };
      });

    unlinkSync(req.file.path);

    if (results.length === 0) {
      return res.json({
        message: "Không tìm thấy sản phẩm tương tự trong dataset.",
      });
    }

    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;
