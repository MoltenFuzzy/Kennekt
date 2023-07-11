import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import { type NextPage } from "next";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import NavBar from "../components/NavBar";
import { useSession } from "next-auth/react";

const Landing: NextPage = () => {
  const { data: session } = useSession();

  return (
    <>
      <NavBar user={session?.user} />
      <Head>
        <title>Kennekt</title>
        <meta name="description" content="Kennekt with comrades" />
        <link rel="icon" href={"/logo.png"} />
      </Head>
      <main className="flex min-h-screen flex-col items-center gap-20 font-mono text-white">
        <section className="mt-32 mb-20 flex h-72 flex-col items-center justify-center gap-y-4">
          <h1 className="text-center text-3xl">Make new friends</h1>
          <h1 className="text-center text-3xl">Share your thoughts</h1>
          <h1 className="text-center text-7xl font-medium">
            <span className="font-bold text-blue-500">Kennekt</span> with people
          </h1>
          <Link href="/login">
            <button className="animate__animated mt-5 animate-pulse rounded-3xl bg-emerald-700 px-5 py-3 text-xl hover:bg-emerald-500">
              Get Started
            </button>
          </Link>
        </section>
        <section className="grid w-full place-items-center gap-y-20 bg-slate-900 p-10 sm:p-16 lg:grid-cols-2 lg:py-28 lg:px-14">
          <p className="text-center text-4xl lg:w-2/3">
            Kennekt is a platform for connections at the deepest level.
          </p>
          <div className="min-w-96 relative aspect-video w-full lg:max-w-[1000px]">
            <Image
              className="justify-self-end border-4 border-zinc-700"
              alt="app preview"
              src="https://cdn.discordapp.com/attachments/941208408672067624/1128092285788246026/image.png"
              fill
            />
          </div>
        </section>
        <footer className="min-w-full p-4 text-white">
          <div className="container mx-auto">
            <div className="flex items-center justify-center">
              <p className="text-sm">
                &copy; 2023 Kennekt by MoltenFuzzy LLC. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
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
