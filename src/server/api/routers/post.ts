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
    return ctx.prisma.post.findMany({
      include: { author: true, images: true },
    });
  }),
  createOne: protectedProcedure
    .input(z.object({ title: z.string(), body: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // create image object
      const image = await ctx.prisma.image.create({
        data: {
          userId: ctx.session.user.id,
          url: "https://picsum.photos/200/300",
        },
      });

      // create post object and connect image object
      const post = await ctx.prisma.post.create({
        data: {
          authorId: ctx.session.user.id,
          title: input.title,
          body: input.body,
          images: {
            connect: {
              id: image.id,
            },
          },
        },
        // select returns those records
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      // update image object with post id
      await ctx.prisma.image.update({
        where: {
          id: image.id,
        },
        data: {
          // postId: post.id,
          post: {
            connect: {
              id: post.id,
            },
          },
        },
      });

      // return post object
      return post;
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
