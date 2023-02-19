import { createTRPCRouter } from "./trpc";
import { exampleRouter } from "./routers/example";
import { userRouter } from "./routers/user";
import { postRouter } from "./routers/post";
import { accountRouter } from "./routers/account";
import { imageRouter } from "./routers/image";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  user: userRouter,
  post: postRouter,
  account: accountRouter,
  image: imageRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
