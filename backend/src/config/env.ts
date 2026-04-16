import 'dotenv/config';
import { z } from 'zod';

const optionalNonEmpty = z.preprocess(
  (value) => {
    if (typeof value !== 'string') return value;
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  },
  z.string().min(1).optional(),
);

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3333),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required.'),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required.'),
  RESEND_API_KEY: optionalNonEmpty,
  EMAIL_FROM: optionalNonEmpty,
  URL_FRONTEND: z.preprocess(
    (value) => {
      if (typeof value !== 'string') return value;
      const trimmed = value.trim();
      return trimmed.length > 0 ? trimmed : undefined;
    },
    z.string().url('URL_FRONTEND must be a valid URL.').optional(),
  ),
  CORS_ORIGINS: optionalNonEmpty,
}).superRefine((data, ctx) => {
  if (data.NODE_ENV === 'production' && !data.CORS_ORIGINS && !data.URL_FRONTEND) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'In production, set CORS_ORIGINS or URL_FRONTEND.',
      path: ['CORS_ORIGINS'],
    });
  }
});

const parsedEnvResult = envSchema.safeParse(process.env);

if (!parsedEnvResult.success) {
  const issues = parsedEnvResult.error.issues
    .map((issue) => {
      const path = issue.path.length > 0 ? issue.path.join('.') : 'ENV';
      return `- ${path}: ${issue.message}`;
    })
    .join('\n');

  throw new Error(`Invalid environment variables:\n${issues}`);
}

const parsedEnv = parsedEnvResult.data;
const corsOrigins = (parsedEnv.CORS_ORIGINS ?? '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

export const env = {
  nodeEnv: parsedEnv.NODE_ENV,
  isProduction: parsedEnv.NODE_ENV === 'production',
  port: parsedEnv.PORT,
  databaseUrl: parsedEnv.DATABASE_URL,
  jwtSecret: parsedEnv.JWT_SECRET,
  resendApiKey: parsedEnv.RESEND_API_KEY,
  emailFrom: parsedEnv.EMAIL_FROM,
  frontendUrl: parsedEnv.URL_FRONTEND,
  corsOrigins,
};
