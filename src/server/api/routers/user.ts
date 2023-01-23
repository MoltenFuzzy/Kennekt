import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  getMe: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findUnique({
      where: {
        id: ctx.session?.user?.id,
      },
    });
  }),
  getOne: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.user.findUnique({
        where: {
          id: input.id,
        },
      });
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findMany();
  }),
  getMyAccounts: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findMany({
      where: { id: ctx.session?.user?.id },
      select: { accounts: true },
    });
  }),
  setUsername: protectedProcedure
    .input(z.object({ username: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          username: input.username,
        },
      });
    }),
  followUser: protectedProcedure.mutation(({ ctx }) => {
    return "";
  }),
});
