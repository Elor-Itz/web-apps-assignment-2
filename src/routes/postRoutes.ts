import express from "express";
const router = express.Router();
import postsController from "../controllers/postController";
import { authMiddleware } from "../controllers/authController";

router.get("/", postsController.getAll.bind(postsController));

router.get("/:id", postsController.getById.bind(postsController));

router.post("/", authMiddleware, postsController.createItem.bind(postsController));

router.put("/:id", authMiddleware, postsController.updateItem.bind(postsController));

router.delete("/:id", authMiddleware, postsController.deleteItem.bind(postsController));

export default router;