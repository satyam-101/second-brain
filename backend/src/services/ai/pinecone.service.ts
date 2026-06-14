import { Pinecone } from "@pinecone-database/pinecone";
import dotenv from "dotenv";

dotenv.config();

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY as string,
});

export const pineconeIndex = pinecone.index(
  process.env.PINECONE_INDEX_NAME as string
);

export const upsertVector = async (
  vectorId: string,
  embedding: number[],
  metadata: Record<string, any>
) => {
  await pineconeIndex.upsert({
    records: [
      {
        id: vectorId,
        values: embedding,
        metadata,
      },
    ],
  });
};

export const searchVectors = async (
  embedding: number[],
  topK: number = 5,
  userId:number
) => {
  const result = await pineconeIndex.query({
    vector: embedding,
    topK,
    includeMetadata: true,
    filter:{userId:{$eq:userId},}
  });

  return result.matches;
};

export const deleteVectors = async (vectorIds: string[]) => {
  const ids = vectorIds.filter(Boolean);

  if (ids.length === 0) return;

  await pineconeIndex.deleteMany({
    ids,
  });
};