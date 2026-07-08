import { router } from "../trpc.js";
import { authRouter } from "./auth.js";
import { publicBlogRouter, adminBlogRouter } from "./blog.js";
import { publicContactRouter, adminContactRouter } from "./contact.js";
import { adminRouter as baseAdminRouter } from "./admin.js";
import { cmsRouter } from "./cms.js";

// Combine the sub-routers for admin namespace
const adminRouter = router({
  login: baseAdminRouter.login,
  getStats: baseAdminRouter.getStats,
  blog: adminBlogRouter,
  contacts: adminContactRouter,
  cms: cmsRouter, // Admin CMS routers (Hero, About, Services, FAQ, etc.)
});

export const appRouter = router({
  auth: authRouter,
  blog: publicBlogRouter,
  contact: publicContactRouter,
  site: cmsRouter, // Public site queries (getContent)
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
