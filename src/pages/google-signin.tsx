import type { GetServerSidePropsContext, NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";

const SignInPage: NextPage = () => {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (!(status === "loading") && !session) void signIn("google");
    if (session) window.close();
  }, [session, status]);

  return <div className="absolute left-0 top-0 h-screen w-screen"></div>;
};

export default SignInPage;
