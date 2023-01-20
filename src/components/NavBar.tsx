import { useState } from "react";
import Image from "next/image";
import logo from "../../images/logo.png";
import Link from "next/link";
import type { Session } from "next-auth";
import HamburgerMenu from "./Hamburger";

export interface NavBarProps {
  page?: string;
  user?: Session["user"];
}

function NavBar({ page, user }: NavBarProps) {
  if (page == "landing") {
    return (
      <nav className="flex h-14 items-center justify-between bg-zinc-800 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
        <Image
          className="ml-5"
          alt="kennekt"
          src={logo.src}
          width={150}
          height={150}
        ></Image>
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
      </nav>
    );
  } else {
    return (
      <header className="flex h-14 items-center justify-between bg-zinc-800 shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
        <div className="ml-10">
          <Image alt="kennekt" src={logo.src} width={150} height={150} />
        </div>
        <form className="flex items-center">
          <label htmlFor="simple-search" className="sr-only">
            Search
          </label>
          <div className="relative w-full">
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
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pl-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500  dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              placeholder="Search"
              required
            />
          </div>
          <button
            type="submit"
            className="ml-2 rounded-lg border border-blue-700 bg-blue-700 p-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
            <span className="sr-only">Search</span>
          </button>
        </form>
        <div className="mr-10 flex items-center justify-center">
          <button
            type="button"
            title="Title"
            onClick={() => console.log("clicked profile")}
          >
            <Image
              height={40}
              width={40}
              className="rounded-lg"
              alt="profile"
              src={user?.image || ""}
            ></Image>
          </button>
        </div>
      </header>
    );
  }
}

export default NavBar;
