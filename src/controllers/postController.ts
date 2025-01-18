import { Request, Response } from "express";
import postModel, { IPost } from "../models/Post";
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
}

export default new PostsController();