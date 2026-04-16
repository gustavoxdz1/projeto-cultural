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

const normalizeOrigin = (value: string) => value.trim().replace(/\/$/, "");

const allowedOrigins = new Set<string>(
  [
    ...env.corsOrigins,
    ...(env.frontendUrl ? [env.frontendUrl] : []),
    ...(!env.isProduction ? developmentOrigins : []),
  ]
    .map(normalizeOrigin)
    .filter(Boolean),
);

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      callback(null, true);
      return;
    }

    const normalizedOrigin = normalizeOrigin(origin);

    if (allowedOrigins.has(normalizedOrigin)) {
      callback(null, true);
      return;
    }

    console.log("CORS blocked origin:", origin);
    console.log("Allowed origins:", [...allowedOrigins]);

    callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

app.use(express.json());
app.use(routes);

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof ZodError) {
    return res.status(400).json({
      message: "Dados inválidos.",
      issues: error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const prismaError = getPrismaErrorResponse(error);

    return res.status(prismaError.status).json(prismaError.body);
  }

  if (error instanceof Error && error.message.includes("not allowed by CORS")) {
    return res.status(403).json({
      message: error.message,
    });
  }

  console.log(error);

  return res.status(500).json({
    message: "Erro interno do servidor.",
  });
});