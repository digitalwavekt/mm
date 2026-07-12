import { getDb } from "./connection";
import { heroSlides } from "@db/schema";
import { eq, asc } from "drizzle-orm";

export async function getAllHeroSlides() {
  return getDb().query.heroSlides.findMany({
    orderBy: [asc(heroSlides.sortOrder)],
  });
}

export async function getActiveHeroSlides() {
  return getDb().query.heroSlides.findMany({
    where: eq(heroSlides.isActive, true),
    orderBy: [asc(heroSlides.sortOrder)],
  });
}

export async function getHeroSlideById(id: number) {
  return getDb().query.heroSlides.findFirst({
    where: eq(heroSlides.id, id),
  });
}

export async function createHeroSlide(data: {
  type?: "image" | "video";
  mediaUrl: string;
  mobileMediaUrl?: string;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  overlayOpacity?: number;
  sortOrder?: number;
  isActive?: boolean;
}) {
  const [result] = await getDb().insert(heroSlides).values(data).returning({ id: heroSlides.id });
  return getHeroSlideById(result.id);
}

export async function updateHeroSlide(
  id: number,
  data: Partial<{
    type: "image" | "video";
    mediaUrl: string;
    mobileMediaUrl: string;
    title: string;
    subtitle: string;
    buttonText: string;
    buttonLink: string;
    secondaryButtonText: string;
    secondaryButtonLink: string;
    overlayOpacity: number;
    sortOrder: number;
    isActive: boolean;
  }>
) {
  await getDb()
    .update(heroSlides)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(heroSlides.id, id));
  return getHeroSlideById(id);
}

export async function deleteHeroSlide(id: number) {
  await getDb().delete(heroSlides).where(eq(heroSlides.id, id));
  return { success: true };
}
