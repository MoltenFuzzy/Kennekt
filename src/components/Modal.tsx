import React from "react";
import { useForm } from "react-hook-form";
import { api } from "../utils/api";
import { reloadSession } from "../utils/helpers";

interface ModalProps {
  title: string;
  // children?: React.ReactNode;
}

type UsernameForm = {
  username: string;
};

const Modal: React.FC<ModalProps> = ({ title }) => {
  const utils = api.useContext();
  const setUsername = api.user.setUsername.useMutation({
    onSuccess() {
      void utils.user.invalidate();
      reloadSession();
    },
  });
  // const user = api.user.getUser.useQuery({});

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UsernameForm>();

  const handleUserKeyPress = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      void handleSubmit(onSubmit)(); // this won't be triggered
    }
  };

  const onSubmit = (data: UsernameForm) => {
    setUsername.mutate({ username: data.username });
  };

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

export default Modal;
