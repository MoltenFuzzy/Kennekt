import React from "react";
import { signOut } from "next-auth/react";
import type { Session } from "next-auth";

interface SidebarProps {
  session: Session | null;
  className?: string;
}

export default function Sidebar({ session, className }: SidebarProps) {
  return (
    <div className={className}>
      <nav className="mt-14 flex-1 p-4 ">
        <h2 className="text-lg font-medium">Links</h2>
        <ul className="mt-2">
          <li>
            <a href="#" className="block hover:text-blue-600">
              Link 1
            </a>
          </li>
          <li>
            <a href="#" className="block hover:text-blue-600">
              Link 2
            </a>
          </li>
          <li>
            <a href="#" className="block hover:text-blue-600">
              Link 3
            </a>
          </li>
        </ul>
      </nav>
      <div className="flex h-16 items-center justify-center bg-gray-800 text-white">
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

  return (
    <div className="fixed right-0 h-screen flex-col justify-center  bg-[#202023] text-center text-white sm:w-[28%] lg:w-[20%] xl:w-[18%] 2xl:w-[15%]">
      <div>
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
    </div>
  );
}
