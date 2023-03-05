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
import Linkify from "react-linkify";
import "animate.css";

interface PostProps {
  id: string;
  user: User;
  session: Session | null;
  title: string;
  body: string;
  images: ImageType[];
  likes: number;
  dislikes: number;
  comments: number;
  createdAt: Date;
  isClickable?: boolean;
}

function Post({
  id,
  user: author,
  session,
  title,
  body,
  images,
  likes,
  dislikes,
  comments,
  createdAt,
  isClickable = false,
}: PostProps) {
  const [isCommentFormVisible, setIsCommentFormVisible] = React.useState(false);
  const [highlightClass, setHighlightClass] = React.useState("");
  const utils = api.useContext();
  const router = useRouter();
  const deletePost = api.post.deleteOne.useMutation({
    onSuccess() {
      void utils.post.invalidate();
    },
  });

  useEffect(() => {
    if (isClickable) {
      setHighlightClass("border hover:border-zinc-600");
    }
  }, [isClickable]);

  return (
    <div
      className={`${highlightClass} relative flex-col overflow-hidden rounded border-[#2d3748] bg-zinc-800 text-white shadow-md`}
      onClick={(e) => {
        if ((e.target as HTMLElement).tagName === "DIV") {
          if (isClickable) {
            void router.push(`/${author?.username as string}/${id}`);
          }
        } else {
          e.stopPropagation();
        }
      }}
    >
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
          <Linkify>
            <div className="whitespace-pre-line">{body}</div>
          </Linkify>
        </div>
      </div>
      <div className="my-5">
        {images.length > 0 && <ImageCarousel images={images} />}
      </div>
      <div className="pb-6 pr-6 pl-6">
        <div className="flex flex-row items-center gap-x-5">
          <div className="flex items-center gap-x-2">
            <LikeButton id={id} />
            <span>{likes}</span>
          </div>
          <div className="flex items-center gap-x-2">
            <DislikeButton id={id} />
            <span>{dislikes}</span>
          </div>
          <button
            type="button"
            className="flex items-center gap-x-2"
            onClick={() => {
              setIsCommentFormVisible(!isCommentFormVisible);
            }}
          >
            <FaRegCommentAlt size={20} />
            <span>{comments}</span>
          </button>
          <div>
            <span>{createdAt.toLocaleString()}</span>
          </div>
        </div>
      </div>
      {isCommentFormVisible && <CommentForm postId={id} />}
    </div>
  );
}

export default Post;
