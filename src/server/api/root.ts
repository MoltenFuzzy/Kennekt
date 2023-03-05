import { createTRPCRouter } from "./trpc";
import { userRouter } from "./routers/user";
import { postRouter } from "./routers/post";
import { accountRouter } from "./routers/account";
import { imageRouter } from "./routers/image";
import { commentRouter } from "./routers/comment";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  post: postRouter,
  comment: commentRouter,
  account: accountRouter,
  image: imageRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
