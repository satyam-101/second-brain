import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.get("/",(req,res)=>{
    res.json({
        message:"second brain api is running"
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`server listening on port ${PORT}`);
})