import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { api } from "../utils/api";
import { useMe } from "../hooks/useMe";

interface ModalProps {
  title: string;
  children?: React.ReactNode;
}

type UsernameForm = {
  username: string;
};

const Modal: React.FC<ModalProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(true);
  const setUsername = api.user.setUsername.useMutation({
    onSuccess() {
      void utils.user.invalidate();
    },
  });
  const user = useMe();
  // const user = api.user.getUser.useQuery({});
  const utils = api.useContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UsernameForm>();

  const onSubmit = (data: UsernameForm) => {
    setUsername.mutate({ username: data.username });
    console.log("set username to", data.username);
  };

  useEffect(() => {
    // close modal if there is a username
    if (user.me?.username) setIsOpen(false); //! doesnt refetch
  }, [user.me?.username]);

  // useEffect(() => {
  //   console.log(test);
  // });

  return (
    <>
      {isOpen && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-20">
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
            <div className="py-4">{children}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
