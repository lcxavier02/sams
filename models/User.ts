import mongoose, { Schema, model, models, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * Interface representing a User document in MongoDB.
 * 
 * This interface defines the structure of the User document and includes fields
 * for the first name, last name, username, and password, as well as methods for
 * comparing passwords.
 * 
 * Fields:
 * - `first_name`: The user's first name (required, trimmed).
 * - `last_name`: The user's last name (required, trimmed).
 * - `username`: The user's unique username (required, trimmed).
 * - `password_hash`: The hashed password for the user (required).
 * 
 * Methods:
 * - `comparePassword(password: string): Promise<boolean>`: Method to compare a given password with the stored hashed password.
 * 
 * @extends {Document}
 */
interface IUser extends Document {
  first_name: string;
  last_name: string;
  username: string;
  password: string;
  password_hash: string;
  comparePassword(password: string): Promise<boolean>;
}

/**
 * Mongoose schema defining the structure of the User document.
 * 
 * The schema includes fields for the user's first name, last name, username, and
 * hashed password. It also defines a method `comparePassword` for securely comparing
 * a plain-text password with the hashed password stored in the database.
 * 
 * Fields:
 * - `first_name`: The first name of the user (required, trimmed).
 * - `last_name`: The last name of the user (required, trimmed).
 * - `username`: A unique username for the user (required, trimmed).
 * - `password_hash`: A hashed password for the user (required).
 * 
 * @type {Schema<IUser>}
 */
const userSchema: Schema<IUser> = new Schema<IUser>({
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
