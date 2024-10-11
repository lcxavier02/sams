import type { NextApiRequest, NextApiResponse } from 'next';
import { mongooseConnect } from '@/lib/mongoose';
import { User } from '@/models/User';
import bcrypt from 'bcryptjs';

/**
 * API handler for registering a new user.
 *
 * This handler processes a POST request to register a new user. It validates the input data,
 * hashes the user's password, checks if the username is already in use, and if not, stores the user 
 * in the database. On success, a new user is created and saved in the database.
 *
 * @param {NextApiRequest} req - The incoming API request, which should include the user's first name, last name, username, and password.
 * @param {NextApiResponse} res - The outgoing API response, which includes a success or error message.
 * @returns {Promise<void>} A response containing the status of the registration process.
 */
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { first_name, last_name, username, password } = req.body;

  if (!first_name || !last_name || !username || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    await mongooseConnect();

    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash the user's password for secure storage
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      first_name,
      last_name,
      username,
      password_hash: hashedPassword,
    });

    await newUser.save();

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error in registration process:', error);
    return res.status(500).json({ message: 'Server error', error });
  }
}
