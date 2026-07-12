import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import {
  getAllGallery,
  getActiveGallery,
  getGalleryByCategory,
  getGalleryCategories,
  getGalleryById,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} from "./queries/gallery";

export const galleryRouter = createRouter({
  // Public
  list: publicQuery.query(async () => {
    return getActiveGallery();
  }),

  byCategory: publicQuery
    .input(z.object({ category: z.string() }))
    .query(async ({ input }) => {
      return getGalleryByCategory(input.category);
    }),

  categories: publicQuery.query(async () => {
    return getGalleryCategories();
  }),

  byId: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return getGalleryById(input.id);
    }),

  // Admin
  adminList: adminQuery.query(async () => {
    return getAllGallery();
  }),

  create: adminQuery
    .input(
      z.object({
        title: z.string().optional(),
        imageUrl: z.string().min(1),
        thumbnailUrl: z.string().optional(),
        category: z.string().min(1),
        description: z.string().optional(),
        clientName: z.string().optional(),
        isBeforeAfter: z.boolean().optional(),
        beforeImageUrl: z.string().optional(),
        afterImageUrl: z.string().optional(),
        sortOrder: z.number().optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return createGalleryItem(input);
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        title: z.string().optional(),
        imageUrl: z.string().optional(),
        thumbnailUrl: z.string().optional(),
        category: z.string().optional(),
        description: z.string().optional(),
        clientName: z.string().optional(),
        isBeforeAfter: z.boolean().optional(),
        beforeImageUrl: z.string().optional(),
        afterImageUrl: z.string().optional(),
        sortOrder: z.number().optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return updateGalleryItem(id, data);
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return deleteGalleryItem(input.id);
    }),
});
