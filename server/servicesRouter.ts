import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import {
  getAllServices,
  getActiveServices,
  getFeaturedServices,
  getServiceBySlug,
  getServiceById,
  createService,
  updateService,
  deleteService,
  getServiceGallery,
  addServiceGalleryImage,
  deleteServiceGalleryImage,
  searchServices,
} from "./queries/services";

export const servicesRouter = createRouter({
  // Public
  list: publicQuery.query(async () => {
    return getActiveServices();
  }),

  featured: publicQuery.query(async () => {
    return getFeaturedServices();
  }),

  bySlug: publicQuery
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      return getServiceBySlug(input.slug);
    }),

  byId: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return getServiceById(input.id);
    }),

  search: publicQuery
    .input(z.object({ query: z.string() }))
    .query(async ({ input }) => {
      return searchServices(input.query);
    }),

  // Admin
  adminList: adminQuery.query(async () => {
    return getAllServices();
  }),

  create: adminQuery
    .input(
      z.object({
        name: z.string().min(1),
        slug: z.string().min(1),
        shortDescription: z.string().optional(),
        description: z.string().optional(),
        imageUrl: z.string().optional(),
        bannerImageUrl: z.string().optional(),
        price: z.string().optional(),
        duration: z.string().optional(),
        category: z.string().optional(),
        benefits: z.array(z.string()).optional(),
        preparation: z.string().optional(),
        afterCare: z.string().optional(),
        faqs: z
          .array(z.object({ question: z.string(), answer: z.string() }))
          .optional(),
        metaTitle: z.string().optional(),
        metaDescription: z.string().optional(),
        sortOrder: z.number().optional(),
        isActive: z.boolean().optional(),
        isFeatured: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return createService(input);
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        slug: z.string().optional(),
        shortDescription: z.string().optional(),
        description: z.string().optional(),
        imageUrl: z.string().optional(),
        bannerImageUrl: z.string().optional(),
        price: z.string().optional(),
        duration: z.string().optional(),
        category: z.string().optional(),
        benefits: z.array(z.string()).optional(),
        preparation: z.string().optional(),
        afterCare: z.string().optional(),
        faqs: z
          .array(z.object({ question: z.string(), answer: z.string() }))
          .optional(),
        metaTitle: z.string().optional(),
        metaDescription: z.string().optional(),
        sortOrder: z.number().optional(),
        isActive: z.boolean().optional(),
        isFeatured: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return updateService(id, data);
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return deleteService(input.id);
    }),

  // Service Gallery Admin
  gallery: adminQuery
    .input(z.object({ serviceId: z.number() }))
    .query(async ({ input }) => {
      return getServiceGallery(input.serviceId);
    }),

  addGalleryImage: adminQuery
    .input(
      z.object({
        serviceId: z.number(),
        imageUrl: z.string().min(1),
        caption: z.string().optional(),
        sortOrder: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return addServiceGalleryImage(input);
    }),

  deleteGalleryImage: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return deleteServiceGalleryImage(input.id);
    }),
});
