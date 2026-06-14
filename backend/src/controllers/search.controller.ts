import { Response } from "express";
import { generateEmbedding } from "../services/ai/embed.service";
import { searchVectors } from "../services/ai/pinecone.service";
import { pool } from "../db/db";
import { AuthRequest } from "../middleware/auth.middleware";

export const semanticSearch = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { query } = req.body;
    const userId = req.user!.id;

    if (!query) {
      return res.status(400).json({
        message: "Query required",
      });
    }

    const embedding = await generateEmbedding(query);

    const matches = await searchVectors(embedding,5,userId);

    const vectorIds = matches.map((match) => match.id);

    if (vectorIds.length === 0) {
      return res.json({
        results: [],
      });
    }

    const chunksResult = await pool.query(
      `SELECT 
          chunks.id,
          chunks.chunk_text,
          chunks.vector_id,
          chunks.chunk_index,
          notes.id AS note_id,
          notes.title,
          notes.link,
          notes.tags
       FROM chunks
       JOIN notes ON chunks.note_id = notes.id
       WHERE chunks.vector_id = ANY($1::text[])
       AND notes.user_id=$2`,
      [vectorIds,userId]
    );

    const scoreMap = new Map(
      matches.map((match) => [match.id, match.score])
    );

    const results = chunksResult.rows.map((row) => ({
      ...row,
      score: scoreMap.get(row.vector_id),
    }));

    res.json({
      results,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Search failed",
    });
  }
};