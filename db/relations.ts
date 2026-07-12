import { relations } from "drizzle-orm";
import {
  users,
  services,
  serviceGallery,
  reviews,
  auditLogs,
} from "./schema";

// Services → Service Gallery (one-to-many)
export const servicesRelations = relations(services, ({ many }) => ({
  gallery: many(serviceGallery),
  reviews: many(reviews),
}));

export const serviceGalleryRelations = relations(serviceGallery, ({ one }) => ({
  service: one(services, {
    fields: [serviceGallery.serviceId],
    references: [services.id],
  }),
}));

// Reviews → Services (many-to-one)
export const reviewsRelations = relations(reviews, ({ one }) => ({
  service: one(services, {
    fields: [reviews.serviceId],
    references: [services.id],
  }),
}));

// Audit Logs → Users (many-to-one)
export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(users, {
    fields: [auditLogs.userId],
    references: [users.id],
  }),
}));
