import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import argon2id from "argon2";
import { Prisma } from "@prisma/client";

export const userRouter = createTRPCRouter({
  getMe: protectedProcedure.query(({ ctx }) => {
    console.log(ctx.session);
    return ctx.prisma.user.findUnique({
      where: {
        id: ctx.session?.user?.id,
      },
    });
  }),
  getOne: publicProcedure
    .input(
      z.object({
        id: z.string().optional(),
        username: z.string().optional(),
        email: z.string().optional(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.user.findFirstOrThrow({
        where: {
          OR: [
            { id: input.id },
            { username: input.username },
            { email: input.email },
          ],
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          name: true,
          username: true,
          email: true,
          image: true,
          role: true,
          followers: true,
          followings: true,
          likedPosts: true,
          createdAt: true,
        },
      });
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findMany();
  }),
  getMyAccounts: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findMany({
      where: { id: ctx.session?.user?.id },
      select: { accounts: true },
    });
  }),
  setUsername: protectedProcedure
    .input(z.object({ username: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          username: input.username,
        },
      });
    }),
  createOne: publicProcedure
    .input(
      z.object({
        firstName: z.string(),
        lastName: z.string(),
        username: z.string(),
        email: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      input.password = await argon2id.hash(input.password);
      try {
        await ctx.prisma.user.create({
          data: {
            firstName: input.firstName,
            lastName: input.lastName,
            username: input.username,
            email: input.email,
            password: input.password,
          },
        });
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          const errorFields = error.meta?.target as string[];
          if (errorFields.includes("email")) {
            throw new TRPCError({
              code: "CONFLICT",
              message: "Email already exists",
            });
          } else if (errorFields.includes("username")) {
            throw new TRPCError({
              code: "CONFLICT",
              message: "Username already exists",
            });
          }
        }
      }
    }),

  followUser: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      // TODO: prevent user from following themselves *done*
      // TODO: prevent user from following the same user twice
      // TODO: prevent user from following a user that doesn't exist
      // TODO: unfollow user if already following

      if (input.id === ctx.session.user.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You can't follow yourself",
        });
      }

      return ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          follower: {
            connect: {
              id: input.id, // id of the user to follow
            },
          },
          followings: {
            connect: {
              id: input.id,
            },
          },
        },
      });
    }),
  // takes in the username of the user to check if the current session user is following
  isFollowing: protectedProcedure
    .input(
      z.object({
        username: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const test = await ctx.prisma.user.findUnique({
        where: {
          username: input.username,
        },
        select: {
          followers: {
            where: {
              id: ctx.session.user.id,
            },
          },
        },
      });

      if (test) {
        // if the current session user is following the user
        for (const follower of test.followers) {
          //! idk why this is throwing an error
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          return follower.id === ctx.session.user.id;
        }
      }

      return false;
    }),
  // gets all users that follow the current session user and the current session user follows
  getFriends: protectedProcedure.query(async ({ ctx }) => {
    const followersAndFollowings = await ctx.prisma.user.findUnique({
      where: { id: ctx.session.user.id },
      select: {
        followers: true,
        followings: true,
      },
    });

    const followers = followersAndFollowings?.followers;
    const followings = followersAndFollowings?.followings;
    const friends: typeof followers = [];

    if (!followers || !followings) return []; // or throw error idk

    for (const follower of followers) {
      for (const following of followings) {
        if (follower.id === following.id) {
          friends.push(follower);
        }
      }
    }

    return friends;
  }),
});
