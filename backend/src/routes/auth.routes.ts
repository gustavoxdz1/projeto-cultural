import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { randomBytes } from 'node:crypto';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { env } from '../config/env';

export const authRoutes = Router();

authRoutes.post('/cadastro', async (req, res) => {
  const bodySchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    receiveUpdates: z.boolean().optional(),
  });

  const { name, email, password, receiveUpdates } = bodySchema.parse(req.body);

  const userExists = await prisma.user.findUnique({
    where: { email },
  });

  if (userExists) {
    return res.status(409).json({ message: 'E-mail já cadastrado.' });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: passwordHash,
      role: 'USER',
      receiveUpdates: receiveUpdates ?? false,
    },
  });

  return res.status(201).json({
    message: 'Usuário cadastrado com sucesso.',
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      receiveUpdates: user.receiveUpdates,
    },
  });
});

authRoutes.post('/login', async (req, res) => {
  const bodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { email, password } = bodySchema.parse(req.body);

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return res.status(401).json({ message: 'Credenciais inválidas.' });
  }

  const passwordMatches = await bcrypt.compare(password, user.password);

  if (!passwordMatches) {
    return res.status(401).json({ message: 'Credenciais inválidas.' });
  }

  const token = jwt.sign(
    { role: user.role },
    env.jwtSecret,
    { subject: user.id, expiresIn: '1d' }
  );

  return res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      receiveUpdates: user.receiveUpdates,
    },
  });
});

authRoutes.post('/esqueci-senha', async (req, res) => {
  const bodySchema = z.object({
    email: z.string().email(),
  });

  const { email } = bodySchema.parse(req.body);

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return res.json({
      message: 'Se o e-mail existir, enviaremos as instruções de recuperação.',
    });
  }

  await prisma.passwordResetToken.deleteMany({
    where: { userId: user.id },
  });

  const token = randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 1000 * 60 * 30);

  await prisma.passwordResetToken.create({
    data: {
      token,
      userId: user.id,
      expiresAt,
    },
  });

  return res.json({
    message: 'Token de recuperação gerado.',
    token,
    expiresAt,
  });
});

authRoutes.post('/redefinir-senha', async (req, res) => {
  const bodySchema = z.object({
    token: z.string().min(10),
    password: z.string().min(6),
  });

  const { token, password } = bodySchema.parse(req.body);

  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
  });

  if (!resetToken) {
    return res.status(400).json({ message: 'Token inválido.' });
  }

  if (resetToken.expiresAt < new Date()) {
    await prisma.passwordResetToken.delete({
      where: { id: resetToken.id },
    });

    return res.status(400).json({ message: 'Token expirado.' });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { id: resetToken.userId },
    data: { password: passwordHash },
  });

  await prisma.passwordResetToken.delete({
    where: { id: resetToken.id },
  });

  return res.json({
    message: 'Senha redefinida com sucesso.',
  });
});