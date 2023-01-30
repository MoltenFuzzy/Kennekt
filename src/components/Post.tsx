import React from "react";
import Image from "next/image";
import type { User } from "@prisma/client";
import defaultPicture from "../../images/user.png";
import Link from "next/link";
import { api } from "../utils/api";

interface PostProps {
  id: string;
  user: User;
  title: string;
  body: string;
  likes: number;
  comments: number;
}

function Post({ id, user: author, title, body, likes, comments }: PostProps) {
  const post = api.post.getOne.useQuery({ id: id });
  const likePost = api.post.likeOne.useMutation();

  return (
    <div className="flex-col rounded border-[#2d3748] bg-zinc-800 p-6 shadow-md">
      <div className="flex text-white">
        <Link href={`/user/${author?.username || ""}`}>
          <Image
            alt="profile"
            src={author?.image || defaultPicture.src}
            height={50}
            width={50}
          />
          <div>{author?.username}</div>
        </Link>
        <div className="ml-5">
          <div>{title}</div>
          <div>{body}</div>
          <div className="flex">
            <button
              type="button"
              onClick={() => {
                likePost.mutate({ id: id });
              }}
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
