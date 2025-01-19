import commentModel, { IComment } from "../models/Comment";
import postModel from "../models/Post";
import { Request, Response } from "express";
import BaseController from "./baseController";

class CommentController extends BaseController<IComment> {
  constructor() {
      super(commentModel);
  }
  
  // Create comment
  async createItem(req: Request, res: Response) {
    const postId = req.body.postId;

    if (!postId) {
      res.status(400).send({ message: "Post Id required" });
      return;
    }

    try {
      const post = await postModel.findById(postId);
      if (post) {
        const userId = req.body.sender;
        const comment = {
          ...req.body,
          sender: userId,
        };
        req.body = comment;
        super.createItem(req, res);
      } else {
        res.status(404).send({ message: "Post not found" });
      }
    } catch (error) {
      res.status(400).send({ message: "Invalid Post Id" });
    }
  }

  // Get comments by Post ID
  async getCommentsByPostId(req: Request, res: Response): Promise<void> {
    const postId = req.params.postId;
    try {
      const comments = await this.model.find({ postId });
      res.status(200).json(comments);
    } catch (error) {
      res.status(500).send("Server Error");
    }
  }
}

export default new CommentController();