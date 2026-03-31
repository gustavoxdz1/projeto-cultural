import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { slugify } from '../utils/slug';
import { ensureAuth } from '../middlewares/auth';
import { ensureAdmin } from '../middlewares/ensureAdmin';

export const categoryRoutes = Router();

categoryRoutes.get('/', async (_req, res) => {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  });

  return res.json(categories);
});

categoryRoutes.post('/', ensureAuth, ensureAdmin, async (req, res) => {
  const bodySchema = z.object({
    name: z.string().min(2),
  });

  const { name } = bodySchema.parse(req.body);

  const category = await prisma.category.create({
    data: {
      name,
      slug: slugify(name),
    },
  });

  return res.status(201).json(category);
});

categoryRoutes.put('/:id', ensureAuth, ensureAdmin , async (req, res) => {
  const paramsSchema = z.object({
    id: z.string().uuid(),
  });

  const bodySchema = z.object({
    name: z.string().min(2),
  });

  const { id } = paramsSchema.parse(req.params);
  const { name } = bodySchema.parse(req.body);

  const category = await prisma.category.update({
    where: { id },
    data: {
      name,
      slug: slugify(name),
    },
  });

  return res.json(category);
});

categoryRoutes.delete('/:id', ensureAuth, ensureAdmin, async (req, res) => {
  const paramsSchema = z.object({
    id: z.string().uuid(),
  });

  const { id } = paramsSchema.parse(req.params);

  const placesCount = await prisma.place.count({
    where: { categoryId: id },
  });

  if (placesCount > 0) {
    return res.status(409).json({
      message: 'Não é possível excluir uma categoria que possui locais vinculados.',
    });
  }

  await prisma.category.delete({
    where: { id },
  });

  return res.status(204).send();
});
