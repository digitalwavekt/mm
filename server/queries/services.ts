import { getDb } from "./connection";
import { services, serviceGallery } from "@db/schema";
import { eq, asc, like } from "drizzle-orm";

export async function getAllServices() {
  return getDb().query.services.findMany({
    orderBy: [asc(services.sortOrder)],
  });
}

export async function getActiveServices() {
  return getDb().query.services.findMany({
    where: eq(services.isActive, true),
    orderBy: [asc(services.sortOrder)],
  });
}

export async function getFeaturedServices() {
  return getDb().query.services.findMany({
    where: eq(services.isFeatured, true),
    orderBy: [asc(services.sortOrder)],
  });
}

export async function getServiceBySlug(slug: string) {
  return getDb().query.services.findFirst({
    where: eq(services.slug, slug),
    with: {
      gallery: true,
    },
  });
}

export async function getServiceById(id: number) {
  return getDb().query.services.findFirst({
    where: eq(services.id, id),
    with: {
      gallery: true,
    },
  });
}

export async function createService(data: {
  name: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  imageUrl?: string;
  bannerImageUrl?: string;
  price?: string;
  duration?: string;
  category?: string;
  benefits?: string[];
  preparation?: string;
  afterCare?: string;
  faqs?: { question: string; answer: string }[];
  metaTitle?: string;
  metaDescription?: string;
  sortOrder?: number;
  isActive?: boolean;
  isFeatured?: boolean;
}) {
  const [result] = await getDb().insert(services).values(data).returning({ id: services.id });
  return getServiceById(result.id);
}

export async function updateService(
  id: number,
  data: Partial<{
    name: string;
    slug: string;
    shortDescription: string;
    description: string;
    imageUrl: string;
    bannerImageUrl: string;
    price: string;
    duration: string;
    category: string;
    benefits: string[];
    preparation: string;
    afterCare: string;
    faqs: { question: string; answer: string }[];
    metaTitle: string;
    metaDescription: string;
    sortOrder: number;
    isActive: boolean;
    isFeatured: boolean;
  }>
) {
  await getDb()
    .update(services)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(services.id, id));
  return getServiceById(id);
}

export async function deleteService(id: number) {
  await getDb().delete(services).where(eq(services.id, id));
  return { success: true };
}

// ─── Service Gallery ────────────────────────────────────────────────────────

export async function getServiceGallery(serviceId: number) {
  return getDb().query.serviceGallery.findMany({
    where: eq(serviceGallery.serviceId, serviceId),
    orderBy: [asc(serviceGallery.sortOrder)],
  });
}

export async function addServiceGalleryImage(data: {
  serviceId: number;
  imageUrl: string;
  caption?: string;
  sortOrder?: number;
}) {
  const [result] = await getDb()
    .insert(serviceGallery)
    .values(data)
    .returning({ id: serviceGallery.id });
  return result;
}

export async function deleteServiceGalleryImage(id: number) {
  await getDb().delete(serviceGallery).where(eq(serviceGallery.id, id));
  return { success: true };
}

export async function searchServices(query: string) {
  return getDb()
    .select()
    .from(services)
    .where(like(services.name, `%${query}%`));
}
