import { Router } from "express";
import { semanticSearch } from "../controllers/search.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/",authMiddleware,semanticSearch)

export default router;