import { z } from "zod";
import { env } from "../../../env/server.mjs";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import type { FullPost } from "../../../types/types.js";
import s3 from "../../s3";

export const postRouter = createTRPCRouter({
  getOne: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.post.findUnique({
        where: { id: input.id },
        include: { author: true },
      });
    }),
  getAllFromUser: publicProcedure
    .input(
      z.object({
        id: z.string().optional(),
        username: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const posts = await ctx.prisma.post.findMany({
        take: 5,
        where: {
          OR: [
            { authorId: input.id },
            { author: { username: input.username } },
          ],
        },
        include: { author: true, images: true },
      });
      await embedPostImageUrls(posts);
      return posts;
    }),
  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: { author: true, images: true },
    });

    // loop through posts and get signed urls for each image
    // then add the url to each image object in each post(NOTE: not stored in db)
    await embedPostImageUrls(posts);
    return posts;
  }),
  createOne: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        body: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.post.create({
        data: {
          authorId: ctx.session.user.id,
          title: input.title,
          body: input.body,
        },
        include: { author: true, images: true },
      });
    }),
  updateOne: protectedProcedure.mutation(() => {
    return null;
  }),
  deleteOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.findUnique({
        where: { id: input.id },
        select: { authorId: true },
      });
      // backend validation for user authorization to delete post
      if (post?.authorId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "You are not authorized to delete this post",
        });
      }

      return ctx.prisma.post.delete({
        where: { id: input.id },
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
  dislikeOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.post.update({
        where: {
          id: input.id,
        },
        data: {
          dislikesCount: { increment: 1 },
          dislikedBy: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });
    }),
  undislikeOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.post.update({
        where: {
          id: input.id,
        },
        data: {
          dislikesCount: { decrement: 1 },
          dislikedBy: {
            disconnect: {
              id: ctx.session.user.id,
            },
          },
        },
      });
    }),
});

async function embedPostImageUrls(posts: FullPost[]) {
  for (const post of posts) {
    let urls: (string | undefined)[] | undefined = [];
    for (const image of post.images) {
      const bucketObjects = await s3
        .listObjectsV2({
          Bucket: env.AWS_BUCKET_NAME,
          Prefix: `${image.userId}/${image?.postId || ""}/`,
        })
        .promise();

      urls = bucketObjects.Contents?.map((content) => {
        if (content.Key) {
          const url = s3.getSignedUrl("getObject", {
            Bucket: env.AWS_BUCKET_NAME,
            Key: content.Key,
            Expires: 3600,
          });
          return url;
        }
      });
    }
    post.images.forEach((image, index) => {
      image.url = urls?.at(index) as string;
    });
  }
}
