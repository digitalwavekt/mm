// Node.js entrypoint used for Docker / Render / any long-running Node host.
// Not used on Vercel — see /api/[...path].ts for the serverless entry.
import app from "./app";
import { env } from "./lib/env";

if (env.isProduction) {
  const { serve } = await import("@hono/node-server");
  const { serveStaticFiles } = await import("./lib/vite");
  serveStaticFiles(app);

  const port = parseInt(process.env.PORT || "3000");
  serve({ fetch: app.fetch, port }, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

export default app;
