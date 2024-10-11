import mongoose from "mongoose";

/**
 * Establishes a connection to the MongoDB database using the Mongoose library.
 * 
 * This function checks if the environment variable `MONGODB_URI` is defined, and if so,
 * it establishes a connection to the MongoDB database using that URI.
 * 
 * @throws {Error} Throws an error if the `MONGODB_URI` environment variable is not defined.
 * 
 * @returns {Promise<mongoose.Connection> | Promise<typeof mongoose>} Returns a promise that resolves to the current or new mongoose connection.
 * 
 */
export function mongooseConnect(): Promise<mongoose.Connection> | Promise<typeof mongoose> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI environment variable is not defined");
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection.asPromise();
  } else {
    return mongoose.connect(uri);
  }
}
