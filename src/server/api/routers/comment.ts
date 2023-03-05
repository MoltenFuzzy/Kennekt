import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const commentRouter = createTRPCRouter({
  getOne: publicProcedure.query(({ ctx }) => {
    // TODO: allow search for comment by post id, author id, etc?
    return ctx.prisma.comment.findUniqueOrThrow();
  }),
  getAllFromPost: publicProcedure
    .input(z.object({ postId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.comment.findMany({
        where: {
          postId: input.postId,
        },
        include: { author: true, replies: true },
      });
    }),
  getAllFromUser: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.comment.findMany({
        where: {
          authorId: input.userId,
        },
        include: { author: true },
      });
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.comment.findMany({ include: { author: true } });
  }),
  createOne: protectedProcedure
    .input(z.object({ postId: z.string(), text: z.string() }))
    .mutation(async ({ ctx, input }) => {
      //! Testing async/await stuff
      // TODO: if creating a comment fails, dont increment the commentsCount
      await ctx.prisma.post.update({
        where: {
          id: input.postId,
        },
        data: {
          commentsCount: { increment: 1 },
        },
      });

      return ctx.prisma.comment.create({
        data: {
          authorId: ctx.session.user.id,
          postId: input.postId,
          text: input.text,
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
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
        select: {
          likedComments: true,
        },
      });

      // TODO: optimize this check
      // like a comment, if the user has already liked it, unlike it
      if (user?.likedComments?.some((comment) => comment.id === input.id)) {
        return ctx.prisma.comment.update({
          where: {
            id: input.id,
          },
          data: {
            likedBy: {
              disconnect: {
                id: ctx.session.user.id,
              },
            },
            likesCount: { decrement: 1 },
          },
        });
      }

      return ctx.prisma.comment.update({
        where: {
          id: input.id,
        },
        data: {
          likedBy: {
            connect: {
              // TODO: check if user has already liked the comment
              id: ctx.session.user.id,
            },
          },
          likesCount: { increment: 1 },
        },
      });
    }),
});
