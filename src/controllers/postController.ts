import { Request, Response } from "express";
import postModel, { IPost } from "../models/Post";
import commentsModel from "../models/Comment";
import BaseController from "./baseController";

class PostsController extends BaseController<IPost> {
  constructor() {
      super(postModel);
  }

  async createItem(req: Request, res: Response) {
      const userId = req.params.userId;
      const post = {
          ...req.body,
          sender: userId
      }
      req.body = post;
      super.createItem(req, res);
  };

  async deleteItem(req: Request, res: Response) {
    const postId = req.params.id;
    await commentsModel.deleteMany({ postId });
    super.deleteItem(req, res); 
    }
}

export default new PostsController();