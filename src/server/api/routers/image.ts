import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import type { PresignedPost } from "@aws-sdk/s3-presigned-post";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { env } from "../../../env/server.mjs";
// import AWS from "aws-sdk";
import s3 from "../../s3";

export const imageRouter = createTRPCRouter({
  createPresignedUrl: protectedProcedure
    .input(
      z.object({
        postId: z.string().optional(),
        images: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // ! Don't delete this, use as reference
      //* Uploads one file to s3
      const image = await ctx.prisma.image.create({
        data: {
          userId: ctx.session.user.id,
          postId: input.postId,
        },
      });
      return new Promise<PresignedPost>((resolve, reject) => {
        const params = {
          Bucket: env.AWS_BUCKET_NAME,
          Fields: {
            key: `${ctx.session.user.id}/${input.postId as string}/${image.id}`,
          },
          Expires: 3600,
          ContentType: "image/*",
          Conditions: [
            // { acl: "public-read" },
            ["starts-with", "$Content-Type", "image/"],
            ["content-length-range", 0, 10000000], // 10 Mb
          ],
        };
        s3.createPresignedPost(params, (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
      // !------------------------------------------------!
      // //* File structure: userId/postId/imageId
      // // creating multiple images tied to a certain post belonging to a certain user
      // const data = input.images.map(() => {
      //   return {
      //     userId: ctx.session.user.id,
      //     postId: input.postId,
      //   };
      // });
      // const images = await ctx.prisma.$transaction(
      //   input.images.map(() =>
      //     ctx.prisma.image.create({
      //       data: { userId: ctx.session.user.id, postId: input.postId },
      //     })
      //   )
      // );
      // console.log(images);
      // //* returns multiple file presigned urls
      // const presignedPosts: Promise<PresignedPost>[] = [];
      // images.forEach((image) => {
      //   const params = {
      //     Bucket: env.AWS_BUCKET_NAME,
      //     Fields: {
      //       key: `${ctx.session.user.id}/${image.postId as string}/${image.id}`,
      //     },
      //     Expires: 3600,
      //     ContentType: "image/*",
      //     Conditions: [
      //       ["starts-with", "$Content-Type", "image/"],
      //       ["content-length-range", 0, 10000000], // 10 Mb
      //     ],
      //   };
      //   const presignedPost = new Promise<PresignedPost>((resolve, reject) => {
      //     s3.createPresignedPost(params, (err, data) => {
      //       if (err) {
      //         reject(err);
      //       } else {
      //         resolve(data);
      //       }
      //     });
      //   });
      //   presignedPosts.push(presignedPost);
      // });
      // return Promise.all(presignedPosts);
      // const fileKeys = input.fileKeys;
      // const presignedPosts: Promise<PresignedPost>[] = [];
      // fileKeys.forEach((fileKey) => {
      //   const presignedPost = createPresignedPost(s3, {
      //     Bucket: env.AWS_BUCKET_NAME,
      //     Key: fileKey,
      //     Fields: {
      //       key: fileKey,
      //     },
      //     Conditions: [
      //       ["content-length-range", 0, 1048576],
      //       ["starts-with", "$Content-Type", "image/"],
      //     ],
      //     Expires: 3600,
      //   });
      //   presignedPosts.push(presignedPost);
      // });
      // return Promise.all(presignedPosts);
    }),
});
