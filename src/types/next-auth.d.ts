import { type DefaultSession, type Account } from "next-auth";
import type { User as UserModel } from "@prisma/client";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */

  //   export interface DefaultSession {
  //     user?: {
  //         name?: string | null;
  //         email?: string | null;
  //         image?: string | null;
  //     };
  //     expires: ISODateString;
  // }

  //! PROPERTIES I WANT TO SAVE TO SESSION
  interface Session {
    user?: {
      id: string;
      username: string;
    } & DefaultSession["user"];
  }

  interface User extends UserModel {
    username: string;
  }
}
