import { useEffect, useRef, useState } from "react";
import useAppStore from "../stores/app";
import type { FullPost } from "../types/types";
import { api } from "../utils/api";
import { useForm } from "react-hook-form";
import Image from "next/image";

type PostSubmitForm = {
  title: string;
  body: string;
};

type Field = {
  [key: string]: string | Blob;
};

function PostForm() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { posts, setPosts } = useAppStore((state) => state);
  const [images, setImages] = useState<File[]>([]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PostSubmitForm>();

  const createPost = api.post.createOne.useMutation({
    onSuccess(newPost) {
      setPosts([newPost as FullPost, ...posts]);
    },
  });

  const { mutateAsync: createPresignedUrl } =
    api.image.createPresignedUrl.useMutation();

  const onSubmit = ({ title, body }: PostSubmitForm) => {
    const bodyInput = body.replace(/(?:(?:\r\n|\r|\n)\s*){2}/gm, ""); // removes empty lines

    // instead of optional, we use an empty array
    const filesArray = Array.from(fileInputRef.current?.files || []);

    filesArray.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        return alert("Only Images are allowed");
      }
    });

    const imageURLs = filesArray.map((file) => URL.createObjectURL(file));

    createPost.mutate(
      {
        title: title,
        body: bodyInput,
        images: imageURLs,
      },
      {
        onSuccess: (post) => {
          // TODO: pass image id
          setImages([]); // Empty the images array upon submit
          reset(); // TODO: FIX THIS CUZ ITS BAD
          if (filesArray.length > 0) void uploadImage(post.id);
        },
        onError: (error) => {
          console.log(error);
          // TODO: show error to user
        },
      }
    );
  };

  const uploadImage = async (postId: string) => {
    const presignedPosts = await createPresignedUrl({
      postId,
      images: images.map((image) => image.name),
    });

    // post all images to s3
    await Promise.all(
      presignedPosts.map(async (presignedPost, index) => {
        const formData = new FormData();
        // this is weird but it has to start with content-type for some reason
        formData.append("Content-Type", images[index]?.type || "");
        Object.keys(presignedPost.fields).forEach((key) => {
          formData.append(key, presignedPost.fields[key] as string | Blob);
        });
        formData.append("file", images[index] as Blob);

        await fetch(presignedPost.url, {
          method: "POST",
          body: formData,
        });
      })
    );
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages([...images, ...Array.from(e.target.files)]);
    }
  };

  // useEffect(() => {
  //   console.log(images);
  // });

  return (
    <>
      <form
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="mb-4 w-full rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-600 dark:bg-gray-700">
          <div className="grid-col-1 grid gap-5 rounded-lg bg-white px-4 py-2 dark:bg-gray-800">
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
              className="block w-full border-0 bg-white p-2 text-sm text-gray-800 focus:ring-0 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
              placeholder="Write an article..."
              required
              {...register("body", { required: true })}
            ></textarea>
            <div className="flex justify-between">
              <div className="buttons">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="cursor-pointer rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  <svg
                    aria-hidden="true"
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span className="sr-only">Upload image</span>
                </button>
                <input
                  accept="image/*"
                  multiple={true}
                  ref={fileInputRef}
                  onChange={onFileChange}
                  type="file"
                  hidden
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="inline-flex items-center rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900"
                >
                  {createPost.isLoading ? (
                    <div
                      className="h-5 w-5 animate-spin rounded-full
                       border-2  border-solid border-white border-t-transparent shadow-md"
                    ></div>
                  ) : (
                    <p>Publish post</p>
                  )}
                </button>
              </div>
            </div>
            {fileInputRef.current?.files?.length ? (
              <div className="flex ">
                {Array.from(fileInputRef.current?.files).map((file) => (
                  <div key={file.name}>
                    <Image
                      alt="file.name"
                      src={URL.createObjectURL(file)}
                      width={100}
                      height={100}
                    />
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </form>
    </>
  );
}

export default PostForm;
