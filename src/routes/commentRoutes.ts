import express from "express";
const router = express.Router();
import commentsController from "../controllers/commentController";
import { authMiddleware } from "../controllers/authController";

router.get("/", commentsController.getAll.bind(commentsController));

//router.get("/:postId", commentsController.getCommentsByPostId);

router.post("/", authMiddleware, commentsController.createItem.bind(commentsController));

router.put("/:id", authMiddleware, commentsController.updateItem.bind(commentsController));

router.delete("/:id", authMiddleware, commentsController.deleteItem.bind(commentsController));

export default router;