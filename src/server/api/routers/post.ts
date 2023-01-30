import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const postRouter = createTRPCRouter({
  getOne: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.post.findUnique({
        where: { id: input.id },
        include: { author: true },
      });
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
  likeOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.post.update({
        where: {
          id: input.id,
        },
        data: {
          likesCount: { increment: 1 },
          likedBy: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });
    }),
  unlikeOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.post.update({
        where: {
          id: input.id,
        },
        data: {
          likesCount: { decrement: 1 },
          likedBy: {
            disconnect: {
              id: ctx.session.user.id,
            },
          },
        },
      });
    }),
});
