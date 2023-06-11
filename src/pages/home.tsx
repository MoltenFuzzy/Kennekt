import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import { useSession } from "next-auth/react";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import React, { useEffect } from "react";
import { createTRPCContext } from "../server/api/trpc";
import { appRouter } from "../server/api/root";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import type { RouterOutputs } from "../utils/api";
import { api } from "../utils/api";
import superjson from "superjson";
import useHomePageStore from "../stores/home-page";
import Sidebar from "../components/Sidebar";
import Post from "../components/Post";
import NavBar from "../components/NavBar";

type FullPost = RouterOutputs["post"]["getOneWithAll"];

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
  // await ssg.post.getAll.prefetch();
  await ssg.post.infinitePosts.fetchInfinite({ limit: 5 });

  return {
    props: { trpcState: ssg.dehydrate(), session },
  };
}

export default function Home() {
  const { data: sessionData } = useSession();
  // const { data: allPostData } = api.post.getAll.useQuery(undefined, {
  //   enabled: true,
  // });
  const { data: postsData, fetchNextPage } =
    api.post.infinitePosts.useInfiniteQuery(
      {
        limit: 5,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );

  const {
    posts: currentUserPosts,
    setPosts,
    postsOptimisticUpdateApplied,
  } = useHomePageStore((state) => state);

  useEffect(() => {
    // I want userPosts to be updated with the refetched postsData when the user tabs out of the page
    // the refetched postsData will have the new post from the current user
    if (postsData?.pages) {
      if (!postsOptimisticUpdateApplied) {
        // set the posts to the store, since we are using the store to display the posts
        // const firstPagePosts = postsData?.pages?.[0]?.posts ?? [];
        const allPosts = new Map<string, FullPost>(
          postsData?.pages
            ?.flatMap((page) => page.posts)
            .map((post) => [post.id, post]) ?? []
        );
        setPosts(allPosts);
        // const allPosts = postsData?.pages?.flatMap((page) => page.posts) ?? [];
        // setPosts(firstPagePosts);
      }
    }
    // console.log(postsData?.pages);
    // console.log(postsData?.pages.at(0)?.posts);
  }, [postsData, postsOptimisticUpdateApplied, setPosts]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log(currentUserPosts);
  }, [currentUserPosts]);

  function handleScroll() {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    // const test = (4 / 5) * scrollHeight;
    if (scrollTop + clientHeight >= scrollHeight) {
      // gets last page and checks if the last page has any posts
      // if posts size is 0, then we don't need to fetch next page
      if (postsData?.pages.at(-1)?.posts.length !== 0) {
        void fetchNextPage();
      }
    }
  }

  return (
    <>
      <NavBar user={sessionData?.user} />
      <div className="grid grid-cols-1 lg:grid-cols-8 xl:grid-cols-12">
        <div className="hidden xl:col-span-3 xl:block"></div>
        <div className="lg:col-span-6 xl:col-span-6">
          <div className="container mx-auto mt-2 grid grid-cols-1 gap-y-4 p-3 ">
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
        <div className="lg:col-span-2 xl:col-span-3">
          <Sidebar
            className="fixed top-0 right-0 hidden h-screen flex-col bg-[#202023] text-white lg:flex lg:w-64"
            session={sessionData}
          />
        </div>
      </div>
    </>
  );

  // old code
  // return (
  //   <>
  //     <div className="xs:grid-cols-3 grid grid-cols-1 gap-y-5 sm:grid-cols-3 lg:grid-cols-10 lg:gap-x-0 xl:gap-x-20">
  //       <div className="col-span-3 hidden text-center text-white lg:block "></div>
  //       <div className="col-span-4">
  //         <div className="container mx-auto mt-2 grid grid-cols-1 gap-y-4 p-3 sm:p-0 sm:pt-2">
  //           {/* <PostForm /> */}
  //           {currentUserPosts.map((post, index) => (
  //             <Post
  //               key={index}
  //               postData={post}
  //               session={sessionData}
  //               isClickable
  //             />
  //           ))}
  //         </div>
  //       </div>
  //       <div className="col-span-3 hidden flex-none sm:block">
  //         <Sidebar session={sessionData} />
  //       </div>
  //     </div>
  //   </>
  // );
}
