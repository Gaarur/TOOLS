import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../routers/index.js";
import { createContext } from "./context.js";
import { ENV } from "./env.js";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Mount tRPC
app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

// Heartbeat scheduled tasks API placeholder
app.post("/api/scheduled/:name", async (req, res) => {
  res.json({ ok: true, message: "Heartbeat triggered successfully" });
});

// OAuth Callback handler
app.get("/api/oauth/callback", async (req, res) => {
  // If the OAuth flow completes, we will get code & state query parameters
  const redirectUrl = req.query.state ? Buffer.from(req.query.state as string, "base64").toString() : "/";
  res.redirect(redirectUrl);
});

// Serve Frontend
const PORT = process.env.PORT || 5000;
const isProd = ENV.isProduction || process.env.NODE_ENV === "production";

if (isProd) {
  const clientDist = path.resolve(process.cwd(), "./dist/client");
  app.use(express.static(clientDist));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(clientDist, "index.html"));
  });
} else {
  // Vite Integration
  const { createServer: createViteServer } = await import("vite");
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "custom",
    root: path.resolve(process.cwd(), "./client"),
    configFile: path.resolve(process.cwd(), "vite.config.ts"),
  });
  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const templatePath = path.resolve(process.cwd(), "./client/index.html");
      let template = fs.readFileSync(templatePath, "utf-8");
      template = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(template);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}
export default app;
