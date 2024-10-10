import type { NextApiRequest, NextApiResponse } from "next";
import { mongooseConnect } from '@/lib/mongoose';
import { Article } from '@/models/Article';
import { jwtVerify } from 'jose';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await mongooseConnect();

  const { method } = req;

  switch (method) {
    case 'GET':
      return handleGet(req, res); // Obtener artículos
    case 'POST':
      return handlePost(req, res); // Crear artículo
    case 'PUT':
      return handlePut(req, res); // Actualizar artículo
    case 'DELETE':
      return handleDelete(req, res); // Eliminar artículo
    default:
      return res.status(405).json({ message: 'Method Not Allowed' });
  }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const jwtToken = req.cookies.jwtToken; // Obtener el JWT desde las cookies

  if (!jwtToken) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // Verificar el JWT
    const { payload } = await jwtVerify(jwtToken, new TextEncoder().encode(process.env.JWT_SECRET as string));

    // Obtener el userId desde el payload del JWT
    const userId = payload.id as string;

    if (id) {
      // Obtener un artículo por su ID y verificar que pertenece al usuario autenticado
      const article = await Article.findOne({ _id: id, user: userId });

      if (!article) {
        return res.status(404).json({ message: 'Article not found or not accessible by this user' });
      }

      return res.status(200).json(article);
    } else {
      // Obtener todos los artículos del usuario autenticado
      const articles = await Article.find({ user: userId });

      return res.status(200).json(articles);
    }
  } catch (error) {
    console.error('Error fetching articles:', error);
    return res.status(500).json({ message: 'Error fetching articles', error });
  }
}

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

async function handlePut(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query; // Obtenemos el ID del artículo que queremos actualizar
  const { title, authors, publication_date, keywords, abstract, journal, doi, pages, user } = req.body;

  if (!id) {
    return res.status(400).json({ message: 'Article ID is required' });
  }

  try {
    const updatedArticle = await Article.findByIdAndUpdate(
      id,
      { title, authors, publication_date, keywords, abstract, journal, doi, pages, user },
      { new: true, runValidators: true } // Retorna el artículo actualizado y aplica validaciones
    );

    if (!updatedArticle) {
      return res.status(404).json({ message: 'Article not found' });
    }

    return res.status(200).json(updatedArticle);
  } catch (error) {
    return res.status(500).json({ message: 'Error updating article', error });
  }
}

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
