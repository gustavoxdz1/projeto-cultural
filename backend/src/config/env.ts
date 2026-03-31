import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3333),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required.'),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required.'),
  RESEND_API_KEY: z.string().min(1).optional(),
  EMAIL_FROM: z.string().min(1).optional(),
  URL_FRONTEND: z.string().url().optional(),
});

const parsedEnv = envSchema.parse(process.env);

export const env = {
  port: parsedEnv.PORT,
  databaseUrl: parsedEnv.DATABASE_URL,
  jwtSecret: parsedEnv.JWT_SECRET,
  resendApiKey: parsedEnv.RESEND_API_KEY,
  emailFrom: parsedEnv.EMAIL_FROM,
  frontendUrl: parsedEnv.URL_FRONTEND ?? 'http://localhost:5173',
};
