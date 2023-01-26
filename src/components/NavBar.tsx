import { useState } from "react";
import Image from "next/image";
import logo from "../../images/logo.png";
import Link from "next/link";
import type { Session } from "next-auth";
import HamburgerMenu from "./Hamburger";
import { useSession } from "next-auth/react";

export interface NavBarProps {
  user?: Session["user"];
}

function NavBar({ user }: NavBarProps) {
  const { data: sessionData } = useSession();

  if (!sessionData) {
    return (
      <header className="flex h-14 items-center justify-between bg-zinc-800 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
        <Link href="/">
          <Image
            className="ml-5"
            alt="kennekt"
            src={logo.src}
            width={150}
            height={150}
          />
        </Link>
        <div className="mr-5 hidden items-center justify-between gap-4 sm:flex">
          <Link href="/login">
            <button
              type="button"
              className="rounded-lg bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gradient-to-br focus:outline-none focus:ring-4 focus:ring-teal-300 dark:focus:ring-teal-800"
            >
              Login
            </button>
          </Link>
          <Link href="/register">
            <button
              type="button"
              className=" rounded-lg bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gradient-to-br focus:outline-none focus:ring-4 focus:ring-teal-300 dark:focus:ring-teal-800"
            >
              Register
            </button>
          </Link>
        </div>
        <div className="mr-5 flex items-center sm:hidden">
          <HamburgerMenu />
        </div>
      </header>
    );
  } else {
    return (
      <header className="flex h-14 items-center justify-between bg-zinc-800 shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
        <div className="ml-5 flex shrink-0 basis-1/4 items-center justify-center">
          <Link href="/home">
            <Image alt="kennekt" src={logo.src} width={150} height={150} />
          </Link>
        </div>
        <form className="hidden basis-1/3 items-center justify-center sm:flex">
          <label htmlFor="simple-search" className="sr-only">
            Search
          </label>
          <div className="basis-3/3 relative w-full">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                aria-hidden="true"
                className="h-5 w-5 text-gray-500 dark:text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </div>
            <input
              type="text"
              id="simple-search"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-1.5 pl-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500  dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              placeholder="Search"
              required
            />
          </div>
        </form>
        <div className="hidden basis-1/4 items-center justify-center sm:flex">
          <button
            type="button"
            title={sessionData.user?.username}
            onClick={() => console.log("clicked profile")}
          >
            {user?.image ? (
              <Image alt="profile" src={user?.image} height={50} width={50} />
            ) : (
              <div className="relative h-12 w-12 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-600">
                <svg
                  className="absolute -left-1 h-14 w-14 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </div>
            )}
          </button>
        </div>
        <div className="mr-5 flex items-center sm:hidden">
          <HamburgerMenu />
        </div>
      </header>
    );
  }
}

export default NavBar;
