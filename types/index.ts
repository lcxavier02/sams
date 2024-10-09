export type UserPayload = {
  id: string;
  username: string;
  iat?: number; // Opcional: "issued at" timestamp
  exp?: number; // Opcional: Expiration timestamp
};