import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { AuthRequest, ensureAuth } from '../middlewares/auth';

export const perfilRoutes = Router();

perfilRoutes.get('/me', ensureAuth, async (req: AuthRequest, res) => {
  const userId = req.user!.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      receiveUpdates: true,
      createdAt: true,
    },
  });

  if (!user) {
    return res.status(404).json({ message: 'Usuário não encontrado.' });
  }

  return res.json(user);
});

perfilRoutes.patch('/me/preferencias', ensureAuth, async (req: AuthRequest, res) => {
  const userId = req.user!.id;

  const bodySchema = z.object({
    receiveUpdates: z.boolean(),
  });

  const { receiveUpdates } = bodySchema.parse(req.body);

  const user = await prisma.user.update({
    where: { id: userId },
    data: { receiveUpdates },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      receiveUpdates: true,
    },
  });

  return res.json(user);
});
