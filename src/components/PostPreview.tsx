import React, { useEffect } from "react";
import Image from "next/image";
import type { User, Image as ImageType } from "@prisma/client";
import type { Session } from "next-auth";
import defaultPicture from "../../images/user.png";
import Link from "next/link";
import { api } from "../utils/api";
import Dropdown from "./Dropdown";
import LikeButton from "./LikeButton";
import DislikeButton from "./DislikeButton";
import ImageCarousel from "./ImageCarousel";
import { FaRegCommentAlt } from "react-icons/fa";
import CommentForm from "./CommentForm";
import { useRouter } from "next/router";
import "animate.css";

interface PostProps {
  id: string;
  user: User;
  session: Session | null;
  title: string;
  body: string;
  images: ImageType[];
  likes: number;
  comments: number;
}

function Post({
  id,
  user: author,
  session,
  title,
  body,
  images,
  likes,
  comments,
}: PostProps) {
  const utils = api.useContext();
  const router = useRouter();
  const deletePost = api.post.deleteOne.useMutation({
    onSuccess() {
      void utils.post.invalidate();
    },
  });

  return (
    <div className="relative flex-col overflow-hidden rounded border-[#2d3748] bg-zinc-800 text-white shadow-md">
      <div className="pt-6 pr-6 pl-6">
        <div className="flex justify-between">
          <Link href={`/user/${author?.username || ""}`}>
            <div className="flex items-center gap-x-3">
              <Image
                alt="profile"
                className="rounded-md"
                src={author?.image || defaultPicture.src}
                height={50}
                width={50}
              />
              <div>{author?.username}</div>
            </div>
          </Link>
          <Dropdown>
            {session?.user?.id === author?.id ? (
              <>
                <Dropdown.Item
                  onClick={() => {
                    deletePost.mutate({ id });
                  }}
                >
                  Delete
                </Dropdown.Item>
                <Dropdown.Item>Edit</Dropdown.Item>
              </>
            ) : (
              <Dropdown.Item>Block</Dropdown.Item>
            )}
          </Dropdown>
        </div>
        <div className="mt-5 w-full text-white ">
          <div className="text-3xl">{title}</div>
          <div className="whitespace-pre-line">{body}</div>
        </div>
      </div>
      <div className="my-5">
        {images.length > 0 && <ImageCarousel images={images} />}
      </div>
      <div className="pb-6 pr-6 pl-6">
        <div className="flex flex-row gap-x-5">
          <div className="flex items-center gap-x-2">
            <LikeButton id={id} />
            <span>{likes}</span>
          </div>
          <div className="flex items-center gap-x-2">
            <DislikeButton id={id} />
            <span>{likes}</span>
          </div>
          <button type="button">
            <Link
              href={`${author.username as string}/${id}`}
              className="flex items-center gap-x-2"
            >
              <FaRegCommentAlt size={18} />
              <span>{comments}</span>
            </Link>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Post;
