import React from "react";
import type { NextPage } from "next";
import { api } from "../../utils/api";
import { useRouter } from "next/router";
import { json } from "stream/consumers";

const Profile: NextPage = () => {
  const router = useRouter();
  const user = api.user.getOne.useQuery({
    username: router.query.username as string,
  });
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-slate-900 via-slate-800 to-zinc-900">
      <div className="break-all text-white">{JSON.stringify(user.data)}</div>
    </div>
  );
};

export default Profile;
