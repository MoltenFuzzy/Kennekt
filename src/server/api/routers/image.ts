import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { S3Client } from "@aws-sdk/client-s3";
import type { PresignedPost } from "@aws-sdk/s3-presigned-post";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { env } from "../../../env/server.mjs";
import AWS from "aws-sdk";

export const imageRouter = createTRPCRouter({
  createPresignedUrl: protectedProcedure
    .input(
      z.object({
        fileKeys: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const image = await ctx.prisma.image.create({
        data: {
          userId: ctx.session.user.id,
        },
      });

      const s3 = new AWS.S3();

      return new Promise<PresignedPost>((resolve, reject) => {
        s3.createPresignedPost(
          {
            Fields: {
              key: `${ctx.session.user.id}/${image.id}`,
            },
            Conditions: [
              ["content-length-range", 0, 1048576],
              ["starts-with", "$Content-Type", "image/"],
            ],
            Expires: 3600,
            Bucket: env.AWS_BUCKET_NAME,
          },
          (err, data) => {
            if (err) {
              reject(err);
            } else {
              resolve(data);
            }
          }
        );
      });

      // const s3 = new S3Client({
      //   region: env.AWS_REGION,
      //   credentials: {
      //     accessKeyId: env.AWS_ACCESS_KEY_ID,
      //     secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
      //   },
      // });

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
