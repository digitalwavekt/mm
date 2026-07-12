import { createClient } from "@supabase/supabase-js";
import { nanoid } from "nanoid";
import { env } from "./env";

let client: ReturnType<typeof createClient> | undefined;

function getSupabase() {
  if (!env.supabaseUrl || !env.supabaseServiceRoleKey) {
    throw new Error(
      "Image uploads are not configured. Set SUPABASE_URL and " +
        "SUPABASE_SERVICE_ROLE_KEY in your environment.",
    );
  }
  if (!client) {
    client = createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
      auth: { persistSession: false },
    });
  }
  return client;
}

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

// 8MB — generous for hero/gallery photography while keeping the base64
// tRPC payload (which runs ~33% larger than the raw file) well under the
// 50MB body limit configured on the Hono app.
const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024;

function extensionFromMime(mimeType: string): string {
  const map: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/svg+xml": "svg",
  };
  return map[mimeType] ?? "bin";
}

/**
 * Uploads a base64-encoded image to the Supabase Storage bucket and
 * returns its public URL. Used by the admin "upload image" flow across
 * Hero/Gallery/Services/About/Offers managers.
 */
export async function uploadImage(params: {
  dataBase64: string;
  mimeType: string;
  folder: string;
}) {
  const { dataBase64, mimeType, folder } = params;

  if (!ALLOWED_MIME_TYPES.has(mimeType)) {
    throw new Error(`Unsupported file type: ${mimeType}`);
  }

  const buffer = Buffer.from(dataBase64, "base64");
  if (buffer.byteLength > MAX_FILE_SIZE_BYTES) {
    throw new Error("Image is too large. Max size is 8MB.");
  }

  const safeFolder = folder.replace(/[^a-z0-9/_-]/gi, "").replace(/^\/+/, "");
  const path = `${safeFolder}/${nanoid(12)}.${extensionFromMime(mimeType)}`;

  const supabase = getSupabase();
  const { error } = await supabase.storage
    .from(env.supabaseStorageBucket)
    .upload(path, buffer, { contentType: mimeType, upsert: false });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  const { data } = supabase.storage
    .from(env.supabaseStorageBucket)
    .getPublicUrl(path);

  return {
    url: data.publicUrl,
    path,
    size: buffer.byteLength,
  };
}
