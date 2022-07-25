import mongoose, { Schema } from "mongoose";

interface PostType {
  postId: string;
  caption: string;
  media: [string];
  author: string;
  postedAt: Date;
}

// TODO: Implement
const postSchema = new Schema<PostType>({});
