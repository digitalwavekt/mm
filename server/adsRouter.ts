import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import {
  getAllAdvertisements,
  getActiveAdvertisements,
  createAdvertisement,
  updateAdvertisement,
  deleteAdvertisement,
  getAllOffers,
  getActiveOffers,
  getOfferById,
  createOffer,
  updateOffer,
  deleteOffer,
} from "./queries/ads";

export const adsRouter = createRouter({
  // Public
  list: publicQuery.query(async () => {
    return getActiveAdvertisements();
  }),

  byPosition: publicQuery
    .input(z.object({ position: z.string() }))
    .query(async ({ input }) => {
      return getActiveAdvertisements(input.position);
    }),

  offers: publicQuery.query(async () => {
    return getActiveOffers();
  }),

  offerById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return getOfferById(input.id);
    }),

  // Admin - Advertisements
  adminAdsList: adminQuery.query(async () => {
    return getAllAdvertisements();
  }),

  createAd: adminQuery
    .input(
      z.object({
        name: z.string().min(1),
        type: z
          .enum([
            "popup",
            "sticky_banner",
            "section_banner",
            "offer_banner",
            "festival_banner",
          ])
          .optional(),
        mediaUrl: z.string().optional(),
        title: z.string().optional(),
        subtitle: z.string().optional(),
        ctaText: z.string().optional(),
        ctaLink: z.string().optional(),
        position: z.string().optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return createAdvertisement(input);
    }),

  updateAd: adminQuery
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        type: z
          .enum([
            "popup",
            "sticky_banner",
            "section_banner",
            "offer_banner",
            "festival_banner",
          ])
          .optional(),
        mediaUrl: z.string().optional(),
        title: z.string().optional(),
        subtitle: z.string().optional(),
        ctaText: z.string().optional(),
        ctaLink: z.string().optional(),
        position: z.string().optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return updateAdvertisement(id, data);
    }),

  deleteAd: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return deleteAdvertisement(input.id);
    }),

  // Admin - Offers
  adminOffersList: adminQuery.query(async () => {
    return getAllOffers();
  }),

  createOffer: adminQuery
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        imageUrl: z.string().optional(),
        videoUrl: z.string().optional(),
        discountPercent: z.number().optional(),
        discountAmount: z.string().optional(),
        couponCode: z.string().optional(),
        validFrom: z.date().optional(),
        validUntil: z.date().optional(),
        ctaText: z.string().optional(),
        ctaLink: z.string().optional(),
        terms: z.string().optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return createOffer(input);
    }),

  updateOffer: adminQuery
    .input(
      z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        imageUrl: z.string().optional(),
        videoUrl: z.string().optional(),
        discountPercent: z.number().optional(),
        discountAmount: z.string().optional(),
        couponCode: z.string().optional(),
        validFrom: z.date().optional(),
        validUntil: z.date().optional(),
        ctaText: z.string().optional(),
        ctaLink: z.string().optional(),
        terms: z.string().optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return updateOffer(id, data);
    }),

  deleteOffer: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return deleteOffer(input.id);
    }),
});
