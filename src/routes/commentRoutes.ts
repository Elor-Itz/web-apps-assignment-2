import express from "express";
const router = express.Router();
import commentsController from "../controllers/commentController";

router.post("/", commentsController.createItem.bind(commentsController));

router.get("/", commentsController.getAll.bind(commentsController));

router.get("/:postId", commentsController.getCommentsByPostId);

router.put("/:id", commentsController.updateItem.bind(commentsController));

router.delete("/:id", commentsController.deleteItem.bind);

export default router;