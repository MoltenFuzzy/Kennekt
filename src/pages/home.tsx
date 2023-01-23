import type { GetServerSidePropsContext, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "../utils/api";
import NavBar from "../components/NavBar";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import Modal from "../components/Model";
import { useForm } from "react-hook-form";
import PostForm from "../components/PostForm";
import Post from "../components/Post";
import React from "react";

const Home: NextPage = () => {
  const { data: sessionData } = useSession();
  // TODO: add custom hook to ensure user has a username
  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  const posts = api.post.getAll.useQuery();

  React.useEffect(() => {
    console.log(sessionData?.user);
  });

  return (
    <div className="min-h-screen bg-[#1C222D]">
      <NavBar user={sessionData?.user} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Modal title={"Test"} />
        <div></div>
        <div className="container mx-auto ">
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
              likes={0}
              comments={0}
            />
          ))}

          {sessionData && (
            <button
              onClick={() => {
                if (sessionData) {
                  void signOut({ callbackUrl: `${window.location.origin}` });
                }
              }}
              type="button"
              className="w-full rounded-lg bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gradient-to-br focus:outline-none focus:ring-4 focus:ring-teal-300 dark:focus:ring-teal-800"
            >
              Sign Out
            </button>
          )}
        </div>
        <div></div>
      </div>
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
