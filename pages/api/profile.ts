import type { NextApiRequest, NextApiResponse } from "next";
import { verify } from 'jsonwebtoken';
import { UserPayload } from "@/types";

/**
 * API handler to verify the JWT token from cookies and return user information.
 * 
 * This endpoint checks for a valid `jwtToken` in the request cookies, verifies it, and 
 * extracts user information like `username` and `id` from the token payload.
 * 
 * @param {NextApiRequest} req - The incoming API request containing the JWT token in cookies.
 * @param {NextApiResponse} res - The outgoing API response containing the user information or an error message.
 * @returns {void} Returns a 200 response with the user details or a 401 error for invalid tokens.
 */
export default function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { jwtToken } = req.cookies; // Extract JWT token from cookies

  if (!jwtToken) {
    return res.status(401).json({ message: 'Token missing or invalid' });
  }

  try {
    // Verify the JWT token using the secret and cast the payload to UserPayload type
    const user = verify(jwtToken, process.env.JWT_SECRET as string) as UserPayload;

    // Respond with user information
    return res.status(200).json({
      username: user.username,
      id: user.id,
    });
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}