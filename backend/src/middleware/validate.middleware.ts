import { NextFunction, Response } from "express"
import { AuthRequest } from "./auth.middleware"
import z from "zod"

export const validateMiddleware=(schema:z.ZodTypeAny)=>{
    return (req:AuthRequest,res:Response,next:NextFunction)=>{
        const parsedData = schema.safeParse(req.body);
        if(!parsedData.success){
            return res.status(400).json({
                message:"Invalid inputs",
                errors:parsedData.error.issues
            })
        }
        req.body = parsedData.data;
        next();
    }
}