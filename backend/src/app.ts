import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { ZodError } from "zod";
import { Prisma } from "../generated/prisma/client";
import { routes } from "./routes";


export const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof ZodError) {
    return res.status(400).json({
      message: "Validation error.",
      issues: error.format(),
    });
  }
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return res.status(400).json({
      message: "Database error.",
      code: error.code,
      meta: error.meta,
    });
  }
  console.log(error);

  return res.status(500).json({
    message: "Internal server error.",
  });
});
