import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { pool } from "../db/db";
import { chunkText } from "../services/ai/chunk.service";
import { generateEmbedding } from "../services/ai/embed.service";
import { deleteVectors, upsertVector } from "../services/ai/pinecone.service";
export const createNote =async (req:AuthRequest,res:Response)=>{
    try{
        const {title,content,tags,link} = req.body;
        if(!content||!title){
            return res.status(400).json({message:"title and content are required"});
        }
        const userId = req.user?.id;
        const result = await pool.query(
            `INSERT INTO notes (user_id, title,content,tags,link)
            VALUES($1,$2,$3,$4,$5)
            RETURNING *`,
            [userId,title,content,tags||[],link||null]
        )
        const note = result.rows[0];

        const chunks = chunkText(content);

        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i]!;

            const embedding = await generateEmbedding(chunk);

            const vectorId = `note-${note.id}-chunk-${i}`;

            await upsertVector(vectorId, embedding, {
                userId,
                noteId: note.id,
                chunkIndex: i,
                title,
            });

            await pool.query(
                `INSERT INTO chunks (note_id, chunk_text, vector_id, chunk_index)
                VALUES ($1, $2, $3, $4)`,
                [note.id, chunk, vectorId, i]
            );
        }
        res.status(201).json({
            message:"note successfully created",
            note:result.rows[0],
        })
    }catch(error){
        console.error("notes insert error:"+error);
        res.status(500).json({message:"Internal server error"});
    }
}

export const getAllNotes = async (req:AuthRequest,res:Response)=>{
    try{
        const userId = req.user?.id;
        const result = await pool.query(
            `SELECT  * FROM notes WHERE user_id =$1 ORDER BY created_at DESC`,
            [userId]
        )
        res.json({
            message:"Notes fetched successfully",
            notes: result.rows
        })
    }catch(e){
        console.log(e);
        res.status(500).json({message:"internal server error"});
    }
}
export const getSingleNote = async (req:AuthRequest,res:Response)=>{
    try{
        const userId = req.user?.id;
        const {id} = req.params;
        const result = await pool.query(
            "SELECT * FROM notes WHERE user_id=$1 AND id=$2",
            [userId,id]
        )
        if(result.rows.length==0){
            return res.status(404).json({message:"Note not found"});
        }
        res.json({
            message:"note found",
            note:result.rows[0]
        })
    }catch(e){
        console.log(e);
        res.status(500).json({message:"internal server error"});
    }
}
export const updateNote = async(req:AuthRequest,res:Response)=>{
    try{
        const userId = req.user?.id;
        const {id} = req.params;
        const {title,content,tags,link} = req.body;
        const existingNote = await pool.query(
        `SELECT * FROM notes WHERE id = $1 AND user_id = $2`,
        [id, userId]
        );

        if (existingNote.rows.length === 0) {
        return res.status(404).json({ message: "Note not found" });
        }

        const oldChunks = await pool.query(
        `SELECT vector_id FROM chunks WHERE note_id = $1`,
        [id]
        );

        const oldVectorIds = oldChunks.rows.map((row) => row.vector_id).filter(Boolean);

        await deleteVectors(oldVectorIds);

        await pool.query(`DELETE FROM chunks WHERE note_id = $1`, [id]);
        const result =await  pool.query(
            "UPDATE notes SET title=$1,content=$2,tags=$3,link=$4,updated_at=CURRENT_TIMESTAMP WHERE id= $5 and user_id = $6 RETURNING *",
            [title,content,tags||[],link||null,id,userId]
        )
        const note =result.rows[0];

        const chunks = chunkText(content);

        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i]!;
            const embedding = await generateEmbedding(chunk);
            const vectorId = `note-${note.id}-chunk-${i}`;

            await upsertVector(vectorId, embedding, {
                userId,
                noteId: note.id,
                chunkIndex: i,
                title,
            });

            await pool.query(
                `INSERT INTO chunks (note_id, chunk_text, vector_id, chunk_index)
                VALUES ($1, $2, $3, $4)`,
                [note.id, chunk, vectorId, i]
            );
        }
        res.json({
            message:"note updated successfully",
            note:result.rows[0]
        })
    }catch(e){
        console.log(e);
        res.status(500).json({message:"internal server error"});
    }
}
export const deleteNote = async(req:AuthRequest,res:Response)=>{
    try{
        const userId=req.user?.id;
        const {id} = req.params;
        const existingNote = await pool.query(
        `SELECT * FROM notes WHERE id = $1 AND user_id = $2`,
        [id, userId]
        );

        if (existingNote.rows.length === 0) {
        return res.status(404).json({ message: "Note not found" });
        }

        const oldChunks = await pool.query(
        `SELECT vector_id FROM chunks WHERE note_id = $1`,
        [id]
        );

        const oldVectorIds = oldChunks.rows.map((row) => row.vector_id);

        await deleteVectors(oldVectorIds);
        const result = await pool.query(
            "DELETE FROM notes WHERE id =$1 AND user_id = $2 RETURNING *",
            [id,userId]
        )
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Note not found" });
        }

        res.json({
            message: "Note deleted successfully",
        });
    }catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}