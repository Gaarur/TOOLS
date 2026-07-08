import jwt from "jsonwebtoken";
import { ENV } from "./env.js";
import { db } from "../db.js";
import { users, type User } from "../../drizzle/schema.js";
import { eq } from "drizzle-orm";
import { COOKIE_NAME } from "../../shared/const.js";

export const sdk = {
  /**
   * Authenticates standard user requests or cron requests using JWT tokens.
   */
  async authenticateRequest(req: any): Promise<(User & { isCron?: boolean; taskUid?: string | null }) | null> {
    const cookies = req.cookies || {};
    const cookieVal = cookies[COOKIE_NAME] || req.headers[COOKIE_NAME] || req.headers["authorization"]?.replace("Bearer ", "");

    if (!cookieVal) {
      return null;
    }

    // 1. Try to decode as local admin JWT
    try {
      const decoded = jwt.verify(cookieVal, ENV.cookieSecret || "secret-cookie-key-omtt") as any;
      if (decoded && decoded.role === "admin") {
        return {
          id: 0, // Pseudo ID for admin
          openId: "admin_open_id",
          name: "Administrator",
          email: ENV.adminUser || "admin@omtt.com",
          loginMethod: "credentials",
          role: "admin",
          createdAt: new Date(),
          updatedAt: new Date(),
          lastSignedIn: new Date(),
        };
      }
    } catch (e) {
      // Not a local admin JWT, proceed to platform verification
    }

    // 2. Platform verification
    if (!ENV.forgeApiUrl || !ENV.forgeApiKey) {
      return null;
    }

    try {
      const baseUrl = ENV.forgeApiUrl.endsWith("/") ? ENV.forgeApiUrl : `${ENV.forgeApiUrl}/`;
      const fullUrl = new URL("webdevtoken.v1.WebDevService/GetUserInfoWithJwt", baseUrl).toString();

      const response = await fetch(fullUrl, {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          "connect-protocol-version": "1",
          authorization: `Bearer ${ENV.forgeApiKey}`,
        },
        body: JSON.stringify({
          jwtToken: cookieVal,
          projectId: ENV.appId,
        }),
      });

      if (!response.ok) {
        return null;
      }

      const data = (await response.json()) as any;
      if (!data || !data.openId) {
        return null;
      }

      // Check if this is a cron job
      const isCron = !!data.taskUid;
      const taskUid = data.taskUid || null;

      // Find or create user in local db
      let dbUser = (await db.select().from(users).where(eq(users.openId, data.openId)).limit(1))[0];

      if (!dbUser) {
        // First user is admin, others are standard users
        const allUsers = await db.select().from(users).limit(1);
        const role = allUsers.length === 0 ? "admin" : "user";

        await db.insert(users).values({
          openId: data.openId,
          name: data.name || "User",
          email: data.email || null,
          loginMethod: data.loginMethod || "oauth",
          role: role,
          lastSignedIn: new Date(),
        });

        dbUser = (await db.select().from(users).where(eq(users.openId, data.openId)).limit(1))[0];
      } else {
        // Update lastSignedIn
        await db.update(users).set({ lastSignedIn: new Date() }).where(eq(users.id, dbUser.id));
      }

      return {
        ...dbUser,
        isCron,
        taskUid,
      };
    } catch (e) {
      console.error("Platform authentication error:", e);
      return null;
    }
  },
};
