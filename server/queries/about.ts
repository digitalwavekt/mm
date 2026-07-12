import { getDb } from "./connection";
import { aboutOwner, timeline } from "@db/schema";
import { eq, asc } from "drizzle-orm";

// ─── About Owner ────────────────────────────────────────────────────────────

export async function getAboutOwner() {
  return getDb().query.aboutOwner.findFirst();
}

export async function createOrUpdateAboutOwner(data: {
  name: string;
  title?: string;
  photoUrl?: string;
  bio?: string;
  experience?: string;
  mission?: string;
  vision?: string;
  achievements?: string[];
  certificates?: string[];
  awards?: string[];
  isActive?: boolean;
}) {
  const existing = await getAboutOwner();
  if (existing) {
    await getDb()
      .update(aboutOwner)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(aboutOwner.id, existing.id));
    return getAboutOwner();
  }
  await getDb().insert(aboutOwner).values(data);
  return getAboutOwner();
}

// ─── Timeline ───────────────────────────────────────────────────────────────

export async function getAllTimeline() {
  return getDb().query.timeline.findMany({
    orderBy: [asc(timeline.sortOrder)],
  });
}

export async function getActiveTimeline() {
  return getDb().query.timeline.findMany({
    where: eq(timeline.isActive, true),
    orderBy: [asc(timeline.sortOrder)],
  });
}

export async function getTimelineById(id: number) {
  return getDb().query.timeline.findFirst({
    where: eq(timeline.id, id),
  });
}

export async function createTimeline(data: {
  year: string;
  title: string;
  description?: string;
  icon?: string;
  sortOrder?: number;
  isActive?: boolean;
}) {
  const [result] = await getDb().insert(timeline).values(data).returning({ id: timeline.id });
  return getTimelineById(result.id);
}

export async function updateTimeline(
  id: number,
  data: Partial<{
    year: string;
    title: string;
    description: string;
    icon: string;
    sortOrder: number;
    isActive: boolean;
  }>
) {
  await getDb()
    .update(timeline)
    .set(data)
    .where(eq(timeline.id, id));
  return getTimelineById(id);
}

export async function deleteTimeline(id: number) {
  await getDb().delete(timeline).where(eq(timeline.id, id));
  return { success: true };
}
