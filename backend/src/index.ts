import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {pool} from "./db/db";
import authRoutes from "./routes/auth.routes"
import noteRoutes from "./routes/note.routes"
import searchRoutes from "./routes/search.routes";
import chatRoutes from "./routes/chat.route";
import { authMiddleware, AuthRequest } from "./middleware/auth.middleware";
import { pineconeIndex } from "./services/ai/pinecone.service";
import { generateEmbedding} from './services/ai/embed.service'

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.get("/",(req,res)=>{
    res.json({
        message:"second brain api is running"
    });
});

app.use("/api/auth",authRoutes);
app.use("/api/notes",noteRoutes)
app.use("/api/search",searchRoutes);
app.use("/api/chat", chatRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`server listening on port ${PORT}`);
})