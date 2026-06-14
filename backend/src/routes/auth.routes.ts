import { Router } from "express";
import { loginUser, registerUser } from "../controllers/auth.controller";
import { validateMiddleware } from "../middleware/validate.middleware";
import { loginSchema, registerSchema } from "../validators/auth.validator";

const router = Router();

router.post("/register",validateMiddleware(registerSchema),registerUser);
router.post("/login",validateMiddleware(loginSchema),loginUser);

export default router;