import type { NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";

const SignInPage: NextPage = () => {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (!(status === "loading") && !session) void signIn("google");
    if (session) window.close();
  }, [session, status]);

  return (
    <div className="absolute top-0 left-0 h-screen w-screen bg-white dark:bg-zinc-900"></div>
  );
};

export default SignInPage;
