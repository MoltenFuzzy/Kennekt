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
        <div className="">
          <Image
            alt="profile"
            src={author?.image || ""}
            height={50}
            width={50}
          />
          <div>{author?.username}</div>
        </div>
        <div className="ml-5">
          <div>{title}</div>
          <div>{body}</div>
          <div className="flex">
            <div>{likes}</div>
            <div>{comments}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Post;
