import postModel, { IPost } from "../models/Post";
import { Request, Response } from "express";
import BaseController from "./baseController";

class PostsController extends BaseController<IPost> {
  constructor() {
      super(postModel);
  }

  // Get posts filtered by sender
  async getPostsBySender(req: Request, res: Response): Promise<void> {
    const sender = req.query.sender as string;

    try {
      if (sender) {
        const posts = await this.model.find({ sender });
        res.send(posts);
      } else {
        const posts = await this.model.find();
        res.send(posts);
      }
    } catch (error) {
      res.status(400).send((error as Error).message);
    }
  }
}

export default new PostsController();