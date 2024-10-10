import type { NextApiRequest, NextApiResponse } from "next";
import { verify } from 'jsonwebtoken';
import { UserPayload } from "@/types";

export default function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { jwtToken } = req.cookies;

  if (!jwtToken) {
    return res.status(401).json({ message: 'Token missing or invalid' });
  }

  try {
    const user = verify(jwtToken, process.env.JWT_SECRET as string) as UserPayload;

    return res.status(200).json({
      username: user.username,
      id: user.id,
    });
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}