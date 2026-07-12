import { getDb } from "./connection";
import { reviews } from "@db/schema";
import { eq, desc, and, sql } from "drizzle-orm";

export async function getAllReviews() {
  return getDb().query.reviews.findMany({
    orderBy: [desc(reviews.createdAt)],
    with: {
      service: true,
    },
  });
}

export async function getApprovedReviews() {
  return getDb().query.reviews.findMany({
    where: eq(reviews.status, "approved"),
    orderBy: [desc(reviews.isPinned), desc(reviews.createdAt)],
    with: {
      service: true,
    },
  });
}

export async function getServiceReviews(serviceId: number) {
  return getDb().query.reviews.findMany({
    where: and(eq(reviews.serviceId, serviceId), eq(reviews.status, "approved")),
    orderBy: [desc(reviews.createdAt)],
  });
}

export async function getReviewById(id: number) {
  return getDb().query.reviews.findFirst({
    where: eq(reviews.id, id),
  });
}

export async function getAverageRating() {
  const result = await getDb()
    .select({
      avg: sql<number>`COALESCE(AVG(${reviews.rating}), 0)`,
      count: sql<number>`COUNT(*)`,
    })
    .from(reviews)
    .where(eq(reviews.status, "approved"));
  return {
    average: Number(result[0]?.avg || 0).toFixed(1),
    count: Number(result[0]?.count || 0),
  };
}

export async function createReview(data: {
  name: string;
  email?: string;
  avatar?: string;
  rating: number;
  comment: string;
  serviceId?: number;
  googleId?: string;
}) {
  const [result] = await getDb().insert(reviews).values(data).returning({ id: reviews.id });
  return getReviewById(result.id);
}

export async function updateReviewStatus(
  id: number,
  status: "pending" | "approved" | "rejected"
) {
  await getDb()
    .update(reviews)
    .set({ status, updatedAt: new Date() })
    .where(eq(reviews.id, id));
  return getReviewById(id);
}

export async function pinReview(id: number, isPinned: boolean) {
  await getDb()
    .update(reviews)
    .set({ isPinned, updatedAt: new Date() })
    .where(eq(reviews.id, id));
  return getReviewById(id);
}

export async function replyToReview(id: number, adminReply: string) {
  await getDb()
    .update(reviews)
    .set({ adminReply, updatedAt: new Date() })
    .where(eq(reviews.id, id));
  return getReviewById(id);
}

export async function deleteReview(id: number) {
  await getDb().delete(reviews).where(eq(reviews.id, id));
  return { success: true };
}
