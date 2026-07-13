// Vercel serverless entrypoint. Every request under /api/* is routed here
// and handed off to the shared Hono app (server/app.ts), which contains the
// tRPC router. Runs on the Node.js runtime (needed for postgres/bcryptjs).
import { handle } from "hono/vercel";
import app from "../server/app";

export default handle(app);
