import { getDb } from "./connection";
import { advertisements, offers } from "@db/schema";
import { eq, desc, and, gte, lte } from "drizzle-orm";

// ─── Advertisements ─────────────────────────────────────────────────────────

export async function getAllAdvertisements() {
  return getDb().query.advertisements.findMany({
    orderBy: [desc(advertisements.createdAt)],
  });
}

export async function getActiveAdvertisements(position?: string) {
  const now = new Date();
  let query;
  if (position) {
    query = and(
      eq(advertisements.isActive, true),
      eq(advertisements.position, position),
      gte(advertisements.endDate, now),
      lte(advertisements.startDate, now)
    );
  } else {
    query = and(
      eq(advertisements.isActive, true),
      gte(advertisements.endDate, now),
      lte(advertisements.startDate, now)
    );
  }
  return getDb().query.advertisements.findMany({
    where: query,
    orderBy: [desc(advertisements.createdAt)],
  });
}

export async function getAdvertisementById(id: number) {
  return getDb().query.advertisements.findFirst({
    where: eq(advertisements.id, id),
  });
}

export async function createAdvertisement(data: {
  name: string;
  type?: "popup" | "sticky_banner" | "section_banner" | "offer_banner" | "festival_banner";
  mediaUrl?: string;
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  position?: string;
  startDate?: Date;
  endDate?: Date;
  isActive?: boolean;
}) {
  const [result] = await getDb()
    .insert(advertisements)
    .values(data)
    .returning({ id: advertisements.id });
  return getAdvertisementById(result.id);
}

export async function updateAdvertisement(
  id: number,
  data: Partial<{
    name: string;
    type: "popup" | "sticky_banner" | "section_banner" | "offer_banner" | "festival_banner";
    mediaUrl: string;
    title: string;
    subtitle: string;
    ctaText: string;
    ctaLink: string;
    position: string;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
  }>
) {
  await getDb()
    .update(advertisements)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(advertisements.id, id));
  return getAdvertisementById(id);
}

export async function deleteAdvertisement(id: number) {
  await getDb().delete(advertisements).where(eq(advertisements.id, id));
  return { success: true };
}

// ─── Offers ─────────────────────────────────────────────────────────────────

export async function getAllOffers() {
  return getDb().query.offers.findMany({
    orderBy: [desc(offers.createdAt)],
  });
}

export async function getActiveOffers() {
  const now = new Date();
  return getDb().query.offers.findMany({
    where: and(
      eq(offers.isActive, true),
      gte(offers.validUntil, now),
      lte(offers.validFrom, now)
    ),
    orderBy: [desc(offers.createdAt)],
  });
}

export async function getOfferById(id: number) {
  return getDb().query.offers.findFirst({
    where: eq(offers.id, id),
  });
}

export async function createOffer(data: {
  title: string;
  description?: string;
  imageUrl?: string;
  videoUrl?: string;
  discountPercent?: number;
  discountAmount?: string;
  couponCode?: string;
  validFrom?: Date;
  validUntil?: Date;
  ctaText?: string;
  ctaLink?: string;
  terms?: string;
  isActive?: boolean;
}) {
  const [result] = await getDb().insert(offers).values(data).returning({ id: offers.id });
  return getOfferById(result.id);
}

export async function updateOffer(
  id: number,
  data: Partial<{
    title: string;
    description: string;
    imageUrl: string;
    videoUrl: string;
    discountPercent: number;
    discountAmount: string;
    couponCode: string;
    validFrom: Date;
    validUntil: Date;
    ctaText: string;
    ctaLink: string;
    terms: string;
    isActive: boolean;
  }>
) {
  await getDb()
    .update(offers)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(offers.id, id));
  return getOfferById(id);
}

export async function deleteOffer(id: number) {
  await getDb().delete(offers).where(eq(offers.id, id));
  return { success: true };
}
