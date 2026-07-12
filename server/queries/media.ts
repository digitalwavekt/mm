import { getDb } from "./connection";
import { mediaLibrary } from "@db/schema";
import { eq, desc, like } from "drizzle-orm";

export async function getAllMedia() {
  return getDb().query.mediaLibrary.findMany({
    orderBy: [desc(mediaLibrary.createdAt)],
  });
}

export async function getMediaByFolder(folder: string) {
  return getDb().query.mediaLibrary.findMany({
    where: eq(mediaLibrary.folder, folder),
    orderBy: [desc(mediaLibrary.createdAt)],
  });
}

export async function getMediaByType(fileType: "image" | "video") {
  return getDb().query.mediaLibrary.findMany({
    where: eq(mediaLibrary.fileType, fileType),
    orderBy: [desc(mediaLibrary.createdAt)],
  });
}

export async function getMediaById(id: number) {
  return getDb().query.mediaLibrary.findFirst({
    where: eq(mediaLibrary.id, id),
  });
}

export async function addMediaItem(data: {
  fileName: string;
  originalName?: string;
  fileUrl: string;
  thumbnailUrl?: string;
  fileType?: "image" | "video";
  mimeType?: string;
  size?: number;
  folder?: string;
  alt?: string;
}) {
  const [result] = await getDb()
    .insert(mediaLibrary)
    .values(data)
    .returning({ id: mediaLibrary.id });
  return getMediaById(result.id);
}

export async function updateMediaItem(
  id: number,
  data: Partial<{
    fileName: string;
    originalName: string;
    fileUrl: string;
    thumbnailUrl: string;
    fileType: "image" | "video";
    mimeType: string;
    size: number;
    folder: string;
    alt: string;
  }>
) {
  await getDb()
    .update(mediaLibrary)
    .set(data)
    .where(eq(mediaLibrary.id, id));
  return getMediaById(id);
}

export async function deleteMediaItem(id: number) {
  await getDb().delete(mediaLibrary).where(eq(mediaLibrary.id, id));
  return { success: true };
}

export async function searchMedia(query: string) {
  return getDb()
    .select()
    .from(mediaLibrary)
    .where(like(mediaLibrary.fileName, `%${query}%`));
}

export async function getMediaFolders() {
  const rows = await getDb()
    .select({ folder: mediaLibrary.folder })
    .from(mediaLibrary);
  return [...new Set(rows.map((r) => r.folder).filter(Boolean))];
}
