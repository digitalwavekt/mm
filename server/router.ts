import { authRouter } from "./auth-router";
import { createRouter, publicQuery } from "./middleware";
import { settingsRouter } from "./settingsRouter";
import { heroRouter } from "./heroRouter";
import { aboutRouter } from "./aboutRouter";
import { servicesRouter } from "./servicesRouter";
import { galleryRouter } from "./galleryRouter";
import { reviewsRouter } from "./reviewsRouter";
import { contactRouter } from "./contactRouter";
import { adsRouter } from "./adsRouter";
import { seoRouter } from "./seoRouter";
import { mediaRouter } from "./mediaRouter";
import { dashboardRouter } from "./dashboardRouter";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,

  // Content Management
  settings: settingsRouter,
  hero: heroRouter,
  about: aboutRouter,
  services: servicesRouter,
  gallery: galleryRouter,
  reviews: reviewsRouter,
  contact: contactRouter,
  ads: adsRouter,
  seo: seoRouter,
  media: mediaRouter,

  // Admin Dashboard
  dashboard: dashboardRouter,
});

export type AppRouter = typeof appRouter;
