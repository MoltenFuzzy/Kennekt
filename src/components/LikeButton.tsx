import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import useAnimatePostIcons from "../hooks/useAnimatePostIcons";
import { api } from "../utils/api";
import { useEffect, useState } from "react";

interface LikeButtonProps {
  id: string;
  likes: number;
  userHasLiked: boolean;
}

export default function LikeButton({
  id: postId,
  likes,
  userHasLiked,
}: LikeButtonProps) {
  const [likesCount, setLikesCount] = useState(likes);
  const [hasLiked, setHasLiked] = useState(userHasLiked);
  const { isLikePressed, handleClick } = useAnimatePostIcons();

  const utils = api.useContext();
  const likePost = api.post.likeOne.useMutation({
    // Cancel any outgoing refetches
    // (so they don't overwrite our optimistic update)
    onMutate: async (variables) => {
      await utils.post.getOne.cancel();
      const newData = utils.post.getOne.getData();
      utils.post.getOne.setData({ id: variables.id }, newData);
      return { newData };
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, context) => {
      // void utils.post.getOne.setData(context?.id, newData);
    },
    // Always refetch after error or success:
    onSettled: (data, error, variables, context) => {
      void utils.post.invalidate();
    },
  });

  // Weird bug that happened in Kentan, where the userHasDisliked prop was passed, but state needed to the updated afterwards
  // This useEffect fixes that.
  useEffect(() => {
    if (userHasLiked) {
      setHasLiked(true);
    }
  }, [userHasLiked]);

  return (
    <>
      <button
        title="like"
        type="button"
        onClick={() => {
          if (!hasLiked) {
            setHasLiked(true);
            handleClick(250, true);
            setLikesCount(likesCount + 1);
            likePost.mutate({
              id: postId,
            });
          } else {
            setHasLiked(false);
            handleClick(250, true);
            setLikesCount(likesCount - 1);
            likePost.mutate({
              id: postId,
            });
          }
        }}
      >
        {hasLiked ? (
          <AiFillHeart
            color="#82EEFD"
            strokeWidth={70}
            stroke="black"
            size={25}
            className={`animate__animated ${
              isLikePressed ? "animate__flash animate__faster" : ""
            }`}
          />
        ) : (
          <AiOutlineHeart
            size={25}
            className={`animate__animated ${
              isLikePressed ? "animate__flash animate__faster" : ""
            }`}
          />
        )}
      </button>
      <span>{likesCount}</span>
    </>
  );
}
