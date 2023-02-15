import { api } from "../utils/api";
import { useForm } from "react-hook-form";

type PostSubmitForm = {
  title: string;
  body: string;
};

function PostForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PostSubmitForm>();

  const utils = api.useContext();
  const createPost = api.post.createOne.useMutation({
    onSuccess() {
      void utils.post.getAll.invalidate();
    },
  });

  const onSubmit = ({ title, body }: PostSubmitForm) => {
    const bodyInput = body.replace(/(?:(?:\r\n|\r|\n)\s*){2}/gm, ""); // removes empty lines
    createPost.mutate({ title: title, body: bodyInput });
    reset(); // TODO: FIX THIS CUZ ITS BAD
  };

  return (
    <>
      <form
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="mb-4 w-full rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-600 dark:bg-gray-700">
          <div className="grid-col-1 grid gap-5 rounded-b-lg bg-white px-4 py-2 dark:bg-gray-800">
            <input
              id="title"
              type="text"
              className="mt-3 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              placeholder="Title"
              required
              {...register("title", { required: true })}
            />
            <label htmlFor="editor" className="sr-only">
              Publish post
            </label>
            <textarea
              id="editor"
              rows={8}
              className="block w-full border-0 bg-white px-0 text-sm text-gray-800 focus:ring-0 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
              placeholder="Write an article..."
              required
              {...register("body", { required: true })}
            ></textarea>
          </div>
        </div>
        <button
          type="submit"
          className="inline-flex items-center rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900"
        >
          Publish post
        </button>
      </form>
    </>
  );
}

export default PostForm;
