import type { NextApiRequest, NextApiResponse } from "next";
import { mongooseConnect } from '@/lib/mongoose';
import { Article } from '@/models/Article';
import { jwtVerify } from 'jose';

/**
 * API handler to search articles by title or DOI, ensuring the articles belong to the authenticated user.
 * 
 * This endpoint performs a search based on the user's input for the `term` (search query) and `searchBy` (whether to search by title or DOI).
 * It first verifies the JWT token to ensure the request is made by an authenticated user, then filters articles accordingly.
 * 
 * @param {NextApiRequest} req - The incoming API request containing search parameters (`term`, `searchBy`) and JWT token.
 * @param {NextApiResponse} res - The outgoing API response containing search results or an error message.
 * @returns {void} Returns a 200 response with the list of matching articles or an appropriate error message.
 */
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await mongooseConnect();

  const { method } = req;

  if (method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { term, searchBy } = req.query;

  if (!term || !searchBy) {
    return res.status(400).json({ message: 'Missing search parameters' });
  }

  const jwtToken = req.cookies.jwtToken; // Get JWT token from cookies

  if (!jwtToken) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // Verify the JWT token and extract the payload
    const { payload } = await jwtVerify(jwtToken, new TextEncoder().encode(process.env.JWT_SECRET as string));

    const userId = payload.id as string;

    let articles = [];

    // Define the query to find articles by user ID and search term
    const query: any = { user: userId };

    // Determine whether to search
    if (searchBy === 'title') {
      query.title = { $regex: term, $options: 'i' };
    } else if (searchBy === 'doi') {
      query.doi = { $regex: term, $options: 'i' };
    } else {
      return res.status(400).json({ message: 'Invalid search type' });
    }

    articles = await Article.find(query);

    if (articles.length === 0) {
      return res.status(404).json({ message: 'No articles found' });
    }

    return res.status(200).json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    return res.status(500).json({ message: 'Error fetching articles', error });
  }
}
