import { z } from "zod";
import { router, publicProcedure, adminProcedure } from "../trpc.js";
import { db } from "../db.js";
import { contactSubmissions } from "../../drizzle/schema.js";
import { eq, sql } from "drizzle-orm";

// Public contact router
export const publicContactRouter = router({
  submit: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().email(),
        phone: z.string().optional().nullable(),
        subject: z.string(),
        message: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await db.insert(contactSubmissions).values({
        name: input.name,
        email: input.email,
        phone: input.phone || null,
        subject: input.subject,
        message: input.message,
        read: 0,
      });

      return { success: true };
    }),
});

// Admin contact router
export const adminContactRouter = router({
  list: adminProcedure.query(async () => {
    try {
      return await db
        .select()
        .from(contactSubmissions)
        .orderBy(sql`${contactSubmissions.createdAt} DESC`);
    } catch (e) {
      console.error("Error listing contacts:", e);
      return [];
    }
  }),
  markAsRead: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db
        .update(contactSubmissions)
        .set({ read: 1 })
        .where(eq(contactSubmissions.id, input.id));
      return { success: true };
    }),
  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.delete(contactSubmissions).where(eq(contactSubmissions.id, input.id));
      return { success: true };
    }),
});
