import React from "react";
import { useForm } from "react-hook-form";
import { api } from "../utils/api";

type CommentSubmitForm = {
  text: string;
};

interface CommentFormProps {
  postId: string | undefined;
}

const CommentForm: React.FC<CommentFormProps> = ({ postId }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentSubmitForm>();

  const createComment = api.comment.createOne.useMutation({});

  const onSubmit = ({ text }: CommentSubmitForm) => {
    console.log(text);
    createComment.mutate({ postId: postId || "", content: text });
    reset();
  };

  return (
    <>
      <form
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col items-center gap-y-3 text-white">
          <label htmlFor="comment" className="sr-only">
            Comment
          </label>
          <textarea
            id="text"
            rows={3}
            className="block w-[97%] rounded-md border-gray-300 bg-black p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Join the discussion"
            defaultValue={""}
            {...register("text", { required: true })}
          />
          <div className="flex w-[97%] justify-end">
            <button
              type="submit"
              className="mb-3  rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Reply
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default CommentForm;
