import React, { useEffect, useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import "animate.css";

const HamburgerMenu = () => {
  const { data: sessionData } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    setIsAnimating(true);
    setIsOpen(!isOpen);
    setTimeout(() => {
      setIsAnimating(false);
    }, 700 /* delay waits for animation to finish */);
  };

  if (!sessionData) {
    return (
      <div className="relative">
        <button
          title="burger"
          type="button"
          className=" block text-gray-500 hover:text-white focus:text-white focus:outline-none"
          onClick={handleClick}
        >
          <svg
            className="h-6 w-6 text-gray-100"
            x-show="!showMenu"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
        <div
          className={`animate__animated ${
            isOpen
              ? "animate__slideInDown"
              : isAnimating
              ? "animate__slideOutUp"
              : "hidden"
          } h-50 fixed top-0 left-0 z-40 w-full overflow-y-auto bg-zinc-800`}
        >
          <nav className="relative py-12 px-4">
            <Link
              href="/login"
              className="block px-4 py-2  text-white hover:bg-indigo-500"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="block px-4 py-2  text-white hover:bg-indigo-500"
            >
              Register
            </Link>
          </nav>
          <button
            title="burger"
            type="button"
            className="absolute top-0 right-0 p-4 text-gray-500 hover:text-white focus:text-white focus:outline-none"
            onClick={handleClick}
          >
            <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
              <path d="M18.3 5.71a.996.996 0 00-1.41 0L12 10.59 7.11 5.7A.996.996 0 105.7 7.11L10.59 12 5.7 16.89a.996.996 0 101.41 1.41L12 13.41l4.89 4.89a.996.996 0 101.41-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z"></path>
            </svg>
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <div className="relative">
        <button
          title="burger"
          type="button"
          className="block text-gray-500 hover:text-white focus:text-white focus:outline-none"
          onClick={handleClick}
        >
          <svg
            className="h-6 w-6 text-gray-100"
            x-show="!showMenu"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
        <div
          className={`animate__animated ${
            isOpen
              ? "animate__slideInDown"
              : isAnimating
              ? "animate__slideOutUp"
              : "hidden"
          } h-50 fixed top-0 left-0 z-40 w-full overflow-y-auto bg-zinc-800`}
        >
          <nav className="relative py-12 px-4">
            <div className="grid grid-cols-1 gap-y-6">
              <form className=" flex items-center justify-center">
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
                        fillRule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clipRule="evenodd"
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
              {sessionData && (
                <button
                  onClick={() => {
                    if (sessionData) {
                      void signOut({
                        callbackUrl: `${window.location.origin}`,
                      });
                    }
                  }}
                  type="button"
                  className="w-full rounded-lg bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 px-5 py-2 text-center text-sm font-medium text-white hover:bg-gradient-to-br focus:outline-none focus:ring-4 focus:ring-teal-300 dark:focus:ring-teal-800"
                >
                  Sign Out
                </button>
              )}
            </div>
          </nav>
          <button
            title="burger"
            type="button"
            className="absolute top-0 right-0 p-4 text-gray-500 hover:text-white focus:text-white focus:outline-none"
            onClick={handleClick}
          >
            <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
              <path d="M18.3 5.71a.996.996 0 00-1.41 0L12 10.59 7.11 5.7A.996.996 0 105.7 7.11L10.59 12 5.7 16.89a.996.996 0 101.41 1.41L12 13.41l4.89 4.89a.996.996 0 101.41-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z"></path>
            </svg>
          </button>
        </div>
      </div>
    );
  }
};

export default HamburgerMenu;
