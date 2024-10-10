import { model, models, Schema, Types } from "mongoose";

const articleSchema = new Schema({
  title: { type: String, required: true, trim: true },
  authors: [{ type: String, required: true, trim: true }],
  publication_date: { type: Date, required: true },
  keywords: [{ type: String, trim: true }],
  abstract: { type: String, trim: true },
  journal: { type: String, trim: true },
  doi: { type: String, unique: true, trim: true },
  pages: [{ type: String, trim: true }],
  user: { type: Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

export const Article = models?.Article || model('Article', articleSchema);
