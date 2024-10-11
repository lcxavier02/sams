import type { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';
import { verify } from 'jsonwebtoken';

/**
 * API handler for user logout.
 *
 * This handler processes a POST request to log out a user by clearing the JWT token stored in the cookies.
 * It verifies the existing token and, upon success, removes the token by setting its maxAge to 0, effectively
 * logging the user out by invalidating the session.
 *
 * @param {NextApiRequest} req - The incoming API request, containing the JWT cookie for session verification.
 * @param {NextApiResponse} res - The outgoing API response, confirming the logout or returning an error message.
 * @returns {Promise<void>} Returns a response with a logout success message or an error.
 */
export default function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method now allowed' });
  }

  // Extract the JWT token from cookies
  const { jwtToken } = req.cookies;

  if (!jwtToken) {
    return res.status(401).json({ message: 'No active session found' });
  }

  try {
    verify(jwtToken, process.env.JWT_SECRET as string);

    // Serialize the token to invalidate it by setting maxAge to 0
    const serializedCookie = serialize('jwtToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/',
    });

    res.setHeader('Set-Cookie', serializedCookie);
    return res.status(200).json({ message: 'Logout successful' })
  } catch (error) {
    return res.status(401).json({ message: 'Something happened trying to log out' });
  }
}
