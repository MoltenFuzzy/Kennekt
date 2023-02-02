import React from "react";
import Image from "next/image";
import type { User, Image as ImageType } from "@prisma/client";
import defaultPicture from "../../images/user.png";
import Link from "next/link";
import { api } from "../utils/api";
import ImageCarousel from "./ImageCarousel";
import { Dropdown } from "flowbite-react";
import { TbDotsDiagonal } from "react-icons/tb";

interface PostProps {
  id: string;
  user: User;
  title: string;
  body: string;
  images: ImageType[];
  likes: number;
  comments: number;
}

function Post({
  id,
  user: author,
  title,
  body,
  images,
  likes,
  comments,
}: PostProps) {
  const post = api.post.getOne.useQuery({ id: id });
  const likePost = api.post.likeOne.useMutation();

  return (
    <div className="flex-col rounded border-[#2d3748] bg-zinc-800 p-6 text-white shadow-md  ">
      <div className="flex justify-between">
        <div className="flex items-center">
          <Link href={`/user/${author?.username || ""}`}>
            <Image
              alt="profile"
              src={author?.image || defaultPicture.src}
              height={50}
              width={50}
            />
          </Link>
          <div>{author?.username}</div>
        </div>
        <div>
          {/* <Dropdown
            label="test"
            arrowIcon={false}
            inline={true}
            dismissOnClick={false}
          >
            <Dropdown.Item>Dashboard</Dropdown.Item>
            <Dropdown.Item>Settings</Dropdown.Item>
            <Dropdown.Item>Earnings</Dropdown.Item>
            <Dropdown.Item>Sign out</Dropdown.Item>
          </Dropdown> */}
        </div>
      </div>
      <div className="mt-5 w-full text-white ">
        <div className="text-3xl">{title}</div>
        <div>{body}</div>
      </div>
      <div>{images.length > 0 && <ImageCarousel images={images} />}</div>
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
  );
}

export default Post;
