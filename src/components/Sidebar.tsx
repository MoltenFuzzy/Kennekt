import React from "react";
import { signOut } from "next-auth/react";
import type { Session } from "next-auth";

interface SidebarProps {
  session: Session | null;
}

export default function Sidebar({ session }: SidebarProps) {
  return (
    <div className="fixed right-0 flex h-screen justify-center  bg-[#202023] text-center text-white sm:w-[28%] lg:w-[20%] xl:w-[18%] 2xl:w-[15%]">
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
          className="mt-10 h-10 rounded-lg bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gradient-to-br focus:outline-none focus:ring-4 focus:ring-teal-300 dark:focus:ring-teal-800"
        >
          Sign Out
        </button>
      )}
    </div>
  );
}
