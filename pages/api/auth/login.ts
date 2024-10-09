import { mongooseConnect } from "@/lib/mongoose";
import { User } from "@/models/User";
import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Missing credentials' });
  }

  try {
    await mongooseConnect();

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Wrong password' });
    }

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username
      },
      process.env.JWT_SECRET as string,
      { expiresIn: '1d' }
    );

    const serializedToken = serialize('jwtToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 30,
      path: '/'
    });

    res.setHeader('Set-Cookie', serializedToken);

    return res.status(200).json({ message: 'Login successful' });

  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
}