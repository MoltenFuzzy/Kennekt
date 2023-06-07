import { IoSkullSharp } from "react-icons/io5";
import { GiWilliamTellSkull } from "react-icons/gi";
import useAnimatePostIcons from "../hooks/useAnimatePostIcons";
import { api } from "../utils/api";
import { useEffect, useState } from "react";

interface DislikeButtonProps {
  id: string;
  dislikes: number;
  userHasDisliked: boolean;
}

export default function DislikeButton({
  id,
  dislikes,
  userHasDisliked,
}: DislikeButtonProps) {
  const [dislikesCount, setDislikesCount] = useState(dislikes);
  const [hasDisliked, setHasDisliked] = useState(userHasDisliked);
  const { isDislikePressed, handleClick } = useAnimatePostIcons();

  const utils = api.useContext();
  const dislikePost = api.post.dislikeOne.useMutation({
    onSuccess() {
      void utils.post.invalidate();
    },
  });

  // Weird bug that happened in Kentan, where the userHasDisliked prop was not
  // being passed in correctly. This useEffect fixes that.
  // TODO: states r fucked
  useEffect(() => {
    setDislikesCount(dislikes);
    if (userHasDisliked) {
      setHasDisliked(true);
    }
  }, [userHasDisliked, hasDisliked, dislikesCount, dislikes]);

  return (
    <>
      <button
        type="button"
        title="dislike"
        onClick={() => {
          if (!hasDisliked) {
            setHasDisliked(true);
            handleClick(250, false);
            setDislikesCount(dislikesCount + 1);
            dislikePost.mutate({
              id,
            });
          } else {
            setHasDisliked(false);
            handleClick(250, false);
            setDislikesCount(dislikesCount - 1);
            dislikePost.mutate({
              id,
            });
          }
        }}
      >
        {hasDisliked ? (
          <GiWilliamTellSkull
            color="teal"
            size={25}
            className={`animate__animated ${
              isDislikePressed ? "animate__jello" : ""
            }`}
          />
        ) : (
          <IoSkullSharp
            color="white"
            size={25}
            className={`animate__animated ${
              isDislikePressed ? "animate__jello" : ""
            }`}
          />
        )}
      </button>
      <span>{dislikesCount}</span>
    </>
  );
}
