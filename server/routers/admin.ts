import { z } from "zod";
import { router, publicProcedure, adminProcedure } from "../trpc.js";
import { TRPCError } from "@trpc/server";
import jwt from "jsonwebtoken";
import { ENV } from "../_core/env.js";
import { COOKIE_NAME, ONE_YEAR_MS } from "../../shared/const.js";
import { db } from "../db.js";
import { blogPosts, services, contactSubmissions } from "../../drizzle/schema.js";
import { sql } from "drizzle-orm";

export const adminRouter = router({
  login: publicProcedure
    .input(
      z.object({
        username: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const adminUser = ENV.adminUser || "admin";
      const adminPass = ENV.adminPass || "admin";

      if (input.username !== adminUser || input.password !== adminPass) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid admin credentials",
        });
      }

      // Sign JWT
      const token = jwt.sign(
        {
          openId: "admin_open_id",
          role: "admin",
          name: "Administrator",
        },
        ENV.cookieSecret || "secret-cookie-key-omtt",
        { expiresIn: "365d" }
      );

      // Set cookie
      const isHttps = ctx.req.secure || ctx.req.headers["x-forwarded-proto"] === "https";
      ctx.res.cookie(COOKIE_NAME, token, {
        maxAge: ONE_YEAR_MS,
        httpOnly: true,
        path: "/",
        sameSite: isHttps ? "none" : "lax",
        secure: isHttps,
      });

      return { success: true };
    }),

  getStats: adminProcedure.query(async () => {
    try {
      const blogCount = await db
        .select({ count: sql<number>`count(*)` })
        .from(blogPosts)
        .then((res) => Number(res[0]?.count || 0));

      const serviceCount = await db
        .select({ count: sql<number>`count(*)` })
        .from(services)
        .then((res) => Number(res[0]?.count || 0));

      const contactCount = await db
        .select({ count: sql<number>`count(*)` })
        .from(contactSubmissions)
        .then((res) => Number(res[0]?.count || 0));

      const unreadContactCount = await db
        .select({ count: sql<number>`count(*)` })
        .from(contactSubmissions)
        .where(sql`${contactSubmissions.read} = 0`)
        .then((res) => Number(res[0]?.count || 0));

      const recentSubmissions = await db
        .select()
        .from(contactSubmissions)
        .orderBy(sql`${contactSubmissions.createdAt} DESC`)
        .limit(5);

      const recentBlogs = await db
        .select()
        .from(blogPosts)
        .orderBy(sql`${blogPosts.createdAt} DESC`)
        .limit(5);

      return {
        blogCount,
        serviceCount,
        contactCount,
        unreadContactCount,
        recentSubmissions,
        recentBlogs,
        websiteStatus: "Live",
      };
    } catch (e) {
      console.error("Error fetching stats:", e);
      return {
        blogCount: 0,
        serviceCount: 0,
        contactCount: 0,
        unreadContactCount: 0,
        recentSubmissions: [],
        recentBlogs: [],
        websiteStatus: "Offline / Configuration Pending",
      };
    }
  }),
});
