import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import {
  getAllContactLeads,
  getContactLeadById,
  createContactLead,
  updateLeadStatus,
  deleteContactLead,
  getAllSubscribers,
  getActiveSubscribers,
  subscribeEmail,
  unsubscribeEmail,
  deleteSubscriber,
} from "./queries/contact";
import { sendContactLeadNotification, sendNewsletterWelcome } from "./lib/email";

export const contactRouter = createRouter({
  // Public
  submit: publicQuery
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        serviceInterest: z.string().optional(),
        message: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const lead = await createContactLead(input);
      // Fire-and-forget: don't block the form submission on email delivery.
      void sendContactLeadNotification(input);
      return lead;
    }),

  subscribe: publicQuery
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input }) => {
      const result = await subscribeEmail(input.email);
      void sendNewsletterWelcome(input.email);
      return result;
    }),

  unsubscribe: publicQuery
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input }) => {
      return unsubscribeEmail(input.email);
    }),

  // Admin
  leads: adminQuery.query(async () => {
    return getAllContactLeads();
  }),

  leadById: adminQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return getContactLeadById(input.id);
    }),

  updateStatus: adminQuery
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["new", "read", "replied", "archived"]),
      })
    )
    .mutation(async ({ input }) => {
      return updateLeadStatus(input.id, input.status);
    }),

  deleteLead: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return deleteContactLead(input.id);
    }),

  // Newsletter Admin
  subscribers: adminQuery.query(async () => {
    return getAllSubscribers();
  }),

  activeSubscribers: adminQuery.query(async () => {
    return getActiveSubscribers();
  }),

  deleteSubscriber: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return deleteSubscriber(input.id);
    }),
});
