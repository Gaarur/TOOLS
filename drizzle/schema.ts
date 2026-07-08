import { integer, pgEnum, pgTable, text, timestamp, varchar, serial } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["user", "admin"]);

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = pgTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: serial("id").primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: roleEnum("role").default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().$onUpdate(() => new Date()).notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Blog posts table for storing published articles
 */
export const blogPosts = pgTable("blogPosts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  coverImage: varchar("coverImage", { length: 512 }),
  author: varchar("author", { length: 255 }),
  published: integer("published").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().$onUpdate(() => new Date()).notNull(),
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;

/**
 * Contact form submissions table
 */
export const contactSubmissions = pgTable("contactSubmissions", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  subject: varchar("subject", { length: 255 }).notNull(),
  message: text("message").notNull(),
  read: integer("read").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type InsertContactSubmission = typeof contactSubmissions.$inferInsert;

/**
 * General site settings (Single Row Table: id=1)
 */
export const generalSettings = pgTable("generalSettings", {
  id: integer("id").primaryKey().default(1),
  companyName: varchar("companyName", { length: 255 }).default("OM TECHNO TOOLS").notNull(),
  tagline: varchar("tagline", { length: 255 }).default("Engineered for Precision. Built for Performance.").notNull(),
  description: text("description").default("Precision engineering solutions for manufacturing excellence").notNull(),
  address: text("address").default("Plot No. 393 & 394, Udyog Kendra 2, Ecotech 3, Greater Noida, Pincode: 201306").notNull(),
  phone1: varchar("phone1", { length: 50 }).default("+91 9289304917").notNull(),
  phone2: varchar("phone2", { length: 50 }).default("+91 9625696886").notNull(),
  email1: varchar("email1", { length: 320 }).default("om.techtools1971@gmail.com").notNull(),
  email2: varchar("email2", { length: 320 }).default("omtt.design@gmail.com").notNull(),
  logoUrl: varchar("logoUrl", { length: 512 }),
  faviconUrl: varchar("faviconUrl", { length: 512 }),
  googleMapsEmbed: text("googleMapsEmbed"),
  socialLinkedin: varchar("socialLinkedin", { length: 255 }),
  socialTwitter: varchar("socialTwitter", { length: 255 }),
  socialGithub: varchar("socialGithub", { length: 255 }),
  footerText: text("footerText").default("Precision engineering partner delivering excellence").notNull(),
  copyrightText: varchar("copyrightText", { length: 255 }).default("© 2026 OM TECHNO TOOLS. All rights reserved.").notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().$onUpdate(() => new Date()).notNull(),
});

export type GeneralSettings = typeof generalSettings.$inferSelect;

/**
 * SEO metadata settings (Single Row Table: id=1)
 */
export const seoSettings = pgTable("seoSettings", {
  id: integer("id").primaryKey().default(1),
  title: varchar("title", { length: 255 }).default("OM TECHNO TOOLS - Precision Engineering").notNull(),
  metaDescription: text("metaDescription").default("High-precision moulds engineered for mass production of plastic and rubber components.").notNull(),
  keywords: text("keywords").default("moulds, plastic injection, precision engineering, rubber moulds").notNull(),
  ogImage: varchar("ogImage", { length: 512 }),
  twitterCard: varchar("twitterCard", { length: 255 }).default("summary_large_image").notNull(),
  robots: varchar("robots", { length: 255 }).default("index, follow").notNull(),
  canonicalUrl: varchar("canonicalUrl", { length: 512 }),
  updatedAt: timestamp("updatedAt").defaultNow().$onUpdate(() => new Date()).notNull(),
});

export type SeoSettings = typeof seoSettings.$inferSelect;

/**
 * Hero Section configuration (Single Row Table: id=1)
 */
export const heroSection = pgTable("heroSection", {
  id: integer("id").primaryKey().default(1),
  heading: varchar("heading", { length: 255 }).default("Engineered for Precision. Built for Performance.").notNull(),
  subheading: text("subheading").default("A precision engineering partner delivering excellence in plastic injection moulds, rubber moulds, and precision fixtures for demanding industrial applications.").notNull(),
  primaryBtnText: varchar("primaryBtnText", { length: 50 }).default("Get Started").notNull(),
  primaryBtnUrl: varchar("primaryBtnUrl", { length: 255 }).default("#contact").notNull(),
  secondaryBtnText: varchar("secondaryBtnText", { length: 50 }).default("View Details").notNull(),
  secondaryBtnUrl: varchar("secondaryBtnUrl", { length: 255 }).default("#services").notNull(),
  backgroundImageUrl: varchar("backgroundImageUrl", { length: 512 }),
  heroImageUrl: varchar("heroImageUrl", { length: 512 }).default("https://d2xsxph8kpxj0f.cloudfront.net/310519663040908526/T5nUZGsYwviFHSbhKoH2Ra/hero-machinery-outline-D58gBzYTz8D6r7LhsGbZmk.webp").notNull(),
  visible: integer("visible").default(1).notNull(), // 1 = visible, 0 = hidden
  updatedAt: timestamp("updatedAt").defaultNow().$onUpdate(() => new Date()).notNull(),
});

export type HeroSection = typeof heroSection.$inferSelect;

/**
 * About Section configuration (Single Row Table: id=1)
 */
export const aboutSection = pgTable("aboutSection", {
  id: integer("id").primaryKey().default(1),
  title: varchar("title", { length: 255 }).default("ABOUT US & TIMELINE").notNull(),
  subtitle: varchar("subtitle", { length: 255 }).default("With 25+ years experience").notNull(),
  description: text("description").default("A clean sector with blending of 25+ years experience milestone").notNull(),
  mission: text("mission").default("To deliver unmatched quality in mould manufacturing and precision components through engineering excellence and continuous innovation.").notNull(),
  vision: text("vision").default("To be a global leader in precision engineering solutions, recognized for technical expertise, customer service, and absolute accuracy.").notNull(),
  imageUrl: varchar("imageUrl", { length: 512 }),
  ctaText: varchar("ctaText", { length: 50 }).default("Learn More").notNull(),
  ctaUrl: varchar("ctaUrl", { length: 255 }).default("#about").notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().$onUpdate(() => new Date()).notNull(),
});

export type AboutSection = typeof aboutSection.$inferSelect;

/**
 * Services portfolio (Multiple Rows)
 */
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  shortDescription: text("shortDescription").notNull(),
  longDescription: text("longDescription").notNull(),
  icon: varchar("icon", { length: 50 }).default("Settings").notNull(),
  displayOrder: integer("displayOrder").default(0).notNull(),
  status: varchar("status", { length: 50 }).default("active").notNull(),
  imageUrl: varchar("imageUrl", { length: 512 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().$onUpdate(() => new Date()).notNull(),
});

export type Service = typeof services.$inferSelect;
export type InsertService = typeof services.$inferInsert;

/**
 * Team members (Multiple Rows)
 */
export const team = pgTable("team", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  role: varchar("role", { length: 255 }).notNull(),
  bio: text("bio"),
  photoUrl: varchar("photoUrl", { length: 512 }),
  linkedin: varchar("linkedin", { length: 255 }),
  twitter: varchar("twitter", { length: 255 }),
  github: varchar("github", { length: 255 }),
  displayOrder: integer("displayOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().$onUpdate(() => new Date()).notNull(),
});

export type TeamMember = typeof team.$inferSelect;
export type InsertTeamMember = typeof team.$inferInsert;

/**
 * Gallery media images (Multiple Rows)
 */
export const gallery = pgTable("gallery", {
  id: serial("id").primaryKey(),
  imageUrl: varchar("imageUrl", { length: 512 }).notNull(),
  displayOrder: integer("displayOrder").default(0).notNull(),
  caption: varchar("caption", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type GalleryItem = typeof gallery.$inferSelect;
export type InsertGalleryItem = typeof gallery.$inferInsert;

/**
 * Customer testimonials (Multiple Rows)
 */
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  clientName: varchar("clientName", { length: 255 }).notNull(),
  company: varchar("company", { length: 255 }),
  photoUrl: varchar("photoUrl", { length: 512 }),
  review: text("review").notNull(),
  rating: integer("rating").default(5).notNull(),
  visible: integer("visible").default(1).notNull(),
  displayOrder: integer("displayOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().$onUpdate(() => new Date()).notNull(),
});

export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = typeof testimonials.$inferInsert;

/**
 * Frequently Asked Questions (FAQ) (Multiple Rows)
 */
export const faqs = pgTable("faqs", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  displayOrder: integer("displayOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().$onUpdate(() => new Date()).notNull(),
});

export type Faq = typeof faqs.$inferSelect;
export type InsertFaq = typeof faqs.$inferInsert;
