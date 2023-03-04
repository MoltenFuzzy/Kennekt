import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import { useSession } from "next-auth/react";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import NavBar from "../components/NavBar";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import Modal from "../components/Modal";
import PostForm from "../components/PostForm";
import React, { useEffect } from "react";
import { createTRPCContext } from "../server/api/trpc";
import { appRouter } from "../server/api/root";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { api } from "../utils/api";
import superjson from "superjson";
import useAppStore from "../stores/app";
import Sidebar from "../components/Sidebar";
import Post from "../components/Post";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions(context.req as NextApiRequest, context.res as NextApiResponse)
  );

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const opts: CreateNextContextOptions = {
    req: context.req as NextApiRequest,
    res: context.res as NextApiResponse,
  };

  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createTRPCContext(opts),
    transformer: superjson,
  });

  // const id = context.params?.id as string;
  /*
   * Prefetching the `post.byId` query here.
   * `prefetch` does not return the result and never throws - if you need that behavior, use `fetch` instead.
   */
  // await ssg.post.byId.prefetch({ id });
  await ssg.post.getAll.prefetch();

  return {
    props: { trpcState: ssg.dehydrate(), session },
  };
}

export default function Home() {
  const { data: sessionData } = useSession();
  const { data: postsData } = api.post.getAll.useQuery(undefined, {
    enabled: true,
  });
  const {
    posts: userPosts,
    setPosts,
    postsOptimisticUpdateApplied,
  } = useAppStore((state) => state);

  useEffect(() => {
    // I want userPosts to be updated with the refetched postsData when the user tabs out of the page
    // the refetched postsData will have the new post from the current user
    if (postsData) {
      if (!postsOptimisticUpdateApplied) {
        // set the posts to the store, since we are using the store to display the posts
        setPosts(postsData);
      }
    }
  }, [postsData, postsOptimisticUpdateApplied, setPosts]);

  return (
    <>
      <NavBar user={sessionData?.user} />
      <div className="min-h-screen">
        <div className="xs:grid-cols-3 grid grid-cols-1 gap-y-5 sm:grid-cols-3 lg:grid-cols-10 lg:gap-x-0 xl:gap-x-20">
          {sessionData?.user?.username ? null : (
            <Modal title={"Setup Profile"} />
          )}
          <div className="col-span-3 hidden text-center text-white lg:block "></div>
          <div className="col-span-4">
            <div className="container mx-auto mt-2 grid grid-cols-1 gap-y-4 p-6 sm:p-0 sm:pt-2">
              <PostForm />
              {userPosts.map((post, index) => (
                <Post
                  key={index}
                  id={post.id}
                  user={post.author}
                  session={sessionData}
                  title={post.title}
                  images={post.images}
                  body={post.body}
                  likes={post.likesCount}
                  comments={0}
                />
              ))}
            </div>
          </div>
          <div className="col-span-3 hidden flex-none sm:block">
            <Sidebar session={sessionData} />
          </div>
        </div>
      </div>
    </>
  );
}
