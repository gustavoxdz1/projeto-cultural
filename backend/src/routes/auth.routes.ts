import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { randomBytes } from 'node:crypto';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { env } from '../config/env';
import { enviarEmailBoasVindas, enviarEamailRecuperacaoSenha } from '../services/enviarEmails';
import { emailField, passwordField, requiredText } from '../utils/validation';

export const authRoutes = Router();

authRoutes.post('/cadastro', async (req, res) => {
  const bodySchema = z.object({
    name: requiredText('Nome', 2),
    email: emailField,
    password: passwordField,
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

  try {
    await enviarEmailBoasVindas(user.name, user.email);
  } catch (error) {
    console.error('Erro ao enviar e-mail de boas-vindas:', error);
  }

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
    email: emailField,
    password: passwordField,
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
    email: emailField,
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

  try {
    await enviarEamailRecuperacaoSenha(user.name, user.email, token);
  } catch (error) {
    console.error('Erro ao enviar e-mail de recuperação de senha:', error);

    await prisma.passwordResetToken.deleteMany({
      where: { userId: user.id },
    });

    return res.status(500).json({ message: 'Não foi possível enviar o e-mail de recuperação.' });
  }

  return res.json({
    message: 'Se o e-mail existir, enviaremos as instruções de recuperação.',
  });
});

authRoutes.post('/redefinir-senha', async (req, res) => {
  const bodySchema = z.object({
    token: requiredText('Token', 10),
    password: passwordField,
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
