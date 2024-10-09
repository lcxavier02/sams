import mongoose, { Schema, model, models, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

interface IUser extends Document {
  first_name: string;
  last_name: string;
  username: string;
  password: string;
  password_hash: string;
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  first_name: {
    type: String,
    required: true,
    trim: true
  },
  last_name: {
    type: String,
    required: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password_hash: {
    type: String,
    required: true
  }
}, { timestamps: true });

// Método para comparar contraseñas
userSchema.methods.comparePassword = function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password_hash);
};

export const User = models?.User || model<IUser>('User', userSchema);
