import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import {
  getAllSeoPages,
  getSeoPageByPage,
  upsertSeoPage,
  deleteSeoPage,
} from "./queries/seo";

export const seoRouter = createRouter({
  // Public
  byPage: publicQuery
    .input(z.object({ page: z.string() }))
    .query(async ({ input }) => {
      return getSeoPageByPage(input.page);
    }),

  // Admin
  adminList: adminQuery.query(async () => {
    return getAllSeoPages();
  }),

  upsert: adminQuery
    .input(
      z.object({
        page: z.string().min(1),
        metaTitle: z.string().optional(),
        metaDescription: z.string().optional(),
        metaKeywords: z.string().optional(),
        ogTitle: z.string().optional(),
        ogDescription: z.string().optional(),
        ogImage: z.string().optional(),
        schemaJson: z.string().optional(),
        canonicalUrl: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return upsertSeoPage(input);
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return deleteSeoPage(input.id);
    }),
});
