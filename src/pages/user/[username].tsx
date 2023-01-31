import React, { useEffect } from "react";
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
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { createTRPCContext } from "../../server/api/trpc";
import { appRouter } from "../../server/api/root";
import superjson from "superjson";

const Profile: NextPage = () => {
  const router = useRouter();
  const user = api.user.getOne.useQuery(
    {
      username: router.query.username as string,
    },
    {
      onError() {
        console.log("error");
      },
    }
  );

  // useEffect(() => {
  //   console.log(user.data?.image);
  //   const test = user.data?.image?.replace("s96", "");
  //   console.log(test);
  // });

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-slate-900 via-slate-800 to-zinc-900">
      <div className="h-screen bg-black p-6 sm:container sm:mx-auto">
        <div className="flex justify-start">
          <Image
            alt="profile"
            src={user.data?.image?.replace("s96", "") || defaultPicture.src}
            height={200}
            width={200}
            className=" mt-10 rounded-full border-4 border-red-900"
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;

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
    props: { session },
  };
}
