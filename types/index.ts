/**
 * UserPayload type
 *
 * Represents the structure of a user payload containing basic user information, 
 * including the user’s ID and username, typically used for JWTs and session-related operations.
 *
 * @property {string} id - The unique identifier for the user.
 * @property {string} username - The username of the user.
 * @property {number} [iat] - (Optional) The issued-at timestamp, often included in JWT tokens.
 * @property {number} [exp] - (Optional) The expiration timestamp, often included in JWT tokens.
 */
export type UserPayload = {
  id: string;
  username: string;
  iat?: number;
  exp?: number;
};

/**
 * ArticlePayload type
 *
 * Represents the structure of an article payload, containing detailed information about an article.
 *
 * @property {string} _id - The unique identifier for the article.
 * @property {string} title - The title of the article.
 * @property {string[]} authors - An array of authors associated with the article.
 * @property {string} publication_date - The publication date of the article in string format.
 * @property {string[]} [keywords] - (Optional) An array of keywords describing the article.
 * @property {string} [abstract] - (Optional) A brief abstract of the article.
 * @property {string} [journal] - (Optional) The name of the journal where the article was published.
 * @property {string} doi - The Digital Object Identifier (DOI) of the article.
 * @property {string[]} [pages] - (Optional) An array of strings representing page numbers in the article.
 * @property {string} user - The ID of the user (author/owner) who created the article.
 * @property {string} [createdAt] - (Optional) The creation date of the article in ISO string format.
 * @property {string} [updatedAt] - (Optional) The last updated date of the article in ISO string format.
 */
export type ArticlePayload = {
  _id: string;
  title: string;
  authors: string[];
  publication_date: string;
  keywords?: string[];
  abstract?: string;
  journal?: string;
  doi: string;
  pages?: string[];
  user: string;
  createdAt?: string;
  updatedAt?: string;
};