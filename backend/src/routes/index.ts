import { Router } from 'express';
import { authRoutes } from './auth.routes';
import { categoryRoutes } from './category.routes';
import { placeRoutes } from './place.routes';
import { suggestionRoutes } from './suggestion.routes';
import { perfilRoutes } from './perfil.routes';

export const routes = Router();

routes.get('/health', (_req, res) => {
  return res.json({ ok: "Server is running" });
});

routes.use('/auth', authRoutes);
routes.use('/categories', categoryRoutes);
routes.use('/places', placeRoutes);
routes.use('/suggestions', suggestionRoutes);
routes.use('/perfil', perfilRoutes);