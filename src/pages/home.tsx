import { GetServerSidePropsContext, type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "../utils/api";
import NavBar from "../components/NavBar";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";

const Home: NextPage = () => {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  const utils = api.useContext();
  const hello = api.example.hello.useQuery({ text: "from tRPC" });
  const examples = api.example.getAll.useQuery();
  const test = api.example.createOne.useMutation({
    onSuccess() {
      void utils.example.getAll.invalidate();
    },
  });

  return (
    <div className="min-h-screen bg-[#1C222D]">
      <NavBar user={sessionData?.user} />
      {sessionData && (
        <button
          onClick={
            sessionData
              ? () => void signOut({ callbackUrl: `${window.location.origin}` })
              : () => void 0
          }
          type="button"
          className="w-full rounded-lg bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gradient-to-br focus:outline-none focus:ring-4 focus:ring-teal-300 dark:focus:ring-teal-800"
        >
          Sign Out
        </button>
      )}
    </div>
  );
};

export default Home;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}
