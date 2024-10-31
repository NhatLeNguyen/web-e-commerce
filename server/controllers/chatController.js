import axios from "axios";
import dotenv from "dotenv";

const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;

export const sendMessageToHuggingFace = async (message, context) => {
  const prompt = `${context}\nUser: ${message}\nAI:`;

  const response = await axios.post(
    "https://api-inference.huggingface.co/models/EleutherAI/gpt-j-6B",
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
};
