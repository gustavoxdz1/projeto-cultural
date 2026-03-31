import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { ensureAuth } from '../middlewares/auth';
import { ensureAdmin } from '../middlewares/ensureAdmin';
import { slugify } from '../utils/slug';

export const suggestionRoutes = Router();

suggestionRoutes.post('/', async (req, res) => {
  const bodySchema = z.object({
    name: z.string().min(2),
    description: z.string().optional(),
    address: z.string().min(5),
    neighborhood: z.string().min(2),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    categoryName: z.string().min(2),
  });

  const data = bodySchema.parse(req.body);

  const suggestion = await prisma.suggestion.create({
    data,
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
    imageUrl: z.string().url().optional().or(z.literal('')),
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
          `Local sugerido pela comunidade para o Portal Cultural.`,
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
