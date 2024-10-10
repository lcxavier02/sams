export type UserPayload = {
  id: string;
  username: string;
  iat?: number; // Opcional: "issued at" timestamp
  exp?: number; // Opcional: Expiration timestamp
};

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