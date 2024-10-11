import { model, models, Schema, Types } from "mongoose";

/**
 * Defines the schema for an article in the MongoDB database using Mongoose.
 * 
 * This schema outlines the structure for the Article document, including fields
 * such as title, authors, publication date, keywords, abstract, journal, DOI, pages,
 * and the user who created the article. It also ensures that certain fields are required
 * and properly formatted, such as trimming spaces, ensuring the uniqueness of the DOI,
 * and linking the article to a user via ObjectId reference.
 * 
 * The schema also automatically adds `createdAt` and `updatedAt` timestamps for each document.
 * 
 * Fields:
 * - `title`: The title of the article (required, trimmed).
 * - `authors`: An array of authors for the article (required, each trimmed).
 * - `publication_date`: The date the article was published (required).
 * - `keywords`: An array of keywords related to the article (each trimmed).
 * - `abstract`: A brief abstract of the article (trimmed).
 * - `journal`: The journal where the article was published (trimmed).
 * - `doi`: The unique Digital Object Identifier (DOI) of the article (unique, trimmed).
 * - `pages`: An array of page numbers or ranges associated with the article (trimmed).
 * - `user`: The user (ObjectId) who created the article, referencing the `User` model (required).
 * 
 * @type {Schema}
 */
const articleSchema: Schema = new Schema({
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
