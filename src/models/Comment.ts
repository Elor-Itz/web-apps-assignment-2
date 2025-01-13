import mongoose from "mongoose";

export interface IComment {
  postId: string;
  content: string;
  sender: String;  
}

const commentSchema = new mongoose.Schema<IComment>({
  postId: {
    type: String,
    ref: 'Post',
    required: true 
  },
  content: {
    type: String, 
    required: true 
  },
  sender: {
      type: String,
      ref: 'User', 
      required: true,
    },  
});

const commentsModel = mongoose.model<IComment>("Comments", commentSchema);

export default commentsModel;