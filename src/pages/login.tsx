import {
  NextApiRequest,
  NextApiResponse,
  type GetServerSidePropsContext,
  type NextPage,
} from "next";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import logo from "../../images/logo.png";
import { api } from "../utils/api";
import { useForm, SubmitHandler } from "react-hook-form";
import { useEffect } from "react";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";

import { useRouter } from "next/router";

type UserLoginForm = {
  username: string;
  email: string;
  password: string;
};

const Login: NextPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserLoginForm>();

  const onSubmit = (data: UserLoginForm) => {
    void signIn("credentials", {
      callbackUrl: `${window.location.origin}/home`,
      username: data.username,
      password: data.password,
    });
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-slate-900 via-slate-800 to-zinc-900">
      <div className="flex justify-center">
        <Link href="/">
          <button type="button" title="back">
            <Image
              className="mt-10"
              alt="kennekt"
              src={logo.src}
              width={150}
              height={150}
            ></Image>
          </button>
        </Link>
      </div>
      <div className="mt-10 flex items-center justify-center text-white">
        <div className="w-80 rounded-2xl bg-gray-900 p-5 lg:w-96">
          <form
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="mb-6">
              <label
                htmlFor="username"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                Username
              </label>
              <input
                type="text"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                placeholder="Username"
                {...register("username", { required: true })}
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                placeholder="•••••••••"
                {...register("password", { required: true })}
              />
            </div>
            <input
              type="submit"
              className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto"
            />
          </form>
          <div className="mt-6 text-center ">
            <Link href="/register" className="hover:underline">
              Sign up
            </Link>
          </div>
          <hr className="my-6 h-px border-0 bg-gray-200 dark:bg-gray-600" />
          <AuthShowcase />
        </div>
      </div>
    </div>
  );
};

export default Login;

const AuthShowcase: React.FC = () => {
  const router = useRouter();
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  // const testUser = api.user.getMyAccounts.useQuery();

  useEffect(() => {
    // console.log(testUser.data);
    console.log(sessionData?.user);
    void router.push("home");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionData]);

  return (
    <>
      {!sessionData && (
        <>
          <button
            onClick={() => {
              popupCenter("/google-signin", "Google Sign In");
            }}
            type="button"
            className="dark:focus:ring-[#4285F4]/55 mr-2 mb-4  inline-flex w-full items-center justify-center rounded-lg bg-[#4285F4] px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-[#4285F4]/90 focus:outline-none focus:ring-4 focus:ring-[#4285F4]/50"
          >
            <svg
              className="mr-2 -ml-1 h-4 w-4"
              aria-hidden="true"
              focusable="false"
              data-prefix="fab"
              data-icon="google"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 488 512"
            >
              <path
                fill="currentColor"
                d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
              ></path>
            </svg>
            Sign in with Google
          </button>
          <button
            type="button"
            onClick={() => void signIn("discord")}
            className="dark:focus:ring-[#4285F4]/55 mr-2 inline-flex w-full items-center justify-center rounded-lg bg-[#424549] px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-[#36393e]/90 focus:outline-none focus:ring-4 focus:ring-[#4285F4]/50"
          >
            <svg
              className="mr-2 -ml-1 h-4 w-4"
              viewBox="0 -28.5 256 256"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMidYMid"
              fill="#000000"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
                stroke="#CCCCCC"
                strokeWidth="6.656000000000001"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <g>
                  <path
                    d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z"
                    fill="#5865F2"
                    fillRule="nonzero"
                  ></path>
                </g>
              </g>
            </svg>
            Sign in with Discord
          </button>
        </>
      )}

      {/* {sessionData && (
        <button
          onClick={sessionData ? () => void signOut() : () => void 0}
          type="button"
          className="w-full rounded-lg bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gradient-to-br focus:outline-none focus:ring-4 focus:ring-teal-300 dark:focus:ring-teal-800"
        >
          Sign Out
        </button>
      )} */}
    </>
  );
};

function popupCenter(url: string, title: string) {
  const dualScreenLeft = window.screenLeft ?? window.screenX;
  const dualScreenTop = window.screenTop ?? window.screenY;

  const width =
    window.innerWidth ?? document.documentElement.clientWidth ?? screen.width;

  const height =
    window.innerHeight ??
    document.documentElement.clientHeight ??
    screen.height;

  const systemZoom = width / window.screen.availWidth;

  const left = (width - 500) / 2 / systemZoom + dualScreenLeft;
  const top = (height - 550) / 2 / systemZoom + dualScreenTop;

  const newWindow = window.open(
    url,
    title,
    `width=${500 / systemZoom},height=${
      550 / systemZoom
    },top=${top},left=${left}`
  );

  newWindow?.focus();
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions(context.req as NextApiRequest, context.res as NextApiResponse)
  );

  if (session) {
    return {
      redirect: {
        destination: "/home",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}
