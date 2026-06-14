import { Request, Response } from "express";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import { pool } from "../db/db";

export const registerUser=async(req:Request,res:Response)=>{
    try{
        const {name,email,password} =req.body;
        if(!name||!email||!password){
            return res.status(400).json({message:"All fields are required"});
        }
        const existingUser = await pool.query(
            "SELECT * FROM users WHERE email=$1",
            [email]
        );
        if(existingUser.rows.length>0){
            return res.status(409).json({message:"User already exists"});
        }
        const hashedPassword = await bcrypt.hash(password,10);
        const newUser = await pool.query(
            `INSERT INTO users (name,email,password)
            VALUES($1,$2,$3)
            RETURNING id,name,email,created_at`,
            [name,email,hashedPassword]
        );
        res.status(201).json({
            message:"User registered successfully",
            user:newUser.rows[0],
        });
    }catch(error){
        console.error("Register error:"+error);
        res.status(500).json({message:"Internal server error"});
    }
};

export const loginUser =async(req:Request,res:Response)=>{
    try{
        const{email,password}= req.body;
        if(!email||!password){
            return res.status(400).json({message:"email and password required"});
        }
        const userResult = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );
        if(userResult.rows.length ===0){
            return res.status(401).json({message:"Invalid credentials"});
        }
        const user = userResult.rows[0];
        const isPasswordCorrect = await bcrypt.compare(password,user.password);
        if(!isPasswordCorrect){
            return res.status(401).json({message:"Invalid credentials"});
        }
        const token = jwt.sign(
            {
                id:user.id,
                email:user.email
            },
            process.env.JWT_SECRET as string,
            {expiresIn:"7d"}
        );
        res.status(200).json({
            message:"Login successful",
            token,
            user:{
                id:user.id,
                name:user.name,
                email:user.email
            },
        });
    }catch(error){
        console.error("login error:"+error);
        res.status(500).json({message:"Internal Server error"});
    }
}