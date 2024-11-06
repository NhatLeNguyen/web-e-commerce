import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;

export const sendMessageToHuggingFace = async (message, context) => {
  const prompt = `${context}\nUser: ${message}\nAI:`;

  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct",
      {
        inputs: prompt,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${HUGGING_FACE_API_KEY}`,
        },
      }
    );

    return response.data.generated_text.trim();
  } catch (error) {
    console.error("Error sending message to Hugging Face:", error);
    throw new Error("Failed to fetch response from Hugging Face");
  }
};
