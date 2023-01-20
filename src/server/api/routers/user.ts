import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  getUser: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findUniqueOrThrow();
  }),
  getUsers: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findMany();
  }),
  getAccounts: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findMany({
      where: { id: ctx.session?.user?.id },
      select: { accounts: true },
    });
  }),
  followUser: protectedProcedure.mutation(({ ctx }) => {
    return "";
  }),
});
