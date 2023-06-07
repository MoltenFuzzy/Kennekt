import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import type { Comment } from "../../../types/types";

type CommentWithReplies = Comment & {
  replies: Comment[];
};

export const commentRouter = createTRPCRouter({
  getOne: publicProcedure
    .input(z.object({ commentId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.comment.findUnique({
        where: {
          id: input.commentId,
        },
      });
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.comment.findMany({ include: { author: true } });
  }),
  // TODO: get one comment with all replies
  // * Query Comments with all replies
  getOneWithAllReplies: publicProcedure
    .input(z.object({ commentId: z.string() }))
    .query(({ ctx, input }) => {
      return null;
    }),
  //* get all comments with all replies for a post
  getAllFromPost: publicProcedure
    .input(z.object({ postId: z.string() }))
    .query(async ({ ctx, input }) => {
      /* 
      instead go directly to comment table and search for comments with the postId
      we know comments with null parentCommentIds are Top level comments
      take those and recurse through them to until we reach comments with no replies in their list?
      PROBLEM IS I CANT GET THE REPLIES LIST SINCE IT IS A RELATIONSHIP
      */

      const result = await ctx.prisma.$queryRaw<Comment[]>`
        WITH RECURSIVE comment_replies AS (
            SELECT c.id, c.content, c."parentCommentId", c."authorId" 
            FROM "Comment" c
            JOIN "User" u ON u.id = c."authorId"
            WHERE c."parentCommentId" IS NULL
            AND c."postId" = ${input.postId}

            UNION ALL

            SELECT c.id, c.content, c."parentCommentId", c."authorId"
            FROM "Comment" c
            INNER JOIN comment_replies cr ON cr.id = c."parentCommentId"
        )
        SELECT cr.id, cr.content, cr."parentCommentId", cr."authorId", 
              JSON_BUILD_OBJECT(
                'id', u.id, 
                'username', u.username, 
                'image', u.image, 
                'email', u.email,
                'role', u.role
              ) AS author
        FROM comment_replies cr
        JOIN "User" u ON u.id = cr."authorId";`;

      // Helper function to recursively build the comment tree
      function buildCommentTree(
        comments: Comment[],
        parent_id: string | null = null
      ): Comment[] {
        const commentTree: Comment[] = [];
        for (const comment of comments) {
          if (comment.parentCommentId === parent_id) {
            const childComments = buildCommentTree(comments, comment.id);
            if (childComments.length > 0) {
              comment.replies = childComments;
            } else {
              comment.replies = [];
            }
            commentTree.push(comment);
          }
        }
        return commentTree;
      }

      return buildCommentTree(result);
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
  createOne: protectedProcedure
    .input(z.object({ postId: z.string(), content: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // TODO: if creating a comment fails, dont increment the commentsCount
      await ctx.prisma.post.update({
        where: {
          id: input.postId,
        },
        data: {
          commentsCount: { increment: 1 },
        },
      });

      return await ctx.prisma.comment.create({
        data: {
          authorId: ctx.session.user.id,
          postId: input.postId,
          content: input.content,
        },

        include: {
          author: true,
          replies: true,
        },
      });
    }),
  deleteOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const comment = await ctx.prisma.comment.findUnique({
        where: {
          id: input.id,
        },
        select: {
          authorId: true,
          postId: true,
        },
      });
    }),
  createReply: protectedProcedure
    .input(z.object({ parentCommentId: z.string(), content: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // TODO: REFACTOR THIS

      const parentComment = await ctx.prisma.comment.update({
        where: {
          id: input.parentCommentId,
        },
        data: {
          repliesCount: { increment: 1 },
        },
      });

      const test = await ctx.prisma.comment.create({
        data: {
          authorId: ctx.session.user.id,
          postId: parentComment.postId,
          content: input.content,
        },

        include: {
          author: true,
          replies: true,
        },
      });

      await ctx.prisma.comment.update({
        where: {
          id: input.parentCommentId,
        },
        data: {
          replies: {
            connect: {
              id: test.id,
            },
          },
        },
      });

      return test;
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
