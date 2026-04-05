import { Router } from "express";
import { authMiddleware } from '../middleware/auth.js';
import {
  getAll, getRelevant, getMyState,
  getOne, create, update, remove,
  markViewed, toggleRelevant,
} from "../controllers/adviceController.js";

const router = Router();

router.get("/",              authMiddleware, getAll);
router.get("/relevant",      authMiddleware, getRelevant);
router.get("/my-state",      authMiddleware, getMyState);
router.get("/:id",           authMiddleware, getOne);
router.post("/",             authMiddleware, create);
router.put("/:id",           authMiddleware, update);
router.delete("/:id",        authMiddleware, remove);
router.post("/:id/viewed",   authMiddleware, markViewed);
router.post("/:id/relevant", authMiddleware, toggleRelevant);

export default router;