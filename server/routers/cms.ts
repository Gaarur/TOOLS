import { z } from "zod";
import { router, publicProcedure, adminProcedure } from "../trpc.js";
import { db } from "../db.js";
import {
  heroSection,
  aboutSection,
  seoSettings,
  generalSettings,
  services,
  team,
  gallery,
  testimonials,
  faqs,
} from "../../drizzle/schema.js";
import { eq, sql } from "drizzle-orm";

// Self-healing check and getter for single-row tables
async function getOrInitSingleRow<T extends { id: number }>(
  table: any,
  id: number = 1
): Promise<T> {
  let row = (await db.select().from(table).where(eq(table.id, id)).limit(1))[0];
  if (!row) {
    try {
      await db.insert(table).values({ id } as any);
      row = (await db.select().from(table).where(eq(table.id, id)).limit(1))[0];
    } catch (e) {
      console.error(`Error initializing single row for table:`, e);
    }
  }
  return row as T;
}

export const cmsRouter = router({
  // Public route to fetch all content needed for landing page
  getContent: publicProcedure.query(async () => {
    try {
      const hero = await getOrInitSingleRow<any>(heroSection);
      const about = await getOrInitSingleRow<any>(aboutSection);
      const seo = await getOrInitSingleRow<any>(seoSettings);
      const settings = await getOrInitSingleRow<any>(generalSettings);

      const servicesList = await db
        .select()
        .from(services)
        .where(eq(services.status, "active"))
        .orderBy(sql`${services.displayOrder} ASC, ${services.id} ASC`);

      const teamList = await db
        .select()
        .from(team)
        .orderBy(sql`${team.displayOrder} ASC, ${team.id} ASC`);

      const galleryList = await db
        .select()
        .from(gallery)
        .orderBy(sql`${gallery.displayOrder} ASC, ${gallery.id} ASC`);

      const testimonialsList = await db
        .select()
        .from(testimonials)
        .where(eq(testimonials.visible, 1))
        .orderBy(sql`${testimonials.displayOrder} ASC, ${testimonials.id} ASC`);

      const faqsList = await db
        .select()
        .from(faqs)
        .orderBy(sql`${faqs.displayOrder} ASC, ${faqs.id} ASC`);

      return {
        hero,
        about,
        seo,
        settings,
        services: servicesList,
        team: teamList,
        gallery: galleryList,
        testimonials: testimonialsList,
        faqs: faqsList,
      };
    } catch (e) {
      console.error("Error loading site content:", e);
      // Return default shapes to avoid crashing frontend
      return {
        hero: {
          heading: "Engineered for Precision. Built for Performance.",
          subheading: "A precision engineering partner delivering excellence in plastic injection moulds, rubber moulds, and precision fixtures.",
          primaryBtnText: "Get Started",
          primaryBtnUrl: "#contact",
          secondaryBtnText: "View Details",
          secondaryBtnUrl: "#services",
          heroImageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663040908526/T5nUZGsYwviFHSbhKoH2Ra/hero-machinery-outline-D58gBzYTz8D6r7LhsGbZmk.webp",
          visible: 1,
        },
        about: {
          title: "ABOUT US & TIMELINE",
          subtitle: "With 25+ years experience",
          description: "A clean sector with blending of 25+ years experience milestone",
          mission: "To deliver unmatched quality in mould manufacturing and precision components.",
          vision: "To be a global leader in precision engineering solutions.",
          ctaText: "Learn More",
          ctaUrl: "#about",
        },
        seo: {
          title: "OM TECHNO TOOLS - Precision Engineering",
          metaDescription: "High-precision moulds engineered for mass production of plastic and rubber components.",
          keywords: "moulds, plastic injection, precision engineering, rubber moulds",
          twitterCard: "summary_large_image",
          robots: "index, follow",
        },
        settings: {
          companyName: "OM TECHNO TOOLS",
          tagline: "Engineered for Precision. Built for Performance.",
          description: "Precision engineering solutions for manufacturing excellence",
          address: "Plot No. 393 & 394, Udyog Kendra 2, Ecotech 3, Greater Noida, Pincode: 201306",
          phone1: "+91 9289304917",
          phone2: "+91 9625696886",
          email1: "om.techtools1971@gmail.com",
          email2: "omtt.design@gmail.com",
          footerText: "Precision engineering partner delivering excellence",
          copyrightText: "© 2026 OM TECHNO TOOLS. All rights reserved.",
        },
        services: [],
        team: [],
        gallery: [],
        testimonials: [],
        faqs: [],
      };
    }
  }),

  // Admin Single-Row updates
  updateHero: adminProcedure
    .input(
      z.object({
        heading: z.string(),
        subheading: z.string(),
        primaryBtnText: z.string(),
        primaryBtnUrl: z.string(),
        secondaryBtnText: z.string(),
        secondaryBtnUrl: z.string(),
        backgroundImageUrl: z.string().optional().nullable(),
        heroImageUrl: z.string(),
        visible: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      await getOrInitSingleRow(heroSection);
      await db.update(heroSection).set(input).where(eq(heroSection.id, 1));
      return { success: true };
    }),

  updateAbout: adminProcedure
    .input(
      z.object({
        title: z.string(),
        subtitle: z.string(),
        description: z.string(),
        mission: z.string(),
        vision: z.string(),
        imageUrl: z.string().optional().nullable(),
        ctaText: z.string(),
        ctaUrl: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await getOrInitSingleRow(aboutSection);
      await db.update(aboutSection).set(input).where(eq(aboutSection.id, 1));
      return { success: true };
    }),

  updateSeo: adminProcedure
    .input(
      z.object({
        title: z.string(),
        metaDescription: z.string(),
        keywords: z.string(),
        ogImage: z.string().optional().nullable(),
        twitterCard: z.string(),
        robots: z.string(),
        canonicalUrl: z.string().optional().nullable(),
      })
    )
    .mutation(async ({ input }) => {
      await getOrInitSingleRow(seoSettings);
      await db.update(seoSettings).set(input).where(eq(seoSettings.id, 1));
      return { success: true };
    }),

  updateSettings: adminProcedure
    .input(
      z.object({
        companyName: z.string(),
        tagline: z.string(),
        description: z.string(),
        address: z.string(),
        phone1: z.string(),
        phone2: z.string(),
        email1: z.string().email(),
        email2: z.string().email(),
        logoUrl: z.string().optional().nullable(),
        faviconUrl: z.string().optional().nullable(),
        googleMapsEmbed: z.string().optional().nullable(),
        socialLinkedin: z.string().optional().nullable(),
        socialTwitter: z.string().optional().nullable(),
        socialGithub: z.string().optional().nullable(),
        footerText: z.string(),
        copyrightText: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await getOrInitSingleRow(generalSettings);
      await db.update(generalSettings).set(input).where(eq(generalSettings.id, 1));
      return { success: true };
    }),

  // Services CRUD
  listServices: adminProcedure.query(async () => {
    return db.select().from(services).orderBy(sql`${services.displayOrder} ASC, ${services.id} ASC`);
  }),
  createService: adminProcedure
    .input(
      z.object({
        title: z.string(),
        shortDescription: z.string(),
        longDescription: z.string(),
        icon: z.string().default("Settings"),
        displayOrder: z.number().default(0),
        status: z.string().default("active"),
        imageUrl: z.string().optional().nullable(),
      })
    )
    .mutation(async ({ input }) => {
      await db.insert(services).values(input);
      return { success: true };
    }),
  updateService: adminProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string(),
        shortDescription: z.string(),
        longDescription: z.string(),
        icon: z.string(),
        displayOrder: z.number(),
        status: z.string(),
        imageUrl: z.string().optional().nullable(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      await db.update(services).set(data).where(eq(services.id, id));
      return { success: true };
    }),
  deleteService: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.delete(services).where(eq(services.id, input.id));
      return { success: true };
    }),

  // Team CRUD
  listTeam: adminProcedure.query(async () => {
    return db.select().from(team).orderBy(sql`${team.displayOrder} ASC, ${team.id} ASC`);
  }),
  createTeamMember: adminProcedure
    .input(
      z.object({
        name: z.string(),
        role: z.string(),
        bio: z.string().optional().nullable(),
        photoUrl: z.string().optional().nullable(),
        linkedin: z.string().optional().nullable(),
        twitter: z.string().optional().nullable(),
        github: z.string().optional().nullable(),
        displayOrder: z.number().default(0),
      })
    )
    .mutation(async ({ input }) => {
      await db.insert(team).values(input);
      return { success: true };
    }),
  updateTeamMember: adminProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string(),
        role: z.string(),
        bio: z.string().optional().nullable(),
        photoUrl: z.string().optional().nullable(),
        linkedin: z.string().optional().nullable(),
        twitter: z.string().optional().nullable(),
        github: z.string().optional().nullable(),
        displayOrder: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      await db.update(team).set(data).where(eq(team.id, id));
      return { success: true };
    }),
  deleteTeamMember: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.delete(team).where(eq(team.id, input.id));
      return { success: true };
    }),

  // Gallery CRUD
  listGallery: adminProcedure.query(async () => {
    return db.select().from(gallery).orderBy(sql`${gallery.displayOrder} ASC, ${gallery.id} ASC`);
  }),
  addGalleryImage: adminProcedure
    .input(
      z.object({
        imageUrl: z.string(),
        displayOrder: z.number().default(0),
        caption: z.string().optional().nullable(),
      })
    )
    .mutation(async ({ input }) => {
      await db.insert(gallery).values(input);
      return { success: true };
    }),
  deleteGalleryImage: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.delete(gallery).where(eq(gallery.id, input.id));
      return { success: true };
    }),

  // Testimonials CRUD
  listTestimonials: adminProcedure.query(async () => {
    return db.select().from(testimonials).orderBy(sql`${testimonials.displayOrder} ASC, ${testimonials.id} ASC`);
  }),
  createTestimonial: adminProcedure
    .input(
      z.object({
        clientName: z.string(),
        company: z.string().optional().nullable(),
        photoUrl: z.string().optional().nullable(),
        review: z.string(),
        rating: z.number().default(5),
        visible: z.number().default(1),
        displayOrder: z.number().default(0),
      })
    )
    .mutation(async ({ input }) => {
      await db.insert(testimonials).values(input);
      return { success: true };
    }),
  updateTestimonial: adminProcedure
    .input(
      z.object({
        id: z.number(),
        clientName: z.string(),
        company: z.string().optional().nullable(),
        photoUrl: z.string().optional().nullable(),
        review: z.string(),
        rating: z.number(),
        visible: z.number(),
        displayOrder: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      await db.update(testimonials).set(data).where(eq(testimonials.id, id));
      return { success: true };
    }),
  deleteTestimonial: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.delete(testimonials).where(eq(testimonials.id, input.id));
      return { success: true };
    }),

  // FAQs CRUD
  listFaqs: adminProcedure.query(async () => {
    return db.select().from(faqs).orderBy(sql`${faqs.displayOrder} ASC, ${faqs.id} ASC`);
  }),
  createFaq: adminProcedure
    .input(
      z.object({
        question: z.string(),
        answer: z.string(),
        displayOrder: z.number().default(0),
      })
    )
    .mutation(async ({ input }) => {
      await db.insert(faqs).values(input);
      return { success: true };
    }),
  updateFaq: adminProcedure
    .input(
      z.object({
        id: z.number(),
        question: z.string(),
        answer: z.string(),
        displayOrder: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      await db.update(faqs).set(data).where(eq(faqs.id, id));
      return { success: true };
    }),
  deleteFaq: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.delete(faqs).where(eq(faqs.id, input.id));
      return { success: true };
    }),
});
