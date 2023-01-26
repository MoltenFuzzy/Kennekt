import NextAuth, { SessionOptions, type NextAuthOptions } from "next-auth";
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

// export function requestWrapper(
//   req: NextApiRequest,
//   res: NextApiResponse
// ): [req: NextApiRequest, res: NextApiResponse, opts: NextAuthOptions] {
//   const generateSessionToken = () => randomUUID();

//   const fromDate = (time: number, date = Date.now()) =>
//     new Date(date + time * 1000);

//   const adapter = PrismaAdapter(prisma);

//   const opts: NextAuthOptions = {
//     // Include user.id on session
//     adapter: adapter,
//     callbacks: {
//       session({ session, user }) {
//         if (session.user) {
//           session.user.id = user.id;
//           session.user.username = user.username;
//         }
//         return session;
//       },
//       async signIn({ user }) {
//         // Check if this sign in callback is being called in the credentials authentication flow. If so, use the next-auth adapter to create a session entry in the database (SignIn is called after authorize so we can safely assume the user is valid and already authenticated).
//         if (
//           req.query.nextauth?.includes("callback") &&
//           req.query.nextauth?.includes("credentials") &&
//           req.method === "POST"
//         ) {
//           if (user) {
//             const sessionToken = generateSessionToken();
//             const sessionMaxAge = 60 * 60 * 24 * 30; //30Daysconst sessionMaxAge = 60 * 60 * 24 * 30; //30Days
//             const sessionExpiry = fromDate(sessionMaxAge);

//             await adapter.createSession({
//               sessionToken: sessionToken,
//               userId: user.id,
//               expires: sessionExpiry,
//             });

//             const cookies = new Cookies(req, res);

//             cookies.set("next-auth.session-token", sessionToken, {
//               expires: sessionExpiry,
//             });
//           }
//         }

//         return true;
//       },
//     },
//     jwt: {
//       encode: async ({ token, secret, maxAge }) => {
//         if (
//           req.query.nextauth?.includes("callback") &&
//           req.query.nextauth.includes("credentials") &&
//           req.method === "POST"
//         ) {
//           const cookies = new Cookies(req, res);
//           const cookie = cookies.get("next-auth.session-token");
//           if (cookie) return cookie;
//           else return "";
//         }
//         // Revert to default behaviour when not in the credentials provider callback flow
//         return encode({ token, secret, maxAge });
//       },
//       decode: async ({ token, secret }) => {
//         if (
//           req.query.nextauth?.includes("callback") &&
//           req.query.nextauth.includes("credentials") &&
//           req.method === "POST"
//         ) {
//           return null;
//         }

//         // Revert to default behaviour when not in the credentials provider callback flow
//         return decode({ token, secret });
//       },
//     },
//     // Configure one or more authentication providers
//     secret: env.NEXTAUTH_SECRET,
//     debug: true,
//     providers: [
//       CredentialsProvider({
//         name: "CredentialsProvider",
//         credentials: {
//           email: { label: "Email", type: "text", placeholder: "jsmith" },
//           password: { label: "Password", type: "password" },
//         },
//         async authorize(credentials) {
//           console.log(credentials);

//           // verifying if credential email exists on db
//           const user = await prisma.user.findUnique({
//             where: {
//               email: credentials?.email,
//             },
//           });

//           if (!user) return null;

//           if (user.password === null) return null;

//           if (user.password !== credentials?.password) return null;

//           // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any
//           return user as any;
//         },
//       }),
//       DiscordProvider({
//         clientId: env.DISCORD_CLIENT_ID,
//         clientSecret: env.DISCORD_CLIENT_SECRET,
//         allowDangerousEmailAccountLinking: true,
//       }),
//       GoogleProvider({
//         clientId: env.GOOGLE_CLIENT_ID,
//         clientSecret: env.GOOGLE_CLIENT_SECRET,
//         allowDangerousEmailAccountLinking: true,
//       }),
//     ],
//   };

//   return [req, res, opts];
// }

// import NextAuth, { type NextAuthOptions } from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import DiscordProvider from "next-auth/providers/discord";
// import GoogleProvider from "next-auth/providers/google";
// // Prisma adapter for NextAuth, optional and can be removed
// import { PrismaAdapter } from "@next-auth/prisma-adapter";

// import { env } from "../../../env/server.mjs";
// import { prisma } from "../../../server/db";
// import argon2id from "argon2";

// export const authOptions: NextAuthOptions = {
//   // Include user.id on session
//   callbacks: {
//     session({ session, user }) {
//       if (session.user) {
//         session.user.id = user.id;
//         session.user.username = user.username;
//       }
//       return session;
//     },
//   },
//   pages: { signIn: "/login" },
//   // Configure one or more authentication providers
//   adapter: PrismaAdapter(prisma),
//   providers: [
//     CredentialsProvider({
//       // The name to display on the sign in form (e.g. 'Sign in with...')
//       name: "Kennekt",
//       // The credentials is used to generate a suitable form on the sign in page.
//       // You can specify whatever fields you are expecting to be submitted.
//       // e.g. domain, username, password, 2FA token, etc.
//       // You can pass any HTML attribute to the <input> tag through the object.
//       credentials: {
//         username: { label: "Username", type: "text" },
//         email: { label: "Email", type: "text" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         const user = await prisma.user.findFirst({
//           where: {
//             OR: [
//               { email: credentials?.email },
//               { username: credentials?.username },
//             ],
//           },
//         });

//         if (!user) return null;

//         // TODO: make sure we are only authorizing users that use a password
//         const valid = await argon2id.verify(
//           user?.password as string,
//           credentials?.password as string
//         );

//         console.log(valid);

//         if (valid) {
//           console.log(user);
//           // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any
//           return user as any;
//         }

//         console.log("Invalid credentials");
//         // Return null if user data could not be retrieved
//         return null;
//       },
//     }),
//     DiscordProvider({
//       clientId: env.DISCORD_CLIENT_ID,
//       clientSecret: env.DISCORD_CLIENT_SECRET,
//       allowDangerousEmailAccountLinking: true,
//     }),
//     GoogleProvider({
//       clientId: env.GOOGLE_CLIENT_ID,
//       clientSecret: env.GOOGLE_CLIENT_SECRET,
//       allowDangerousEmailAccountLinking: true,
//     }),
//   ],
// };

// export default NextAuth(authOptions);
