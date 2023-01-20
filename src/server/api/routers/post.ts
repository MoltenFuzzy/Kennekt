import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const postRouter = createTRPCRouter({
  getPosts: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findMany();
  }),
  getPost: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findUniqueOrThrow();
  }),
});
