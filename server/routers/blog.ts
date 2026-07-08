import { z } from "zod";
import { router, publicProcedure, adminProcedure } from "../trpc.js";
import { db } from "../db.js";
import { blogPosts } from "../../drizzle/schema.js";
import { eq, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

// Public blog router
export const publicBlogRouter = router({
  list: publicProcedure.query(async () => {
    try {
      return await db
        .select()
        .from(blogPosts)
        .where(eq(blogPosts.published, 1))
        .orderBy(sql`${blogPosts.createdAt} DESC`);
    } catch (e) {
      console.error("Error fetching public blogs:", e);
      return [];
    }
  }),
});

// Admin blog router
export const adminBlogRouter = router({
  list: adminProcedure.query(async () => {
    try {
      return await db
        .select()
        .from(blogPosts)
        .orderBy(sql`${blogPosts.createdAt} DESC`);
    } catch (e) {
      console.error("Error fetching admin blogs:", e);
      return [];
    }
  }),
  create: adminProcedure
    .input(
      z.object({
        title: z.string(),
        slug: z.string(),
        excerpt: z.string().optional().nullable(),
        content: z.string(),
        author: z.string().optional().nullable(),
        coverImage: z.string().optional().nullable(),
        published: z.number().default(0),
      })
    )
    .mutation(async ({ input }) => {
      // Check slug uniqueness
      const existing = await db
        .select()
        .from(blogPosts)
        .where(eq(blogPosts.slug, input.slug))
        .limit(1);

      if (existing.length > 0) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "A blog post with this slug already exists.",
        });
      }

      await db.insert(blogPosts).values({
        title: input.title,
        slug: input.slug,
        excerpt: input.excerpt || null,
        content: input.content,
        author: input.author || null,
        coverImage: input.coverImage || null,
        published: input.published,
      });

      return { success: true };
    }),
  update: adminProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string(),
        slug: z.string(),
        excerpt: z.string().optional().nullable(),
        content: z.string(),
        author: z.string().optional().nullable(),
        coverImage: z.string().optional().nullable(),
        published: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;

      // Check slug uniqueness
      const existing = await db
        .select()
        .from(blogPosts)
        .where(eq(blogPosts.slug, input.slug))
        .limit(2);

      if (existing.some((p) => p.id !== id)) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "A blog post with this slug already exists.",
        });
      }

      await db
        .update(blogPosts)
        .set({
          title: data.title,
          slug: data.slug,
          excerpt: data.excerpt || null,
          content: data.content,
          author: data.author || null,
          coverImage: data.coverImage || null,
          published: data.published,
        })
        .where(eq(blogPosts.id, id));

      return { success: true };
    }),
  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.delete(blogPosts).where(eq(blogPosts.id, input.id));
      return { success: true };
    }),
});
