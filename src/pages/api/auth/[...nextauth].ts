import NextAuth from "next-auth";
import type { SessionOptions, NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import DiscordProvider from "next-auth/providers/discord";
import GoogleProvider from "next-auth/providers/google";

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../server/db";
import { env } from "../../../env/server.mjs";
import type { NextApiRequest, NextApiResponse } from "next";
import { randomUUID } from "crypto";
import Cookies from "cookies";
import { decode, encode } from "next-auth/jwt";
import argon2id from "argon2";

const session: Partial<SessionOptions> = {
  strategy: "database",
  maxAge: 30 * 24 * 60 * 60, // 30 days
  updateAge: 24 * 60 * 60, // 24 hours
};

export const authOptions = (
  req: NextApiRequest,
  res: NextApiResponse
): NextAuthOptions => {
  const generateSessionToken = () => randomUUID();

  const fromDate = (time: number, date = Date.now()) =>
    new Date(date + time * 1000);

  const adapter = PrismaAdapter(prisma);

  return {
    adapter: adapter,
    callbacks: {
      session({ session, user }) {
        if (session.user) {
          session.user.id = user.id;
          session.user.username = user.username;
        }
        return session;
      },
      async signIn({ user }) {
        // Check if this sign in callback is being called in the credentials authentication flow. If so, use the next-auth adapter to create a session entry in the database (SignIn is called after authorize so we can safely assume the user is valid and already authenticated).
        if (
          req.query.nextauth?.includes("callback") &&
          req.query.nextauth?.includes("credentials") &&
          req.method === "POST"
        ) {
          if (user) {
            const sessionToken = generateSessionToken();
            const sessionMaxAge = 60 * 60 * 24 * 30; //30Daysconst sessionMaxAge = 60 * 60 * 24 * 30; //30Days
            const sessionExpiry = fromDate(sessionMaxAge);

            await adapter.createSession({
              sessionToken: sessionToken,
              userId: user.id,
              expires: sessionExpiry,
            });

            // TODO: causes error when logging in with credentials
            // await adapter.linkAccount({
            //   userId: user.id,
            //   type: "oauth",
            //   provider: "credentials",
            //   providerAccountId: "",
            // });

            const cookies = new Cookies(req, res);

            cookies.set("next-auth.session-token", sessionToken, {
              expires: sessionExpiry,
            });
          }
        }

        return true;
      },
    },
    jwt: {
      encode: async ({ token, secret, maxAge }) => {
        if (
          req.query.nextauth?.includes("callback") &&
          req.query.nextauth.includes("credentials") &&
          req.method === "POST"
        ) {
          const cookies = new Cookies(req, res);
          const cookie = cookies.get("next-auth.session-token");
          if (cookie) return cookie;
          else return "";
        }
        // Revert to default behaviour when not in the credentials provider callback flow
        return encode({ token, secret, maxAge });
      },
      decode: async ({ token, secret }) => {
        if (
          req.query.nextauth?.includes("callback") &&
          req.query.nextauth.includes("credentials") &&
          req.method === "POST"
        ) {
          return null;
        }

        // Revert to default behaviour when not in the credentials provider callback flow
        return decode({ token, secret });
      },
    },

    // Configure one or more authentication providers
    secret: env.NEXTAUTH_SECRET,
    debug: true,
    providers: [
      CredentialsProvider({
        name: "CredentialsProvider",
        credentials: {
          username: { label: "Username", type: "text" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          console.log(credentials);

          // verifying if credential email exists on db
          const user = await prisma.user.findUnique({
            where: {
              username: credentials?.username,
            },
          });

          if (!user) return null;

          if (user.password === null) return null;

          const valid = await argon2id.verify(
            user?.password,
            credentials?.password as string
          );

          if (!valid) return null;

          // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any
          return user as any;
        },
      }),
      DiscordProvider({
        clientId: env.DISCORD_CLIENT_ID,
        clientSecret: env.DISCORD_CLIENT_SECRET,
        allowDangerousEmailAccountLinking: true,
      }),
      GoogleProvider({
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        allowDangerousEmailAccountLinking: true,
      }),
    ],
    pages: { signIn: "/login" },
    session,
  };
};

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  // Do whatever you want here, before the request is passed down to `NextAuth`
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return await NextAuth(req, res, authOptions(req, res));
}
