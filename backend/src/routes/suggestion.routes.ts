import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { ensureAuth } from '../middlewares/auth';
import { ensureAdmin } from '../middlewares/ensureAdmin';

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
  });

  const { id } = paramsSchema.parse(req.params);
  const { status } = bodySchema.parse(req.body);

  const suggestion = await prisma.suggestion.update({
    where: { id },
    data: { status },
  });

  return res.json(suggestion);
});