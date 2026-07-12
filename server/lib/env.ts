import "dotenv/config";

function required(name: string): string {
  const value = process.env[name];
  if (!value && process.env.NODE_ENV === "production") {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value ?? "";
}

export const env = {
  isProduction: process.env.NODE_ENV === "production",

  // Database (Postgres — e.g. Supabase connection string)
  databaseUrl: required("DATABASE_URL"),

  // Auth
  jwtSecret: required("JWT_SECRET"),

  // Bootstrap admin account. On first server boot, if no admin user exists
  // yet, one is created automatically using these credentials so you can log
  // in to /admin right away. Change the password afterwards from the app,
  // or just rotate these env vars and redeploy.
  adminEmail: process.env.ADMIN_EMAIL ?? "",
  adminPassword: process.env.ADMIN_PASSWORD ?? "",

  // Email (Resend)
  resendApiKey: process.env.RESEND_API_KEY ?? "",
  emailFrom: process.env.EMAIL_FROM ?? "onboarding@resend.dev",
  notifyEmail: process.env.NOTIFY_EMAIL ?? "",

  // Supabase Storage (used for admin image uploads — media library)
  supabaseUrl: process.env.SUPABASE_URL ?? "",
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  supabaseStorageBucket: process.env.SUPABASE_STORAGE_BUCKET ?? "media",
};
