import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import {
  getAllHeroSlides,
  getActiveHeroSlides,
  getHeroSlideById,
  createHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
} from "./queries/hero";

export const heroRouter = createRouter({
  // Public
  list: publicQuery.query(async () => {
    return getActiveHeroSlides();
  }),

  byId: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return getHeroSlideById(input.id);
    }),

  // Admin
  adminList: adminQuery.query(async () => {
    return getAllHeroSlides();
  }),

  create: adminQuery
    .input(
      z.object({
        type: z.enum(["image", "video"]).optional(),
        mediaUrl: z.string().min(1),
        mobileMediaUrl: z.string().optional(),
        title: z.string().optional(),
        subtitle: z.string().optional(),
        buttonText: z.string().optional(),
        buttonLink: z.string().optional(),
        secondaryButtonText: z.string().optional(),
        secondaryButtonLink: z.string().optional(),
        overlayOpacity: z.number().min(0).max(100).optional(),
        sortOrder: z.number().optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return createHeroSlide(input);
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        type: z.enum(["image", "video"]).optional(),
        mediaUrl: z.string().optional(),
        mobileMediaUrl: z.string().optional(),
        title: z.string().optional(),
        subtitle: z.string().optional(),
        buttonText: z.string().optional(),
        buttonLink: z.string().optional(),
        secondaryButtonText: z.string().optional(),
        secondaryButtonLink: z.string().optional(),
        overlayOpacity: z.number().min(0).max(100).optional(),
        sortOrder: z.number().optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return updateHeroSlide(id, data);
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return deleteHeroSlide(input.id);
    }),
});
