import {
  pgTable,
  pgEnum,
  serial,
  varchar,
  text,
  timestamp,
  integer,
  jsonb,
  boolean,
  decimal,
  bigint,
  index,
} from "drizzle-orm/pg-core";

// ─────────────────────────────────────────────────────────────────────────────
// Enums
// ─────────────────────────────────────────────────────────────────────────────
export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);
export const heroTypeEnum = pgEnum("hero_type", ["image", "video"]);
export const reviewStatusEnum = pgEnum("review_status", [
  "pending",
  "approved",
  "rejected",
]);
export const leadStatusEnum = pgEnum("lead_status", [
  "new",
  "read",
  "replied",
  "archived",
]);
export const adTypeEnum = pgEnum("ad_type", [
  "popup",
  "sticky_banner",
  "section_banner",
  "offer_banner",
  "festival_banner",
]);
export const mediaTypeEnum = pgEnum("media_type", ["image", "video"]);

// ─────────────────────────────────────────────────────────────────────────────
// 1. USERS (self-contained email/password admin auth)
// ─────────────────────────────────────────────────────────────────────────────
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  passwordHash: text("passwordHash").notNull(),
  name: varchar("name", { length: 255 }),
  avatar: text("avatar"),
  role: userRoleEnum("role").default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─────────────────────────────────────────────────────────────────────────────
// 2. WEBSITE SETTINGS
// ─────────────────────────────────────────────────────────────────────────────
export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: text("value"),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type Setting = typeof settings.$inferSelect;

// ─────────────────────────────────────────────────────────────────────────────
// 3. HERO SLIDES (Image/Video slider for hero section)
// ─────────────────────────────────────────────────────────────────────────────
export const heroSlides = pgTable("hero_slides", {
  id: serial("id").primaryKey(),
  type: heroTypeEnum("type").default("image").notNull(),
  mediaUrl: text("mediaUrl").notNull(),
  mobileMediaUrl: text("mobileMediaUrl"),
  title: varchar("title", { length: 255 }),
  subtitle: varchar("subtitle", { length: 500 }),
  buttonText: varchar("buttonText", { length: 100 }),
  buttonLink: varchar("buttonLink", { length: 500 }),
  secondaryButtonText: varchar("secondaryButtonText", { length: 100 }),
  secondaryButtonLink: varchar("secondaryButtonLink", { length: 500 }),
  overlayOpacity: integer("overlayOpacity").default(50),
  sortOrder: integer("sortOrder").default(0),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type HeroSlide = typeof heroSlides.$inferSelect;

// ─────────────────────────────────────────────────────────────────────────────
// 4. ABOUT OWNER
// ─────────────────────────────────────────────────────────────────────────────
export const aboutOwner = pgTable("about_owner", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  title: varchar("title", { length: 255 }),
  photoUrl: text("photoUrl"),
  bio: text("bio"),
  experience: varchar("experience", { length: 100 }),
  mission: text("mission"),
  vision: text("vision"),
  achievements: jsonb("achievements").$type<string[]>(),
  certificates: jsonb("certificates").$type<string[]>(),
  awards: jsonb("awards").$type<string[]>(),
  isActive: boolean("isActive").default(true),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type AboutOwner = typeof aboutOwner.$inferSelect;

// ─────────────────────────────────────────────────────────────────────────────
// 5. TIMELINE (Owner journey)
// ─────────────────────────────────────────────────────────────────────────────
export const timeline = pgTable("timeline", {
  id: serial("id").primaryKey(),
  year: varchar("year", { length: 20 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  icon: varchar("icon", { length: 50 }),
  sortOrder: integer("sortOrder").default(0),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Timeline = typeof timeline.$inferSelect;

// ─────────────────────────────────────────────────────────────────────────────
// 6. SERVICES
// ─────────────────────────────────────────────────────────────────────────────
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  shortDescription: text("shortDescription"),
  description: text("description"),
  imageUrl: text("imageUrl"),
  bannerImageUrl: text("bannerImageUrl"),
  price: decimal("price", { precision: 10, scale: 2 }),
  duration: varchar("duration", { length: 50 }),
  category: varchar("category", { length: 100 }),
  benefits: jsonb("benefits").$type<string[]>(),
  preparation: text("preparation"),
  afterCare: text("afterCare"),
  faqs: jsonb("faqs").$type<{ question: string; answer: string }[]>(),
  metaTitle: varchar("metaTitle", { length: 255 }),
  metaDescription: text("metaDescription"),
  sortOrder: integer("sortOrder").default(0),
  isActive: boolean("isActive").default(true),
  isFeatured: boolean("isFeatured").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type Service = typeof services.$inferSelect;

// ─────────────────────────────────────────────────────────────────────────────
// 7. SERVICE GALLERY (Additional images for services)
// ─────────────────────────────────────────────────────────────────────────────
export const serviceGallery = pgTable("service_gallery", {
  id: serial("id").primaryKey(),
  serviceId: bigint("serviceId", { mode: "number" }).notNull(),
  imageUrl: text("imageUrl").notNull(),
  caption: varchar("caption", { length: 255 }),
  sortOrder: integer("sortOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ServiceGallery = typeof serviceGallery.$inferSelect;

// ─────────────────────────────────────────────────────────────────────────────
// 8. GALLERY (Portfolio images)
// ─────────────────────────────────────────────────────────────────────────────
export const gallery = pgTable(
  "gallery",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 255 }),
    imageUrl: text("imageUrl").notNull(),
    thumbnailUrl: text("thumbnailUrl"),
    category: varchar("category", { length: 100 }).notNull(),
    description: text("description"),
    clientName: varchar("clientName", { length: 255 }),
    isBeforeAfter: boolean("isBeforeAfter").default(false),
    beforeImageUrl: text("beforeImageUrl"),
    afterImageUrl: text("afterImageUrl"),
    sortOrder: integer("sortOrder").default(0),
    isActive: boolean("isActive").default(true),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    categoryIdx: index("category_idx").on(table.category),
  })
);

export type Gallery = typeof gallery.$inferSelect;

// ─────────────────────────────────────────────────────────────────────────────
// 9. REVIEWS
// ─────────────────────────────────────────────────────────────────────────────
export const reviews = pgTable(
  "reviews",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 320 }),
    avatar: text("avatar"),
    rating: integer("rating").notNull(),
    comment: text("comment").notNull(),
    serviceId: bigint("serviceId", { mode: "number" }),
    status: reviewStatusEnum("status").default("pending").notNull(),
    isPinned: boolean("isPinned").default(false),
    adminReply: text("adminReply"),
    googleId: varchar("googleId", { length: 255 }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt")
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    statusIdx: index("status_idx").on(table.status),
    serviceIdx: index("service_idx").on(table.serviceId),
  })
);

export type Review = typeof reviews.$inferSelect;

// ─────────────────────────────────────────────────────────────────────────────
// 10. CONTACT LEADS
// ─────────────────────────────────────────────────────────────────────────────
export const contactLeads = pgTable(
  "contact_leads",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 320 }),
    phone: varchar("phone", { length: 50 }),
    serviceInterest: varchar("serviceInterest", { length: 255 }),
    message: text("message"),
    status: leadStatusEnum("status").default("new").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    statusIdx: index("lead_status_idx").on(table.status),
    createdIdx: index("lead_created_idx").on(table.createdAt),
  })
);

export type ContactLead = typeof contactLeads.$inferSelect;

// ─────────────────────────────────────────────────────────────────────────────
// 11. NEWSLETTER SUBSCRIBERS
// ─────────────────────────────────────────────────────────────────────────────
export const newsletter = pgTable("newsletter", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Newsletter = typeof newsletter.$inferSelect;

// ─────────────────────────────────────────────────────────────────────────────
// 12. ADVERTISEMENTS / BANNERS
// ─────────────────────────────────────────────────────────────────────────────
export const advertisements = pgTable("advertisements", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  type: adTypeEnum("type").default("section_banner").notNull(),
  mediaUrl: text("mediaUrl"),
  title: varchar("title", { length: 255 }),
  subtitle: varchar("subtitle", { length: 500 }),
  ctaText: varchar("ctaText", { length: 100 }),
  ctaLink: varchar("ctaLink", { length: 500 }),
  position: varchar("position", { length: 100 }),
  startDate: timestamp("startDate"),
  endDate: timestamp("endDate"),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type Advertisement = typeof advertisements.$inferSelect;

// ─────────────────────────────────────────────────────────────────────────────
// 13. OFFERS
// ─────────────────────────────────────────────────────────────────────────────
export const offers = pgTable("offers", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  imageUrl: text("imageUrl"),
  videoUrl: text("videoUrl"),
  discountPercent: integer("discountPercent"),
  discountAmount: decimal("discountAmount", { precision: 10, scale: 2 }),
  couponCode: varchar("couponCode", { length: 50 }),
  validFrom: timestamp("validFrom"),
  validUntil: timestamp("validUntil"),
  ctaText: varchar("ctaText", { length: 100 }),
  ctaLink: varchar("ctaLink", { length: 500 }),
  terms: text("terms"),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type Offer = typeof offers.$inferSelect;

// ─────────────────────────────────────────────────────────────────────────────
// 14. SEO PAGES
// ─────────────────────────────────────────────────────────────────────────────
export const seoPages = pgTable("seo_pages", {
  id: serial("id").primaryKey(),
  page: varchar("page", { length: 100 }).notNull().unique(),
  metaTitle: varchar("metaTitle", { length: 255 }),
  metaDescription: text("metaDescription"),
  metaKeywords: text("metaKeywords"),
  ogTitle: varchar("ogTitle", { length: 255 }),
  ogDescription: text("ogDescription"),
  ogImage: text("ogImage"),
  schemaJson: text("schemaJson"),
  canonicalUrl: varchar("canonicalUrl", { length: 500 }),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type SeoPage = typeof seoPages.$inferSelect;

// ─────────────────────────────────────────────────────────────────────────────
// 15. AUDIT LOGS
// ─────────────────────────────────────────────────────────────────────────────
export const auditLogs = pgTable(
  "audit_logs",
  {
    id: serial("id").primaryKey(),
    userId: bigint("userId", { mode: "number" }),
    action: varchar("action", { length: 100 }).notNull(),
    entity: varchar("entity", { length: 100 }).notNull(),
    entityId: bigint("entityId", { mode: "number" }),
    oldValue: text("oldValue"),
    newValue: text("newValue"),
    ipAddress: varchar("ipAddress", { length: 50 }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    actionIdx: index("action_idx").on(table.action),
    entityIdx: index("entity_idx").on(table.entity),
    createdIdx: index("audit_created_idx").on(table.createdAt),
  })
);

export type AuditLog = typeof auditLogs.$inferSelect;

// ─────────────────────────────────────────────────────────────────────────────
// 16. MEDIA LIBRARY
// ─────────────────────────────────────────────────────────────────────────────
export const mediaLibrary = pgTable(
  "media_library",
  {
    id: serial("id").primaryKey(),
    fileName: varchar("fileName", { length: 255 }).notNull(),
    originalName: varchar("originalName", { length: 255 }),
    fileUrl: text("fileUrl").notNull(),
    thumbnailUrl: text("thumbnailUrl"),
    fileType: mediaTypeEnum("fileType").default("image").notNull(),
    mimeType: varchar("mimeType", { length: 100 }),
    size: bigint("size", { mode: "number" }),
    folder: varchar("folder", { length: 100 }).default("general"),
    alt: varchar("alt", { length: 255 }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    folderIdx: index("folder_idx").on(table.folder),
    typeIdx: index("fileType_idx").on(table.fileType),
  })
);

export type MediaItem = typeof mediaLibrary.$inferSelect;
