import React from "react";
import UsernameModal from "../../components/UsernameModal";
import NavBar from "../../components/NavBar";
import Post from "../../components/Post";
import Sidebar from "../../components/Sidebar";
import Comment from "../../components/Comment";
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
import CommentForm from "../../components/CommentForm";
import { TbSquareRoundedArrowLeftFilled } from "react-icons/tb";
import { useRouter } from "next/router";
import CommentSection from "../../components/CommentSection";

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
  await ssg.comment.getAllFromPost.prefetch({ postId });

  return {
    props: { trpcState: ssg.dehydrate(), session, postId },
  };
}

export default function PostPage(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { postId } = props;
  const { data: sessionData } = useSession();
  const router = useRouter();

  const {
    data: postData,
    isError,
    error,
  } = api.post.getOne.useQuery({ id: postId }, { enabled: true });

  // const { data: postComments } = api.comment.getAllFromPost.useQuery(
  //   { postId },
  //   { enabled: true }
  // );

  // TODO: Add better error handling
  if (isError || !postData) {
    return (
      <span className="text-center text-white">Error: {error?.message}</span>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-8 xl:grid-cols-12">
        <div className="hidden xl:col-span-3 xl:block"></div>
        <div className="lg:col-span-6 xl:col-span-6">
          <div className="container mx-auto mt-2 grid grid-cols-1 gap-y-4 p-3 ">
            <div className="flex justify-start">
              <button className="">
                <TbSquareRoundedArrowLeftFilled
                  color="#255bcf"
                  size={25}
                  onClick={() => {
                    router.back();
                  }}
                />
              </button>
            </div>
            <Post postData={postData} session={sessionData} />
            {/* <CommentForm postId={postData.id} /> */}
            {/* {postComments?.map((data) => (
              <Comment key={data.id} commentData={data} />
            ))} */}
            <CommentSection postId={postData.id} />
          </div>
        </div>
        <div className="lg:col-span-2 xl:col-span-3">
          <Sidebar
            className="fixed top-0 right-0 hidden h-screen flex-col bg-[#202023] text-white lg:flex lg:w-64"
            session={sessionData}
          />
        </div>
      </div>
    </>
  );
}
