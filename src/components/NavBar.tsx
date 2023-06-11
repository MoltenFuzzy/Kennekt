import Image from "next/image";
import logo from "../../images/logo.png";
import defaultPicture from "../../images/user.png";
import Link from "next/link";
import type { Session } from "next-auth";
import HamburgerMenu from "./Hamburger";
import UserSearchDropdown from "./SearchBarDropDown";
import PostFormModal from "./PostFormModal";

export interface NavBarProps {
  user?: Session["user"];
}

function NavBar({ user }: NavBarProps) {
  if (!user) {
    return (
      <header className="flex h-14 items-center justify-around">
        <Link href="/">
          <Image
            className="ml-5"
            alt="kennekt"
            src={logo.src}
            width={150}
            height={150}
          />
        </Link>
        <div></div>
        <div></div>
        <div></div>
        <div className="mr-5 hidden items-center justify-between gap-4 sm:flex">
          <Link href="/login">
            <button
              type="button"
              className="transform rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white transition duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2"
            >
              Login
            </button>
          </Link>
          <Link href="/register">
            <button
              type="button"
              className="transform rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white transition duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2"
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
        <div className="hidden basis-1/4 items-center justify-center gap-4 sm:flex">
          <PostFormModal />
          <Link href={`/user/${user.username}`}>
            <Image
              alt="profile"
              src={user?.image || defaultPicture.src}
              height={40}
              width={40}
              className="cursor-pointer rounded-full transition duration-300 ease-in-out hover:opacity-80"
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
