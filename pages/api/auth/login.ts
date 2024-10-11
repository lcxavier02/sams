import { mongooseConnect } from "@/lib/mongoose";
import { User } from "@/models/User";
import type { NextApiRequest, NextApiResponse } from "next";
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie'

/**
 * API handler for user login and JWT authentication.
 *
 * This handler processes a POST request with the user's credentials (`username` and `password`),
 * verifies the credentials, generates a JWT token upon successful authentication, and sets the
 * token in an HTTP-only cookie.
 *
 * @param {NextApiRequest} req - The incoming API request, containing the user's credentials.
 * @param {NextApiResponse} res - The outgoing API response, with the login status or an error message.
 * @returns {Promise<void>} Returns a response with a login success message or an error.
 */
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

    // Compare the provided password with the stored password hash
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Wrong password' });
    }

    // Generate a JWT token with the user's ID and username
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username
      },
      process.env.JWT_SECRET as string,
      { expiresIn: '1d' }
    );

    // Serialize the token into a cookie
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