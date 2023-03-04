import React, { useEffect } from "react";
import Modal from "../../components/Modal";
import NavBar from "../../components/NavBar";
import Post from "../../components/Post";
import Sidebar from "../../components/Sidebar";
import { useSession } from "next-auth/react";

import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextApiRequest,
  NextApiResponse,
} from "next";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { unstable_getServerSession } from "next-auth";
import { appRouter } from "../../server/api/root";
import { createTRPCContext } from "../../server/api/trpc";
import { authOptions } from "../api/auth/[...nextauth]";
import superjson from "superjson";
import { api } from "../../utils/api";
import { User } from "@prisma/client";

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

  const postId = context.params?.postId as string;
  /*
   * Prefetching the `post.byId` query here.
   * `prefetch` does not return the result and never throws - if you need that behavior, use `fetch` instead.
   */
  await ssg.post.getOne.prefetch({ id: postId });
  // await ssg.post.getAll.prefetch();

  return {
    props: { trpcState: ssg.dehydrate(), session, postId },
  };
}

export default function PostPage(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { postId } = props;
  const { data: sessionData } = useSession();

  const { data: postData } = api.post.getOne.useQuery(
    { id: postId },
    { enabled: true }
  );

  useEffect(() => {
    console.log(postData);
  });

  return (
    <>
      <NavBar user={sessionData?.user} />
      <div className="min-h-screen  bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-slate-900 via-slate-800 to-zinc-900">
        <div className="xs:grid-cols-3 grid grid-cols-1 gap-y-5 sm:grid-cols-3 lg:grid-cols-7 lg:gap-x-0 xl:gap-x-20">
          {sessionData?.user?.username ? null : (
            <Modal title={"Setup Profile"} />
          )}
          <div className="col-span-2 hidden text-center text-white lg:block "></div>
          <div className="col-span-3">
            <div className="container mx-auto mt-2 grid grid-cols-1 gap-y-4 p-6 sm:p-0 sm:pt-2">
              {/* TODO: maybe passing a lot of props isnt good, maybe use ...postData? */}
              <Post
                id={postData?.id || ""}
                user={postData?.author as User}
                session={sessionData}
                title={postData?.title || ""}
                body={postData?.body || ""}
                images={postData?.images || []}
                likes={postData?.likesCount || 0}
                comments={0}
                isOnClick={false}
              />
            </div>
          </div>
          <div className="col-span-2 hidden flex-none sm:block">
            <Sidebar session={sessionData} />
          </div>
        </div>
      </div>
    </>
  );
}
