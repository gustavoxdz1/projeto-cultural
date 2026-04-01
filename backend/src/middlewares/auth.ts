import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

type JwtPayload = {
  sub: string;
  role: string;
};

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export function ensureAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Token não informado.' });
  }

  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({
      message: 'Formato de autorização inválido. Use Bearer token.',
    });
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret) as JwtPayload;

    req.user = {
      id: decoded.sub,
      role: decoded.role,
    };

    return next();
  } catch {
    return res.status(401).json({ message: 'Token inválido.' });
  }
}
