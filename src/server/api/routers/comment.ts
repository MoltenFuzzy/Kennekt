import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const commentRouter = createTRPCRouter({
  // getComment: publicProcedure.query(({ ctx }) => {
  //   return ctx.prisma.user.findUniqueOrThrow();
  // }),
  // getComments: publicProcedure.query(({ ctx }) => {
  //   return ctx.prisma.user.findMany();
  // }),
  // followUser: protectedProcedure.mutation(({ ctx }) => {
  //   return "";
  // }),
});
