import React from "react";
import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
  NextPage,
} from "next";
import { RouterOutputs, api } from "../../utils/api";
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
import NavBar from "../../components/NavBar";
import useHomePageStore from "../../stores/home-page";

type FullPost = RouterOutputs["post"]["getAllFromUser"][0];

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
    const username = context.query.username as string;
    await ssg.user.getOne.fetch(context.query);
    await ssg.post.getAllFromUser.prefetch({ username });
    await ssg.user.isFollowing.prefetch({ username });
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

  const {
    posts: currentUserPosts,
    setPosts,
    postsOptimisticUpdateApplied,
  } = useHomePageStore((state) => state);

  // get user data
  const user = api.user.getOne.useQuery({
    username: router.query.username as string,
  });

  // get all posts from user
  const posts = api.post.getAllFromUser.useQuery({
    username: router.query.username as string,
  });

  const { data: isFollowingUser } = api.user.isFollowing.useQuery({
    username: router.query.username as string,
  });

  const { mutate: followUser } = api.user.followUser.useMutation();

  const [isFollowing, setIsFollowing] = React.useState(isFollowingUser);

  React.useEffect(() => {
    if (!postsOptimisticUpdateApplied) {
      const allPosts = posts.data?.reduce(
        (map, post) => map.set(post.id, post),
        new Map<string, FullPost>()
      );

      if (allPosts) {
        setPosts(allPosts);
      }
    }
  }, [posts.data, postsOptimisticUpdateApplied, setPosts]);

  React.useEffect(() => {
    if (!isFollowingUser) return;
    setIsFollowing(isFollowingUser);
  }, [isFollowing, isFollowingUser]);

  return (
    <>
      <NavBar user={sessionData?.user} />
      <div className="min-h-screen  bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-slate-900 via-slate-800 to-zinc-900 dark:text-white">
        <div className="container mx-auto min-h-screen bg-zinc-900 p-6 md:w-3/4">
          <div className="grid grid-cols-7 gap-x-5">
            <div className="col-span-3">
              <div className="sticky top-20">
                <div className="mb-5 flex flex-col items-center justify-center gap-x-5 xl:flex-row xl:justify-start">
                  <Image
                    alt="profile"
                    src={
                      user.data?.image?.replace("s96", "") || defaultPicture.src
                    }
                    height={200}
                    width={200}
                    className="rounded-xl border-4 border-white"
                  />
                  <div className="flex flex-col justify-center text-center">
                    <h1 className="text-3xl font-bold">
                      {user.data?.username}
                    </h1>
                    <h2 className="opacity-60">
                      {/* TODO: if no name use first name and last name  */}(
                      {user.data?.name ?? "null"})
                    </h2>
                  </div>
                </div>
                <div className="rounded-xl bg-zinc-800">
                  <div className="flex flex-col p-4">
                    <div className="mb-4">
                      <div className="mb-4 font-mono text-2xl font-bold">
                        About
                      </div>
                      <p>
                        Lorem ipsum dolor, sit amet consectetur adipisicing
                        elit. Quasi ab, cumque cum nemo neque praesentium
                        aspernatur commodi dignissimos asperiores facere nisi
                        nobis sit at et accusantium corrupti doloremque odit
                        harum!
                      </p>
                    </div>
                    {user.data?.id !== sessionData?.user?.id && (
                      <button
                        type="button"
                        className="rounded-md bg-zinc-900 px-4 py-2 text-white hover:bg-black"
                        onClick={() => {
                          followUser({
                            id: user.data?.id as string,
                          });
                        }}
                      >
                        {isFollowing ? "Unfollow" : "Follow"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-4 flex flex-col gap-y-5">
              {[...currentUserPosts.values()].map((post, index) => (
                <Post
                  key={index}
                  postData={post}
                  session={sessionData}
                  isClickable
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
