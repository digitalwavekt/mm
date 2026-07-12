import { getDb } from "./connection";
import { gallery } from "@db/schema";
import { eq, asc, and } from "drizzle-orm";

export async function getAllGallery() {
  return getDb().query.gallery.findMany({
    orderBy: [asc(gallery.sortOrder)],
  });
}

export async function getActiveGallery() {
  return getDb().query.gallery.findMany({
    where: eq(gallery.isActive, true),
    orderBy: [asc(gallery.sortOrder)],
  });
}

export async function getGalleryByCategory(category: string) {
  return getDb().query.gallery.findMany({
    where: and(eq(gallery.category, category), eq(gallery.isActive, true)),
    orderBy: [asc(gallery.sortOrder)],
  });
}

export async function getGalleryCategories() {
  const rows = await getDb().select({ category: gallery.category }).from(gallery);
  return [...new Set(rows.map((r) => r.category))];
}

export async function getGalleryById(id: number) {
  return getDb().query.gallery.findFirst({
    where: eq(gallery.id, id),
  });
}

export async function createGalleryItem(data: {
  title?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  category: string;
  description?: string;
  clientName?: string;
  isBeforeAfter?: boolean;
  beforeImageUrl?: string;
  afterImageUrl?: string;
  sortOrder?: number;
  isActive?: boolean;
}) {
  const [result] = await getDb().insert(gallery).values(data).returning({ id: gallery.id });
  return getGalleryById(result.id);
}

export async function updateGalleryItem(
  id: number,
  data: Partial<{
    title: string;
    imageUrl: string;
    thumbnailUrl: string;
    category: string;
    description: string;
    clientName: string;
    isBeforeAfter: boolean;
    beforeImageUrl: string;
    afterImageUrl: string;
    sortOrder: number;
    isActive: boolean;
  }>
) {
  await getDb()
    .update(gallery)
    .set(data)
    .where(eq(gallery.id, id));
  return getGalleryById(id);
}

export async function deleteGalleryItem(id: number) {
  await getDb().delete(gallery).where(eq(gallery.id, id));
  return { success: true };
}
