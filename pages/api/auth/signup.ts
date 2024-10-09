import type { NextApiRequest, NextApiResponse } from 'next';
import { mongooseConnect } from '@/lib/mongoose';
import { User } from '@/models/User';
import bcrypt from 'bcryptjs';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { first_name, last_name, username, password } = req.body;

  if (!first_name || !last_name || !username || !password) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  try {
    await mongooseConnect();

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'El nombre de usuario ya está en uso' });
    }

    // Hashear la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear un nuevo usuario con la contraseña hasheada
    const newUser = new User({
      first_name,
      last_name,
      username,
      password_hash: hashedPassword,
    });

    await newUser.save();

    return res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error('Error en el registro:', error);
    return res.status(500).json({ message: 'Error en el servidor', error });
  }
}
