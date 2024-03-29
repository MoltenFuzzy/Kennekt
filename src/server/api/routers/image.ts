import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import type { PresignedPost } from "@aws-sdk/s3-presigned-post";
import { env } from "../../../env/server.mjs";
import s3 from "../../s3";
import config from "../../../config/config";

export const imageRouter = createTRPCRouter({
  getAllForPost: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const bucketObjects = await s3
        .listObjectsV2({
          Bucket: env.AWS_BUCKET_NAME,
          // TODO: BUG - this only works for the current user and not others due to session
          Prefix: `${ctx.session.user.id}/${input.postId}/`,
        })
        .promise();

      const urls = bucketObjects.Contents?.map((content) => {
        if (content.Key) {
          const url = s3.getSignedUrl("getObject", {
            Bucket: env.AWS_BUCKET_NAME,
            Key: content.Key,
            Expires: config.PRESIGNED_URL_EXPIRATION,
          });
          return url;
        }
      });

      return urls as string[];
    }),
  createPresignedUrl: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
        images: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // // ! Don't delete this, use as reference
      // //* Uploads one file to s3
      // const image = await ctx.prisma.image.create({
      //   data: {
      //     userId: ctx.session.user.id,
      //     postId: input.postId,
      //   },
      // });
      // return new Promise<PresignedPost>((resolve, reject) => {
      //   const params = {
      //     Bucket: env.AWS_BUCKET_NAME,
      //     Fields: {
      //       key: `${ctx.session.user.id}/${input.postId as string}/${image.id}`,
      //     },
      //     Expires: 3600,
      //     ContentType: "image/*",
      //     Conditions: [
      //       // { acl: "public-read" },
      //       ["starts-with", "$Content-Type", "image/"],
      //       ["content-length-range", 0, 10000000], // 10 Mb
      //     ],
      //   };
      //   s3.createPresignedPost(params, (err, data) => {
      //     if (err) {
      //       reject(err);
      //     } else {
      //       resolve(data);
      //     }
      //   });
      // });
      // !------------------------------------------------!
      //* File structure: userId/postId/imageId

      const images = await ctx.prisma.$transaction(
        input.images.map(() =>
          ctx.prisma.image.create({
            data: { userId: ctx.session.user.id, postId: input.postId },
          })
        )
      );

      //* returns multiple file presigned urls
      const presignedPosts: Promise<PresignedPost>[] = [];
      images.forEach((image) => {
        const params = {
          Bucket: env.AWS_BUCKET_NAME,
          Fields: {
            key: `${ctx.session.user.id}/${image.postId as string}/${image.id}`,
          },
          Expires: config.PRESIGNED_URL_EXPIRATION,
          ContentType: "image/*",
          Conditions: [
            ["starts-with", "$Content-Type", "image/"],
            ["content-length-range", 0, config.MAX_FILE_SIZE], // 10 Mb
          ],
        };

        const presignedPost = new Promise<PresignedPost>((resolve, reject) => {
          s3.createPresignedPost(params, (err, data) => {
            if (err) {
              reject(err);
            } else {
              resolve(data);
            }
          });
        });
        presignedPosts.push(presignedPost);
      });
      return Promise.all(presignedPosts);
    }),
});
