import { model, models, Schema, Types } from "mongoose";

const articleSchema = new Schema({
  title: { type: String },
  authors: [{ type: String }],
  publication_date: { type: Date },
  keywords: [{ type: String }],
  abstract: { type: String },
  journal: { type: String },
  doi: { type: String },
  pages: [{ type: String }],
  user: { type: Types.ObjectId, ref: 'User', required: true },
});

export const Article = models?.Article || model('Article', articleSchema);