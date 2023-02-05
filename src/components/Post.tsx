import React, { useState } from "react";
import Image from "next/image";
import type { User, Image as ImageType } from "@prisma/client";
import defaultPicture from "../../images/user.png";
import Link from "next/link";
import { api } from "../utils/api";
import ImageCarousel from "./ImageCarousel";
import { Dropdown } from "flowbite-react";
import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";
import "animate.css";
import useAnimatePostIcons from "../hooks/useAnimatePostIcons";

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
  const { isLikePressed, isDislikePressed, handleClick } =
    useAnimatePostIcons();
  const utils = api.useContext();
  const likePost = api.post.likeOne.useMutation({
    onSuccess() {
      void utils.post.invalidate();
    },
  });
  const deletePost = api.post.deleteOne.useMutation({
    onSuccess() {
      void utils.post.invalidate();
    },
  });

  return (
    <div className="flex-col rounded border-[#2d3748] bg-zinc-800 p-6 text-white shadow-md">
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
          <Dropdown
            label=""
            arrowIcon={true}
            inline={true}
            dismissOnClick={false}
          >
            {/* TODO: only allow auth'd user to update and delete their own posts */}
            <Dropdown.Item>Update</Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                deletePost.mutate({ id });
              }}
            >
              Delete
            </Dropdown.Item>
          </Dropdown>
        </div>
      </div>
      <div className="mt-5 w-full text-white ">
        <div className="text-3xl">{title}</div>
        <div>{body}</div>
      </div>
      <div>{images.length > 0 && <ImageCarousel images={images} />}</div>
      <div className="flex gap-x-5">
        <div className="flex items-center gap-x-2">
          <button
            title="up"
            type="button"
            onClick={() => {
              likePost.mutate({ id: id });
              handleClick(250, true);
            }}
          >
            <FiTrendingUp
              color="#255bcf"
              size={30}
              className={`animate__animated ${
                isLikePressed ? "animate__heartBeat" : ""
              }`}
            />
          </button>
          <div>{likes}</div>
        </div>
        <div className="flex items-center gap-x-2">
          <button
            type="button"
            title="down"
            onClick={() => {
              handleClick(250, false);
            }}
          >
            <FiTrendingDown
              color="#eb4034"
              size={30}
              className={`animate__animated ${
                isDislikePressed ? "animate__heartBeat" : ""
              }`}
            />
          </button>
          <div>{comments}</div>
        </div>
      </div>
    </div>
  );
}

export default Post;
