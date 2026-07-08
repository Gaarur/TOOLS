import { initTRPC, TRPCError } from "@trpc/server";
import type { TrpcContext } from "./_core/context.js";
import superjson from "superjson";

const t = initTRPC.context<TrpcContext>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

// Middleware to ensure user is logged in
const isAuthed = t.middleware(({ next, ctx }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "You must be signed in." });
  }
  return next();
});

// Middleware to ensure user is admin
const isAdmin = t.middleware(({ next, ctx }) => {
  if (!ctx.user || ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "You must be an administrator." });
  }
  return next();
});

export const protectedProcedure = t.procedure.use(isAuthed);
export const adminProcedure = t.procedure.use(isAdmin);
export const middleware = t.middleware;
export const mergeRouters = t.mergeRouters;
