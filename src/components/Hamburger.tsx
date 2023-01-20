import React, { useEffect, useState } from "react";
import "animate.css";
import Link from "next/link";

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    setIsAnimating(true);
    setIsOpen(!isOpen);
    setTimeout(() => {
      setIsAnimating(false);
    }, 700 /* delay waits for animation to finish */);
  };

  useEffect(() => {
    console.log(isOpen, isAnimating);
  });

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
            href="/registration"
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
};

export default HamburgerMenu;
