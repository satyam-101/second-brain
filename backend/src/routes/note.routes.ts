import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { createNote, deleteNote, getAllNotes, getSingleNote, updateNote } from "../controllers/note.controller";
import { validateMiddleware } from "../middleware/validate.middleware";
import { createNoteSchema } from "../validators/note.validator";

const router = Router();
router.post("/",authMiddleware,validateMiddleware(createNoteSchema),createNote);
router.get("/", authMiddleware , getAllNotes);
router.get("/:id", authMiddleware , getSingleNote);
router.put("/:id", authMiddleware ,validateMiddleware(createNoteSchema), updateNote);
router.delete("/:id", authMiddleware , deleteNote);

export default router;