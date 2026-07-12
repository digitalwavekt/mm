import { getDb } from "./connection";
import { seoPages } from "@db/schema";
import { eq } from "drizzle-orm";

export async function getAllSeoPages() {
  return getDb().query.seoPages.findMany();
}

export async function getSeoPageByPage(page: string) {
  return getDb().query.seoPages.findFirst({
    where: eq(seoPages.page, page),
  });
}

export async function upsertSeoPage(data: {
  page: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  schemaJson?: string;
  canonicalUrl?: string;
}) {
  const existing = await getSeoPageByPage(data.page);
  if (existing) {
    await getDb()
      .update(seoPages)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(seoPages.id, existing.id));
    return getSeoPageByPage(data.page);
  }
  await getDb().insert(seoPages).values(data);
  return getSeoPageByPage(data.page);
}

export async function deleteSeoPage(id: number) {
  await getDb().delete(seoPages).where(eq(seoPages.id, id));
  return { success: true };
}
