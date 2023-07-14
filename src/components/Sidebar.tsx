import React from "react";
import { signOut } from "next-auth/react";
import type { Session } from "next-auth";
import Link from "next/link";
import Image from "next/image";
import type { RouterOutputs } from "../utils/api";

interface SidebarProps {
  session: Session | null;
  friends?: RouterOutputs["user"]["getFriends"];
  className?: string;
}

interface FriendProps {
  user: RouterOutputs["user"]["getFriends"][0];
}

function Friend({ user }: FriendProps) {
  return (
    <Link href={`/user/${user.username as string}`}>
      <div className="text-md flex items-center gap-x-3 p-3 font-mono font-medium hover:border hover:border-slate-600 ">
        <Image
          alt="profile"
          className="rounded-2xl"
          src={user.image || "/user.png"}
          height={30}
          width={30}
        />
        <span className="">{user.username}</span>
        <span className="text-xs text-gray-400">({user.name})</span>
      </div>
    </Link>
  );
}

export default function Sidebar({ session, className, friends }: SidebarProps) {
  return (
    <div className={className}>
      <h2 className="mt-20 text-center font-mono text-xl font-medium ">
        Friends
      </h2>
      <nav className="overflow-auto">
        <ul className="mt-2">
          {friends?.map((friend) => (
            <li key={friend.id}>
              <Friend user={friend} />
            </li>
          ))}
        </ul>
      </nav>
      <div className="flex h-16 items-center justify-center text-white">
        {session && (
          <button
            onClick={() => {
              if (session) {
                void signOut({
                  callbackUrl: `${window.location.origin}`,
                });
              }
            }}
            type="button"
            className="transform rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white transition duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2"
          >
            Sign Out
          </button>
        )}
      </div>
    </div>
  );
}
