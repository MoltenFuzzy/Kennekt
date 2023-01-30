import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const accountRouter = createTRPCRouter({
  createOne: publicProcedure.mutation(({ ctx }) => {
    // TODO: fill in the rest of the fields later with the auth flow
    return ctx.prisma.account.create({
      data: {
        userId: "123",
        type: "oauth",
        provider: "credentials",
        providerAccountId: null,
        refresh_token: null,
        access_token: null,
        expires_at: null,
        token_type: null,
        scope: null,
        id_token: null,
        session_state: null,
      },
    });
  }),
});
