import React from "react";
import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
  NextPage,
} from "next";
import { api } from "../../utils/api";
import { useRouter } from "next/router";
import defaultPicture from "../../../images/user.png";
import Image from "next/image";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { createTRPCContext } from "../../server/api/trpc";
import { appRouter } from "../../server/api/root";
import superjson from "superjson";
import Post from "../../components/Post";
import { useSession } from "next-auth/react";
import Navbar from "../../components/NavBar";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions(context.req as NextApiRequest, context.res as NextApiResponse)
  );

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createTRPCContext({
      req: context.req as NextApiRequest,
      res: context.res as NextApiResponse,
    }),
    transformer: superjson,
  });

  try {
    await ssg.user.getOne.fetch(context.query);
    await ssg.post.getAllFromUser.prefetch({
      username: context.query.username as string,
    });
  } catch (error) {
    return {
      redirect: {
        // TODO: Either redirect to home or go to 404
        destination: "/404",
        permanent: false,
      },
    };
  }

  return {
    props: {
      trpcState: ssg.dehydrate(),
      session,
    },
  };
}

const Profile: NextPage = () => {
  const router = useRouter();

  const { data: sessionData } = useSession();

  // get user data
  const user = api.user.getOne.useQuery({
    username: router.query.username as string,
  });

  // get all posts from user
  const posts = api.post.getAllFromUser.useQuery({
    username: router.query.username as string,
  });

  return (
    <>
      <Navbar user={sessionData?.user} />
      <div className="min-h-screen  bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-slate-900 via-slate-800 to-zinc-900 dark:text-white">
        <div className="container mx-auto min-h-screen bg-zinc-900 p-6 md:w-2/3">
          <div className="mb-5 flex flex-col justify-center gap-x-5 sm:flex-row sm:justify-start">
            <Image
              alt="profile"
              src={user.data?.image?.replace("s96", "") || defaultPicture.src}
              height={200}
              width={200}
              className="rounded-xl border-4 border-white"
            />
            <div className="flex flex-col justify-center">
              <h1 className="text-4xl font-bold">{user.data?.username}</h1>
              <h2 className="text-center opacity-60">
                {`${user.data?.firstName || ""} ${user.data?.lastName || ""}`}
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-5 ">
            {posts.data?.map((post, index) => (
              <Post
                key={index}
                id={post.id}
                user={post.author}
                session={sessionData}
                title={post.title}
                body={post.body}
                images={post.images}
                likes={post.likesCount}
                dislikes={post.dislikesCount}
                comments={post.commentsCount}
                createdAt={post.createdAt}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
