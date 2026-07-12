import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import {
  getAboutOwner,
  createOrUpdateAboutOwner,
  getAllTimeline,
  getActiveTimeline,
  createTimeline,
  updateTimeline,
  deleteTimeline,
} from "./queries/about";

export const aboutRouter = createRouter({
  // Public
  owner: publicQuery.query(async () => {
    return getAboutOwner();
  }),

  timeline: publicQuery.query(async () => {
    return getActiveTimeline();
  }),

  // Admin
  adminOwner: adminQuery.query(async () => {
    return getAboutOwner();
  }),

  upsertOwner: adminQuery
    .input(
      z.object({
        name: z.string().min(1),
        title: z.string().optional(),
        photoUrl: z.string().optional(),
        bio: z.string().optional(),
        experience: z.string().optional(),
        mission: z.string().optional(),
        vision: z.string().optional(),
        achievements: z.array(z.string()).optional(),
        certificates: z.array(z.string()).optional(),
        awards: z.array(z.string()).optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return createOrUpdateAboutOwner(input);
    }),

  // Timeline Admin
  adminTimeline: adminQuery.query(async () => {
    return getAllTimeline();
  }),

  createTimeline: adminQuery
    .input(
      z.object({
        year: z.string().min(1),
        title: z.string().min(1),
        description: z.string().optional(),
        icon: z.string().optional(),
        sortOrder: z.number().optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return createTimeline(input);
    }),

  updateTimeline: adminQuery
    .input(
      z.object({
        id: z.number(),
        year: z.string().optional(),
        title: z.string().optional(),
        description: z.string().optional(),
        icon: z.string().optional(),
        sortOrder: z.number().optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return updateTimeline(id, data);
    }),

  deleteTimeline: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return deleteTimeline(input.id);
    }),
});
