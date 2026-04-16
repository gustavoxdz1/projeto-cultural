import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { ZodError } from "zod";
import { Prisma } from "../generated/prisma/client";
import { routes } from "./routes";
import { getPrismaErrorResponse } from "./utils/prismaError";
import { env } from "./config/env";

export const app = express();

const developmentOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:4173",
  "http://127.0.0.1:4173",
];

const allowedOrigins = new Set<string>([
  ...env.corsOrigins,
  ...(env.frontendUrl ? [env.frontendUrl] : []),
  ...(!env.isProduction ? developmentOrigins : []),
]);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }

      callback(null, allowedOrigins.has(origin));
    },
  }),
);
app.use(express.json());
app.use(routes);

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof ZodError) {
    return res.status(400).json({
      message: "Dados inválidos.",
      issues: error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      })),
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const prismaError = getPrismaErrorResponse(error);

    return res.status(prismaError.status).json(prismaError.body);
  }

  console.log(error);

  return res.status(500).json({
    message: "Erro interno do servidor.",
  });
});
