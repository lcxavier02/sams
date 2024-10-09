import type { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';
import { verify } from 'jsonwebtoken';

export default function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { jwtToken } = req.cookies;

  if (!jwtToken) {
    return res.status(401).json({ message: 'No hay ninguna sesión activa' });
  }

  try {
    verify(jwtToken, process.env.JWT_SECRET as string);
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
