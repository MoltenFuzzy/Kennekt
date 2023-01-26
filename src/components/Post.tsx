import React from "react";
import Image from "next/image";
import type { User } from "@prisma/client";

interface PostProps {
  id: string;
  user: User;
  title: string;
  body: string;
  likes: number;
  comments: number;
}

function Post({ id, user: author, title, body, likes, comments }: PostProps) {
  return (
    <div className="flex-col">
      <div className="flex text-white">
        <div>
          {author.image ? (
            <Image alt="profile" src={author?.image} height={50} width={50} />
          ) : (
            <div className="relative h-12 w-12 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-600">
              <svg
                className="absolute -left-1 h-14 w-14 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </div>
          )}
          <div>{author?.username}</div>
        </div>
        <div className="ml-5">
          <div>{title}</div>
          <div>{body}</div>
          <div className="flex">
            <button
              type="button"
              className="mr-2 mb-2 rounded-lg bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gradient-to-br focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
            >
              Likes
            </button>

            <div>{likes}</div>
            <button
              type="button"
              className="mr-2 mb-2 rounded-lg bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gradient-to-br focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
            >
              Comments
            </button>

            <div>{comments}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Post;
