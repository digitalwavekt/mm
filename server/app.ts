import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./router";
import { createContext } from "./context";
import { ensureBootstrapAdmin } from "./queries/users";

const app = new Hono();

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
