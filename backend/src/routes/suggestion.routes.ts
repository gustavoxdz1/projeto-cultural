import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { ensureAuth, type AuthRequest } from '../middlewares/auth';
import { ensureAdmin } from '../middlewares/ensureAdmin';
import { slugify } from '../utils/slug';
import { optionalText, optionalUrl, requiredText } from '../utils/validation';

export const suggestionRoutes = Router();

suggestionRoutes.post('/', ensureAuth, async (req: AuthRequest, res) => {
  const bodySchema = z.object({
    name: requiredText('Nome da sugestão', 2),
    description: optionalText,
    address: requiredText('Endereço', 5),
    neighborhood: requiredText('Bairro', 2),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    categoryName: requiredText('Categoria', 2),
  });

  const data = bodySchema.parse(req.body);

  const suggestion = await prisma.suggestion.create({
    data: {
      ...data,
      userId: req.user!.id,
    },
  });

  return res.status(201).json(suggestion);
});

suggestionRoutes.get('/admin', ensureAuth, ensureAdmin, async (_req, res) => {
  const suggestions = await prisma.suggestion.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return res.json(suggestions);
});

suggestionRoutes.patch('/admin/:id/status', ensureAuth, ensureAdmin, async (req, res) => {
  const paramsSchema = z.object({
    id: z.string().uuid(),
  });

  const bodySchema = z.object({
    status: z.enum(['PENDING', 'APPROVED', 'REJECTED']),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    imageUrl: optionalUrl('URL da imagem'),
    categoryId: z.string().uuid().optional(),
  });

  const { id } = paramsSchema.parse(req.params);
  const { status, latitude, longitude, imageUrl, categoryId } = bodySchema.parse(req.body);

  const suggestion = await prisma.suggestion.findUnique({
    where: { id },
  });

  if (!suggestion) {
    return res.status(404).json({ message: 'Sugestão não encontrada.' });
  }

  if (status === 'APPROVED' && suggestion.status === 'APPROVED') {
    return res.status(409).json({ message: 'Esta sugestão já foi aprovada.' });
  }

  if (status !== 'APPROVED') {
    const updatedSuggestion = await prisma.suggestion.update({
      where: { id },
      data: { status },
    });

    return res.json({ suggestion: updatedSuggestion });
  }

  const finalLatitude = latitude ?? suggestion.latitude ?? null;
  const finalLongitude = longitude ?? suggestion.longitude ?? null;

  const result = await prisma.$transaction(async (tx) => {
    let category = categoryId
      ? await tx.category.findUnique({
          where: { id: categoryId },
        })
      : await tx.category.findUnique({
          where: { slug: slugify(suggestion.categoryName) },
        });

    if (!category) {
      category = await tx.category.create({
        data: {
          name: suggestion.categoryName,
          slug: slugify(suggestion.categoryName),
        },
      });
    }

    const place = await tx.place.create({
      data: {
        name: suggestion.name,
        description:
          suggestion.description?.trim() ||
          'Local sugerido pela comunidade para a SpotTech.',
        address: suggestion.address,
        neighborhood: suggestion.neighborhood,
        imageUrl: imageUrl || null,
        categoryId: category.id,
        ...(finalLatitude !== null ? { latitude: finalLatitude } : {}),
        ...(finalLongitude !== null ? { longitude: finalLongitude } : {}),
      },
      include: {
        category: true,
      },
    });

    const updatedSuggestion = await tx.suggestion.update({
      where: { id },
      data: {
        status: 'APPROVED',
        ...(finalLatitude !== null ? { latitude: finalLatitude } : {}),
        ...(finalLongitude !== null ? { longitude: finalLongitude } : {}),
      },
    });

    return {
      suggestion: updatedSuggestion,
      place,
    };
  });

  return res.json(result);
});
