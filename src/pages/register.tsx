import type {
  NextApiResponse,
  NextApiRequest,
  GetServerSidePropsContext,
  NextPage,
} from "next";
import Link from "next/link";
import Image from "next/image";
import logo from "../../images/logo.png";
import { api } from "../utils/api";
import { useForm } from "react-hook-form";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { useEffect } from "react";
import { useRouter } from "next/router";

type UserRegisterForm = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
};

const Register: NextPage = () => {
  const router = useRouter();

  const {
    register,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<UserRegisterForm>();

  const createUser = api.user.createOne.useMutation({
    onSuccess() {
      void router.push("/login");
    },
  });

  const onSubmit = ({
    username,
    firstName,
    lastName,
    password,
    confirmPassword,
    email,
  }: UserRegisterForm) => {
    if (password !== confirmPassword) {
      return setError(
        "confirmPassword",
        { type: "focus", message: "Passwords do not match!" },
        { shouldFocus: true }
      );
    }
    createUser.mutate({
      username,
      firstName,
      lastName,
      password,
      email,
    });
  };

  useEffect(() => {
    console.log(createUser.error?.message);
    if (createUser.error?.message === "Email already exists") {
      return setError(
        "email",
        { type: "focus", message: createUser.error.message },
        { shouldFocus: true }
      );
    } else if (createUser.error?.message === "Username already exists") {
      return setError(
        "username",
        { type: "focus", message: createUser.error.message },
        { shouldFocus: true }
      );
    }
  }, [createUser.error, setError]);

  // useEffect(() => {
  //   console.log(createUser.variables?.username);
  //   console.log(createUser.variables?.password);
  // });

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
        <form
          className="w-80 rounded-2xl bg-gray-900 p-5 lg:w-96"
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="mb-6 grid gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="firstName"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                First name
              </label>
              <input
                type="text"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                placeholder="John"
                {...register("firstName", { required: true })}
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                Last name
              </label>
              <input
                type="text"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                placeholder="Doe"
                {...register("lastName", { required: true })}
              />
            </div>
          </div>
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
              placeholder="JDoe"
              {...register("username", { required: true })}
            />
            {errors.username && <p>{errors.username.message}</p>}
          </div>
          <div className="mb-6">
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Email address
            </label>
            <input
              type="email"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              placeholder="john.doe@company.com"
              {...register("email", { required: true })}
            />
            {errors.email && <p>{errors.email.message}</p>}
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
          <div className="mb-6">
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Confirm password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              placeholder="•••••••••"
              {...register("confirmPassword", { required: true })}
            />
            {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
          </div>
          {/* <div className="mb-6 grid gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="birthday"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                Birthday
              </label>
              <input
                type="date"
                id="birthday"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                placeholder="john.doe@company.com"
                {...register("birthday", { required: true })}
              />
            </div>
            <div>
              <label
                htmlFor="gender"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                Gender
              </label>
              <select
                defaultValue={"DEFAULT"}
                title="gender"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                {...register("gender", { required: true })}
              >
                <option value="DEFAULT" disabled>
                  Select Gender
                </option>
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div> */}
          <div className="mb-6 flex items-start">
            <div className="flex h-5 items-center">
              <input
                id="remember"
                type="checkbox"
                value=""
                className="focus:ring-3 h-4 w-4 rounded border border-gray-300 bg-gray-50 focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                {...register("acceptTerms", { required: true })}
              />
            </div>
            <label
              htmlFor="remember"
              className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              I agree with the &nbsp;
              <a
                href="#"
                className="text-blue-600 hover:underline dark:text-blue-500"
              >
                terms and conditions
              </a>
              .
            </label>
          </div>
          <input
            type="submit"
            className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto"
          />
        </form>
      </div>
    </div>
  );
};

export default Register;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions(context.req as NextApiRequest, context.res as NextApiResponse)
  );

  console.log("session", session);

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
