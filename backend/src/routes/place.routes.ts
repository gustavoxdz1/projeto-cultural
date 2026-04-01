import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { ensureAuth } from '../middlewares/auth';
import { ensureAdmin } from '../middlewares/ensureAdmin';
import { optionalUrl, requiredText } from '../utils/validation';

export const placeRoutes = Router();

placeRoutes.get('/', async (req, res) => {
  const querySchema = z.object({
    search: z.string().optional(),
    category: z.string().optional(),
    neighborhood: z.string().optional(),
  });

  const { search, category, neighborhood } = querySchema.parse(req.query);

  const places = await prisma.place.findMany({
    where: {
      isActive: true,
      ...(search
        ? {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          }
        : {}),
      ...(category
        ? {
            category: {
              slug: category,
            },
          }
        : {}),
      ...(neighborhood
        ? {
            neighborhood: {
              contains: neighborhood,
              mode: 'insensitive',
            },
          }
        : {}),
    },
    include: {
      category: true,
    },
    orderBy: {
      name: 'asc',
    },
  });

  return res.json(places);
});

placeRoutes.get('/:id', async (req, res) => {
  const paramsSchema = z.object({
    id: z.string().uuid(),
  });

  const { id } = paramsSchema.parse(req.params);

  const place = await prisma.place.findFirst({
    where: {
      id,
      isActive: true,
    },
    include: {
      category: true,
    },
  });

  if (!place) {
    return res.status(404).json({ message: 'Local não encontrado.' });
  }

  return res.json(place);
});

placeRoutes.post('/', ensureAuth, ensureAdmin, async (req, res) => {
  const bodySchema = z.object({
    name: requiredText('Nome do local', 2),
    description: requiredText('Descrição', 5),
    address: requiredText('Endereço', 5),
    neighborhood: requiredText('Bairro', 2),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    imageUrl: optionalUrl('URL da imagem'),
    categoryId: z.string().uuid(),
  });

  const data = bodySchema.parse(req.body);

  const place = await prisma.place.create({
    data: {
      ...data,
      imageUrl: data.imageUrl || null,
      ...(data.latitude !== undefined ? { latitude: data.latitude } : {}),
      ...(data.longitude !== undefined ? { longitude: data.longitude } : {}),
    },
  });

  return res.status(201).json(place);
});

placeRoutes.put('/:id', ensureAuth, ensureAdmin, async (req, res) => {
  const paramsSchema = z.object({
    id: z.string().uuid(),
  });

  const bodySchema = z.object({
    name: requiredText('Nome do local', 2),
    description: requiredText('Descrição', 5),
    address: requiredText('Endereço', 5),
    neighborhood: requiredText('Bairro', 2),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    imageUrl: optionalUrl('URL da imagem'),
    categoryId: z.string().uuid(),
  });

  const { id } = paramsSchema.parse(req.params);
  const data = bodySchema.parse(req.body);

  const place = await prisma.place.update({
    where: { id },
    data: {
      ...data,
      imageUrl: data.imageUrl || null,
      ...(data.latitude !== undefined ? { latitude: data.latitude } : {}),
      ...(data.longitude !== undefined ? { longitude: data.longitude } : {}),
    },
  });

  return res.json(place);
});

placeRoutes.delete('/:id', ensureAuth, ensureAdmin, async (req, res) => {
  const paramsSchema = z.object({
    id: z.string().uuid(),
  });

  const { id } = paramsSchema.parse(req.params);

  await prisma.place.update({
    where: { id },
    data: { isActive: false },
  });

  return res.status(204).send();
});
