import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../server/routers/index.js";
import { createContext } from "../server/_core/context.js";

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Debugging: log incoming request url
app.use((req, res, next) => {
  console.log(`[Vercel Express] incoming req.url: ${req.url}`);
  next();
});

app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
    onError: ({ error, path }: { error: Error; path: string | undefined }) => {
      console.error(`tRPC error on ${path}:`, error);
    },
  })
);

app.use((_req: any, res: any) => {
  res.status(404).json({ error: "Not found" });
});

// Express error handler
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error("Express Global Error:", err);
  res.status(500).json({ error: "Express Global Error", details: String(err), stack: err.stack });
});

export default function handler(req: any, res: any) {
  try {
    return app(req, res);
  } catch (err: any) {
    console.error("Vercel Handler Error:", err);
    res.status(500).json({ error: "Vercel Handler Error", details: String(err), stack: err?.stack });
  }
}
