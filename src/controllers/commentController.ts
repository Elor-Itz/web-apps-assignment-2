import commentModel, { IComment } from "../models/Comment";
import { Request, Response } from "express";
import BaseController from "./baseController";

class CommentController extends BaseController<IComment> {
  constructor() {
      super(commentModel);
  }

  // Get comments by Post ID
  // async getCommentsByPostId(req: Request, res: Response): Promise<void> {
  //   const postId = req.params.id;
  //   try {
  //     const comments = await this.model.find({ postId });
  //     res.send(comments);
  //   } catch (error) {
  //     res.status(400).send((error as Error).message);
  //   }
  // }
}

export default new CommentController();