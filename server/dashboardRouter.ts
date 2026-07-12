import { createRouter, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import {
  users,
  services,
  gallery,
  reviews,
  contactLeads,
  newsletter,
  offers,
  mediaLibrary,
  heroSlides,
  advertisements,
} from "@db/schema";
import { sql, eq } from "drizzle-orm";

export const dashboardRouter = createRouter({
  stats: adminQuery.query(async () => {
    const db = getDb();

    const [
      totalServices,
      totalGallery,
      totalReviews,
      totalLeads,
      totalSubscribers,
      totalOffers,
      totalMedia,
      totalHeroSlides,
      totalAds,
      totalUsers,
    ] = await Promise.all([
      db.select({ count: sql<number>`COUNT(*)` }).from(services),
      db.select({ count: sql<number>`COUNT(*)` }).from(gallery),
      db.select({ count: sql<number>`COUNT(*)` }).from(reviews),
      db.select({ count: sql<number>`COUNT(*)` }).from(contactLeads),
      db
        .select({ count: sql<number>`COUNT(*)` })
        .from(newsletter)
        .where(eq(newsletter.isActive, true)),
      db.select({ count: sql<number>`COUNT(*)` }).from(offers),
      db.select({ count: sql<number>`COUNT(*)` }).from(mediaLibrary),
      db.select({ count: sql<number>`COUNT(*)` }).from(heroSlides),
      db.select({ count: sql<number>`COUNT(*)` }).from(advertisements),
      db.select({ count: sql<number>`COUNT(*)` }).from(users),
    ]);

    const avgRating = await db
      .select({
        avg: sql<number>`COALESCE(AVG(${reviews.rating}), 0)`,
      })
      .from(reviews)
      .where(eq(reviews.status, "approved"));

    return {
      totalServices: totalServices[0]?.count ?? 0,
      totalGallery: totalGallery[0]?.count ?? 0,
      totalReviews: totalReviews[0]?.count ?? 0,
      totalLeads: totalLeads[0]?.count ?? 0,
      totalSubscribers: totalSubscribers[0]?.count ?? 0,
      totalOffers: totalOffers[0]?.count ?? 0,
      totalMedia: totalMedia[0]?.count ?? 0,
      totalHeroSlides: totalHeroSlides[0]?.count ?? 0,
      totalAds: totalAds[0]?.count ?? 0,
      totalUsers: totalUsers[0]?.count ?? 0,
      averageRating: Number(avgRating[0]?.avg ?? 0).toFixed(1),
    };
  }),

  recentActivity: adminQuery.query(async () => {
    const db = getDb();

    const [recentLeads, recentReviews, recentSubscribers] = await Promise.all([
      db
        .select()
        .from(contactLeads)
        .orderBy(sql`${contactLeads.createdAt} DESC`)
        .limit(5),
      db
        .select()
        .from(reviews)
        .orderBy(sql`${reviews.createdAt} DESC`)
        .limit(5),
      db
        .select()
        .from(newsletter)
        .orderBy(sql`${newsletter.createdAt} DESC`)
        .limit(5),
    ]);

    return {
      recentLeads,
      recentReviews,
      recentSubscribers,
    };
  }),
});
