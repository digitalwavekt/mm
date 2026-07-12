import { eq } from "drizzle-orm";
import * as schema from "@db/schema";
import { getDb } from "./connection";
import { hashPassword } from "../auth/password";
import { env } from "../lib/env";

export async function findUserById(id: number) {
  const rows = await getDb()
    .select()
    .from(schema.users)
    .where(eq(schema.users.id, id))
    .limit(1);
  return rows.at(0);
}

export async function findUserByEmail(email: string) {
  const rows = await getDb()
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, email.toLowerCase()))
    .limit(1);
  return rows.at(0);
}

export async function touchLastSignIn(id: number) {
  await getDb()
    .update(schema.users)
    .set({ lastSignInAt: new Date() })
    .where(eq(schema.users.id, id));
}

/**
 * Ensures at least one admin account exists. Runs on server boot. If
 * ADMIN_EMAIL / ADMIN_PASSWORD are set and no user with that email exists
 * yet, it is created (or promoted to admin if it already exists).
 */
export async function ensureBootstrapAdmin() {
  if (!env.adminEmail || !env.adminPassword) {
    console.warn(
      "[auth] ADMIN_EMAIL / ADMIN_PASSWORD not set — skipping admin bootstrap. " +
        "Set them in your environment to auto-create the first admin account.",
    );
    return;
  }

  const existing = await findUserByEmail(env.adminEmail);
  if (existing) {
    if (existing.role !== "admin") {
      await getDb()
        .update(schema.users)
        .set({ role: "admin" })
        .where(eq(schema.users.id, existing.id));
      console.log(`[auth] Promoted ${env.adminEmail} to admin.`);
    }
    return;
  }

  const passwordHash = await hashPassword(env.adminPassword);
  await getDb().insert(schema.users).values({
    email: env.adminEmail.toLowerCase(),
    passwordHash,
    name: "Admin",
    role: "admin",
  });
  console.log(`[auth] Created bootstrap admin account for ${env.adminEmail}.`);
}
