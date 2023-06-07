import React from "react";
import { useForm } from "react-hook-form";
import { api } from "../utils/api";
import { useRouter } from "next/router";

interface UsernameModalProps {
  title: string;
  // children?: React.ReactNode;
}

type UsernameForm = {
  username: string;
};

const UsernameModal: React.FC<UsernameModalProps> = ({ title }) => {
  const router = useRouter();
  const utils = api.useContext();
  const setUsername = api.user.setUsername.useMutation({
    onSuccess() {
      void utils.user.invalidate();
      void router.replace(router.asPath);
      // reloadSession();
    },
  });
  // const user = api.user.getUser.useQuery({});

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UsernameForm>();

  const handleUserKeyPress = (e: KeyboardEvent) => {
    console.log(e.key);
    if (e.key === "Enter" && !e.shiftKey) {
      void handleSubmit(onSubmit)(); // this won't be triggered
    }
  };

  const onSubmit = (data: UsernameForm) => {
    console.log(data);
    setUsername.mutate({ username: data.username });
  };

  return (
    <>
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity" aria-hidden="true">
            <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
          </div>

          {/* Modal Content */}
          <div
            className="inline-block transform overflow-hidden rounded-lg bg-gray-800 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline"
          >
            <div className="bg-gray-900 px-4 py-3 sm:px-6">
              <h3
                className="text-lg font-medium leading-6 text-white"
                id="modal-headline"
              >
                {title}
              </h3>
            </div>
            <div className="bg-gray-800 px-4 py-3 sm:p-6">
              <form
                id="username-form"
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                onSubmit={handleSubmit(onSubmit)}
              >
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
                  {...register("username", {
                    required: true,
                    pattern: {
                      value:
                        /^(?=.{3,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/,
                      message:
                        "Username must be between 3 and 20 characters and can only contain letters, numbers, underscores and periods.",
                    },
                  })}
                />
              </form>
            </div>
            <div className="flex justify-end bg-gray-900 px-4 py-3 sm:px-6">
              {/* Modal Footer */}
              <button
                type="submit"
                form="username-form"
                className="rounded bg-blue-800 py-2 px-4 font-semibold text-white hover:bg-blue-700"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 z-10 flex items-center justify-center bg-black bg-opacity-60">
      <div className="h-5/6 w-1/2 rounded-lg bg-gray-500 text-white">
        <div className="flex justify-center">
          <form
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onSubmit={handleSubmit(onSubmit)}
          >
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
            <input
              type="submit"
              className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto"
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default UsernameModal;
