import React, { use, useEffect } from "react";
import Image from "next/image";
import type { Session } from "next-auth";
import defaultPicture from "../../images/user.png";
import Link from "next/link";
import { api } from "../utils/api";
import Dropdown from "./Dropdown";
import LikeButton from "./LikeButton";
import DislikeButton from "./DislikeButton";
import ImageCarousel from "./ImageCarousel";
import { FaRegCommentAlt } from "react-icons/fa";
import { useRouter } from "next/router";
import type { RouterOutputs } from "../utils/api";
import Linkify from "react-linkify";
import "animate.css";
import useHomePageStore from "../stores/home-page";
import { useSession } from "next-auth/react";

interface PostProps {
  postData: RouterOutputs["post"]["getOne"];
  session: Session | null;
  isClickable?: boolean;
}

function Post({ postData, session, isClickable = false }: PostProps) {
  const {
    id: postId,
    author,
    title,
    body,
    images,
    likesCount: likes,
    dislikesCount: dislikes,
    commentsCount: comments,
    createdAt,
  } = postData;
  const { data: sessionData } = useSession();
  const { posts: currentUserPosts } = useHomePageStore((state) => state);
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
      setHighlightClass(
        "border hover:border-zinc-600 hover:shadow-lg cursor-pointer animate__animated animate__fadeIn animate__faster"
      );
    }
  }, [isClickable]);

  useEffect(() => {
    // if likedBy array changes, update the post
  }, [currentUserPosts.get(postId)?.likedBy]);

  const checkIfLiked = () => {
    if (currentUserPosts) {
      const post = currentUserPosts.get(postId);
      //! likedBy array will be empty on intial posts
      const testLike = post?.likedBy?.some(
        (user) => user.id === sessionData?.user?.id
      );
      return testLike ?? false;
    }
    return false;
  };

  const checkIfDisliked = () => {
    if (currentUserPosts) {
      const post = currentUserPosts.get(postId);
      //! likedBy array will be empty on intial posts
      const testDislike = post?.dislikedBy?.some(
        (user) => user.id === sessionData?.user?.id
      );
      return testDislike ?? false;
    }
    return false;
  };

  return (
    <div
      className={`${highlightClass} relative h-fit flex-col overflow-hidden rounded border-[#2d3748] bg-zinc-800 text-white shadow-md `}
      onClick={(e) => {
        // TODO: idk if this is the best way to do this
        // some tagnames are weird and only work as lowercase
        if (
          (e.target as HTMLElement).tagName === "BUTTON" ||
          (e.target as HTMLElement).tagName === "svg" ||
          (e.target as HTMLElement).tagName === "path" ||
          (e.target as HTMLElement).tagName === "SPAN"
        ) {
          e.stopPropagation();
        } else {
          if (isClickable) {
            void router.push(`/${author.username ?? ""}/${postId}`);
          }
        }
      }}
    >
      <div className="pt-6 pr-6 pl-6">
        <div className="flex justify-between">
          <Link href={`/user/${author.username ?? ""}`}>
            <div className="flex items-center gap-x-3">
              <Image
                alt="profile"
                className="rounded-md"
                src={author?.image || defaultPicture.src}
                height={50}
                width={50}
              />
              <span>{author?.username}</span>
            </div>
          </Link>
          <Dropdown>
            {session?.user?.id === author?.id ? (
              <>
                <Dropdown.Item
                  onClick={() => {
                    deletePost.mutate({ id: postId });
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
          <div className="mb-3 text-xl font-medium">{title}</div>
          <Linkify>
            <span className="text-md whitespace-pre-line">{body}</span>
          </Linkify>
        </div>
      </div>
      <div className="my-5">
        {images.length > 0 && <ImageCarousel images={images} />}
      </div>
      <div className="pb-6 pr-6 pl-6">
        <div className="flex flex-row items-center gap-x-5">
          <div className="flex items-center gap-x-2">
            <LikeButton
              id={postId}
              likes={likes}
              userHasLiked={checkIfLiked()}
            />
            <DislikeButton
              id={postId}
              dislikes={dislikes}
              userHasDisliked={checkIfDisliked()}
            />
          </div>
          <div
            className="flex items-center gap-x-2"
            onClick={() => {
              if (isClickable) {
                void router.push(`/${author.username ?? ""}/${postId}`);
              }
            }}
          >
            <FaRegCommentAlt size={20} />
            {comments}
          </div>
          <div>
            <span>{createdAt?.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Post;
