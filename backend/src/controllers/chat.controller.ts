import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { generateEmbedding } from "../services/ai/embed.service";
import { searchVectors } from "../services/ai/pinecone.service";
import { pool } from "../db/db";
import { generateAnswer } from "../services/ai/groq.service";

export const chatWithBrain = async (req: AuthRequest, res: Response) => {
  try {
    const { question } = req.body;
    const userId = req.user!.id;

    if (!question) {
      return res.status(400).json({
        message: "Question is required",
      });
    }

    const embedding = await generateEmbedding(question);
    const matches = await searchVectors(embedding, 5, userId);

    const relevantMatches = matches.filter((match) => {
        return match.score && match.score >= 0.70;
    });

    const vectorIds = relevantMatches.map((match) => match.id);

    if (vectorIds.length === 0) {
      return res.json({
        answer: "I don't have enough information in your notes.",
        sources: [],
      });
    }

    const chunksResult = await pool.query(
      `SELECT 
          chunks.chunk_text,
          chunks.vector_id,
          notes.id AS note_id,
          notes.title,
          notes.link,
          notes.tags
       FROM chunks
       JOIN notes ON chunks.note_id = notes.id
       WHERE chunks.vector_id = ANY($1::text[])
       AND notes.user_id = $2`,
      [vectorIds, userId]
    );

    const scoreMap = new Map(relevantMatches.map((match) => [match.id, match.score]));

    const chunks = chunksResult.rows.map((row) => ({
      ...row,
      score: scoreMap.get(row.vector_id),
    }));

    const context = chunks
      .map(
        (chunk, index) =>
          `Source ${index + 1}:\nTitle: ${chunk.title}\nContent: ${chunk.chunk_text}`
      )
      .join("\n\n");

    const answer = await generateAnswer(question, context);

    res.json({
      answer,
      sources: chunks,
    });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({
      message: "Chat failed",
    });
  }
};