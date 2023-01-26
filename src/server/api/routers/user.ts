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
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.user.findUnique({
        where: {
          id: input.id,
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

  followUser: protectedProcedure.mutation(({ ctx }) => {
    return "";
  }),
});
