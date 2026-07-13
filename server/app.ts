import { Hono } from "hono";
import { cors } from "hono/cors";
import { bodyLimit } from "hono/body-limit";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./router";
import { createContext } from "./context";
import { ensureBootstrapAdmin } from "./queries/users";
import { env } from "./lib/env";

const app = new Hono();

// Allows the frontend to live on a different origin (e.g. Vercel) than this
// API (e.g. Render). Same-origin deployments (frontend+backend on one host)
// are unaffected — CORS only kicks in when the request's Origin header
// differs from the host serving it. If CORS_ORIGIN is unset, no origin is
// allowed (safe default) other than same-origin requests, which don't need
// CORS at all.
const allowedOrigins = env.corsOrigin
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  "/api/*",
  cors({
    origin: (origin) => (allowedOrigins.includes(origin) ? origin : ""),
    credentials: true,
  }),
);

app.use(bodyLimit({ maxSize: 50 * 1024 * 1024 }));
app.use("/api/trpc/*", async (c) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: c.req.raw,
    router: appRouter,
    createContext,
  });
});
app.all("/api/*", (c) => c.json({ error: "Not Found" }, 404));

// Create/promote the bootstrap admin account from ADMIN_EMAIL / ADMIN_PASSWORD
// on every cold start (no-op if it already exists with the admin role).
ensureBootstrapAdmin().catch((err) => {
  console.error("[boot] Failed to ensure bootstrap admin:", err);
});

export default app;
