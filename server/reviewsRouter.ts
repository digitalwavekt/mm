import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import {
  getAllReviews,
  getApprovedReviews,
  getServiceReviews,
  getReviewById,
  getAverageRating,
  createReview,
  updateReviewStatus,
  pinReview,
  replyToReview,
  deleteReview,
} from "./queries/reviews";

export const reviewsRouter = createRouter({
  // Public
  list: publicQuery.query(async () => {
    return getApprovedReviews();
  }),

  byService: publicQuery
    .input(z.object({ serviceId: z.number() }))
    .query(async ({ input }) => {
      return getServiceReviews(input.serviceId);
    }),

  byId: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return getReviewById(input.id);
    }),

  average: publicQuery.query(async () => {
    return getAverageRating();
  }),

  submit: publicQuery
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email().optional(),
        avatar: z.string().optional(),
        rating: z.number().min(1).max(5),
        comment: z.string().min(1),
        serviceId: z.number().optional(),
        googleId: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return createReview(input);
    }),

  // Admin
  adminList: adminQuery.query(async () => {
    return getAllReviews();
  }),

  updateStatus: adminQuery
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["pending", "approved", "rejected"]),
      })
    )
    .mutation(async ({ input }) => {
      return updateReviewStatus(input.id, input.status);
    }),

  pin: adminQuery
    .input(z.object({ id: z.number(), isPinned: z.boolean() }))
    .mutation(async ({ input }) => {
      return pinReview(input.id, input.isPinned);
    }),

  reply: adminQuery
    .input(z.object({ id: z.number(), adminReply: z.string().min(1) }))
    .mutation(async ({ input }) => {
      return replyToReview(input.id, input.adminReply);
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return deleteReview(input.id);
    }),
});
