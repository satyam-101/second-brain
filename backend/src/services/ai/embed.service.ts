import { InferenceClient } from "@huggingface/inference";
import dotenv from "dotenv";

dotenv.config();

const hf = new InferenceClient(process.env.HF_API_KEY);

export const generateEmbedding = async (text: string): Promise<number[]> => {
  const result = await hf.featureExtraction({
    model: process.env.HF_EMBEDDING_MODEL as string,
    inputs: text,
    provider: "hf-inference",
  });

  const embedding = result as number[];

  if (!Array.isArray(embedding)) {
    throw new Error("Invalid embedding response");
  }

  return embedding;
};