import { router, publicProcedure } from "../trpc.js";
import { COOKIE_NAME } from "../../shared/const.js";

export const authRouter = router({
  me: publicProcedure.query(({ ctx }) => {
    return ctx.user;
  }),
  logout: publicProcedure.mutation(({ ctx }) => {
    const isHttps = ctx.req.secure || ctx.req.headers["x-forwarded-proto"] === "https";
    ctx.res.clearCookie(COOKIE_NAME, {
      path: "/",
      sameSite: isHttps ? "none" : "lax",
      secure: isHttps,
    });
    return { success: true };
  }),
});
