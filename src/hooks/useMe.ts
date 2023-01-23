import { signOut, useSession } from "next-auth/react";
import { api } from "../utils/api";

// for logged in user only
export const useMe = () => {
  const { data: session, status } = useSession();

  const query = api.user.getMe.useQuery(undefined, {
    enabled: status !== "loading",
    onError: (error) => {
      console.error("me query error: ", error.message);

      // id exists but not valid session, clear it
      if (session?.user?.id && error.data?.httpStatus === 404) {
        void signOut();
      }
    },
  });

  return { me: query.data, isLoadingMe: query.isLoading };
};
