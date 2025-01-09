import express from "express";
const router = express.Router();
import commentsController from "../controllers/commentController";

router.post("/", commentsController.addComment);

router.get("/", commentsController.getAllComments);

router.get("/:postId", commentsController.getCommentsByPostId);

router.put("/:id", commentsController.updateComment);

router.delete("/:id", commentsController.deleteComment);

export default router;