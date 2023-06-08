import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import { type NextPage } from "next";
import Head from "next/head";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import Image from "next/image";

const Landing: NextPage = () => {
  return (
    <>
      <Head>
        <title>Kennekt</title>
        <meta name="description" content="Kennekt with comrades" />
        <link rel="icon" href={"/logo.png"} />
      </Head>
      <main>
        <div className="flex min-h-screen flex-col items-center py-16 text-white">
          <div className="mx-auto mt-8 flex max-w-6xl flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
            <p className="mb-8 text-center text-2xl">Welcome to Kennekt </p>
            {/* <a className="inline-block rounded bg-blue-500 py-4 px-8 font-bold text-white hover:bg-blue-700">
              Get Started
            </a> */}
          </div>
        </div>
      </main>
    </>
  );
};

export default Landing;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions(context.req as NextApiRequest, context.res as NextApiResponse)
  );

  if (session) {
    return {
      redirect: {
        destination: "/home",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}
