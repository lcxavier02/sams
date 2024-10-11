import type { NextApiRequest, NextApiResponse } from "next";
import { mongooseConnect } from '@/lib/mongoose';
import { Article } from '@/models/Article';
import { jwtVerify } from 'jose';

/**
 * API handler for managing articles. It supports GET, POST, PUT, and DELETE methods.
 * 
 * Based on the request method, it will handle fetching articles, creating a new article,
 * updating an existing article, or deleting an article.
 * 
 * @param {NextApiRequest} req - The incoming API request.
 * @param {NextApiResponse} res - The outgoing API response.
 */
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await mongooseConnect();

  const { method } = req;

  switch (method) {
    case 'GET':
      return handleGet(req, res);
    case 'POST':
      return handlePost(req, res);
    case 'PUT':
      return handlePut(req, res);
    case 'DELETE':
      return handleDelete(req, res);
    default:
      return res.status(405).json({ message: 'Method Not Allowed' });
  }
}

/**
 * Handles the GET request for fetching articles.
 * 
 * If an `id` is provided in the query, it fetches a specific article for the authenticated user.
 * Otherwise, it returns all articles associated with the authenticated user.
 * 
 * @param {NextApiRequest} req - The request object containing JWT and query parameters.
 * @param {NextApiResponse} res - The response object.
 */
async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const jwtToken = req.cookies.jwtToken; // Retreive the jwt token from the cookies

  if (!jwtToken) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const { payload } = await jwtVerify(jwtToken, new TextEncoder().encode(process.env.JWT_SECRET as string));

    const userId = payload.id as string;

    if (id) {
      const article = await Article.findOne({ _id: id, user: userId });

      if (!article) {
        return res.status(404).json({ message: 'Article not found or not accessible by this user' });
      }

      return res.status(200).json(article);
    } else {
      const articles = await Article.find({ user: userId });

      return res.status(200).json(articles);
    }
  } catch (error) {
    console.error('Error fetching articles:', error);
    return res.status(500).json({ message: 'Error fetching articles', error });
  }
}

/**
 * Handles the POST request to create a new article.
 * 
 * It expects the request body to include required fields such as `title`, `authors`, `doi`, 
 * and `user`. Upon successful creation, the new article is returned.
 * 
 * @param {NextApiRequest} req - The request object containing the article data.
 * @param {NextApiResponse} res - The response object.
 */
async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const { title, authors, publication_date, keywords, abstract, journal, doi, pages, user } = req.body;

  console.log({ title, authors, publication_date, keywords, abstract, journal, doi, pages, user });

  if (!title || !authors || !doi || !user) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const newArticle = new Article({
      title,
      authors,
      publication_date,
      keywords,
      abstract,
      journal,
      doi,
      pages,
      user,
    });

    await newArticle.save();
    return res.status(201).json(newArticle);
  } catch (error) {
    return res.status(500).json({ message: 'Error creating article', error });
  }
}

/**
 * Handles the PUT request to update an existing article by its ID.
 * 
 * The request must include the `id` of the article to update. If the article is found,
 * it is updated with the new values provided in the request body.
 * 
 * @param {NextApiRequest} req - The request object containing the updated article data.
 * @param {NextApiResponse} res - The response object.
 */
async function handlePut(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const { title, authors, publication_date, keywords, abstract, journal, doi, pages, user } = req.body;

  if (!id) {
    return res.status(400).json({ message: 'Article ID is required' });
  }

  try {
    const updatedArticle = await Article.findByIdAndUpdate(
      id,
      { title, authors, publication_date, keywords, abstract, journal, doi, pages, user },
      { new: true, runValidators: true }
    );

    if (!updatedArticle) {
      return res.status(404).json({ message: 'Article not found' });
    }

    return res.status(200).json(updatedArticle);
  } catch (error) {
    return res.status(500).json({ message: 'Error updating article', error });
  }
}

/**
 * Handles the DELETE request to remove an article by its ID.
 * 
 * The request must include the `id` of the article to delete. If the article is found,
 * it is deleted, and a success message is returned.
 * 
 * @param {NextApiRequest} req - The request object containing the article ID.
 * @param {NextApiResponse} res - The response object.
 */
async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: 'Article ID is required' });
  }

  try {
    const deletedArticle = await Article.findByIdAndDelete(id);

    if (!deletedArticle) {
      return res.status(404).json({ message: 'Article not found' });
    }

    return res.status(200).json({ message: 'Article deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting article', error });
  }
}
