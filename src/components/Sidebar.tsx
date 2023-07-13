import React from "react";
import { signOut } from "next-auth/react";
import type { Session } from "next-auth";
import Link from "next/link";
import Image from "next/image";

interface SidebarProps {
  session: Session | null;
  className?: string;
}

function Follower({ session }: SidebarProps) {
  return (
    <Link href={"/username"}>
      <div className="flex items-center gap-x-3 text-lg font-medium hover:border-2 hover:border-blue-200">
        <Image
          alt="profile"
          className="rounded-2xl"
          src={session?.user?.image || ""}
          height={30}
          width={30}
        />
        <span className="">Test</span>
      </div>
    </Link>
  );
}

export default function Sidebar({ session, className }: SidebarProps) {
  return (
    <div className={className}>
      <h2 className="mt-16 text-center text-lg font-medium">Followers</h2>
      <nav className=" overflow-auto">
        <ul className="mt-2">
          <li className="mb-4">
            <Follower session={session} />
          </li>
          <li className="mb-4">
            <Follower session={session} />
          </li>
          <li className="mb-4">
            <Follower session={session} />
          </li>{" "}
          <li className="mb-4">
            <Follower session={session} />
          </li>
          <li className="mb-4">
            <Follower session={session} />
          </li>
          <li className="mb-4">
            <Follower session={session} />
          </li>{" "}
          <li className="mb-4">
            <Follower session={session} />
          </li>
          <li className="mb-4">
            <Follower session={session} />
          </li>
          <li className="mb-4">
            <Follower session={session} />
          </li>
          <li className="mb-4">
            <Follower session={session} />
          </li>
          <li className="mb-4">
            <Follower session={session} />
          </li>
          <li className="mb-4">
            <Follower session={session} />
          </li>{" "}
          <li className="mb-4">
            <Follower session={session} />
          </li>
          <li className="mb-4">
            <Follower session={session} />
          </li>
          <li className="mb-4">
            <Follower session={session} />
          </li>
          <li className="mb-4">
            <Follower session={session} />
          </li>
          <li className="mb-4">
            <Follower session={session} />
          </li>
          <li className="mb-4">
            <Follower session={session} />
          </li>
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
            className="transform rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white transition duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2"
          >
            Sign Out
          </button>
        )}
      </div>
    </div>
  );
}
