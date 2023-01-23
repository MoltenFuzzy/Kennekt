import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const postRouter = createTRPCRouter({
  getOne: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.post.findUniqueOrThrow();
  }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.post.findMany({ include: { author: true } });
  }),
  createOne: protectedProcedure
    .input(z.object({ title: z.string(), body: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.post.create({
        data: {
          authorId: ctx.session.user.id,
          title: input.title,
          body: input.body,
        },
        // select returns those records
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    }),
});
