import Image from "next/image";
import logo from "../../images/logo.png";
import defaultPicture from "../../images/user.png";
import Link from "next/link";
import type { Session } from "next-auth";
import HamburgerMenu from "./Hamburger";
import { useSession } from "next-auth/react";
import UserSearchDropdown from "./SearchBarDropDown";

export interface NavBarProps {
  user?: Session["user"];
}

function NavBar({ user }: NavBarProps) {
  const { data: sessionData } = useSession();

  if (!sessionData) {
    return (
      <header className="sticky top-0 z-10 flex h-14 items-center justify-between bg-zinc-800 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
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
      <header className="sticky top-0 z-10 flex h-14 items-center justify-between bg-zinc-800 shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
        <div className="ml-5 flex shrink-0 basis-1/4 items-center justify-center">
          <Link href="/home">
            <Image alt="kennekt" src={logo.src} width={150} height={150} />
          </Link>
        </div>
        <UserSearchDropdown userList={["test", "test2"]} />
        <div className="hidden basis-1/4 items-center justify-center sm:flex">
          <Link href={`/user/${sessionData?.user?.username as string}`}>
            <Image
              alt="profile"
              src={user?.image || defaultPicture.src}
              height={40}
              width={40}
              className="cursor-pointer rounded-full"
            />
          </Link>
        </div>
        <div className="mr-5 flex items-center sm:hidden">
          <HamburgerMenu />
        </div>
      </header>
    );
  }
}

export default NavBar;
