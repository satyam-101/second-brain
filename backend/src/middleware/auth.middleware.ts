import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
interface jwtPayload{
    id:number,
    email:string;
}
export interface AuthRequest extends Request{
    user?:jwtPayload
}
export const authMiddleware = (req:AuthRequest,res:Response,next:NextFunction)=>{
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({message:"Unauthorize missing token"});
    }
    const token = authHeader.split(" ")[1];
    if(!token){
        return res.status(401).json({message:"invalid token"})
    }
    try{
        const decoded = jwt.verify(
            token,  
            process.env.JWT_SECRET as string
        ) as jwtPayload;
        req.user= decoded;
        next();
    }catch(error){
         return res.status(401).json({message:"invalid token"});
    }
}