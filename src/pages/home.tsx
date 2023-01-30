import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
  NextPage,
} from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import NavBar from "../components/NavBar";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import Modal from "../components/Modal";
import PostForm from "../components/PostForm";
import Post from "../components/Post";
import React from "react";
import type { Session } from "next-auth";
import type { User } from "@prisma/client";
import { createTRPCContext } from "../server/api/trpc";
import { appRouter } from "../server/api/root";
import superjson from "superjson";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { api } from "../utils/api";

const Home: NextPage = () => {
  const { data: sessionData } = useSession();
  // const { data: secretMessage } = api.example.getSecretMessage.useQuery(
  //   undefined, // no input
  //   { enabled: sessionData?.user !== undefined }
  // );

  const posts = api.post.getAll.useQuery();

  // React.useEffect(() => {
  //   console.log(pageProps);
  // });

  return (
    <>
      <NavBar user={sessionData?.user} />
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-slate-900 via-slate-800 to-zinc-900">
        <div className="grid grid-cols-1 gap-y-5 lg:grid-cols-4 lg:gap-60">
          {sessionData?.user?.username ? null : (
            <Modal title={"Setup Profile"} />
          )}
          <div className="col-span-1 text-center text-white ">Empty Column</div>
          <div className="col-span-2">
            <div className="container mx-auto mt-2 grid grid-cols-1 gap-y-6 p-6">
              {/* <p className="text-center text-2xl text-white">
            {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
            {secretMessage && <span> - {secretMessage}</span>}
          </p> */}
              <PostForm />
              {posts.data?.map((post, index) => (
                <Post
                  key={index}
                  id={post.id}
                  user={post.author}
                  title={post.title}
                  body={post.body}
                  likes={post.likesCount}
                  comments={0}
                />
              ))}
            </div>
          </div>
          <div className="col-span-1 ">
            <div className="h-screen bg-black text-center text-white">
              {sessionData && (
                <button
                  onClick={() => {
                    if (sessionData) {
                      void signOut({
                        callbackUrl: `${window.location.origin}`,
                      });
                    }
                  }}
                  type="button"
                  className="w-full rounded-lg bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gradient-to-br focus:outline-none focus:ring-4 focus:ring-teal-300 dark:focus:ring-teal-800"
                >
                  Sign Out
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;

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

  const test: CreateNextContextOptions = {
    req: context.req as NextApiRequest,
    res: context.res as NextApiResponse,
  };

  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createTRPCContext(test),
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
