import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const commentRouter = createTRPCRouter({
  getOne: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.comment.findUniqueOrThrow();
  }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.comment.findMany({ include: { author: true } });
  }),
  createOne: protectedProcedure
    .input(z.object({ comment: z.string(), postId: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.comment.create({
        data: {
          authorId: ctx.session.user.id,
          comment: input.comment,
          postId: input.postId,
        },
        // select returns those records
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    }),
  likeOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.comment.update({
        where: {
          id: input.id,
        },
        data: {
          likesCount: { increment: 1 },
        },
      });
    }),
  unlikeOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.comment.update({
        where: {
          id: input.id,
        },
        data: {
          likesCount: { decrement: 1 },
        },
      });
    }),
});
