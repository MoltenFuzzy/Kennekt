import { useState } from "react";

// for logged in user only
export const useAnimatePostIcons = () => {
  const [isLikePressed, setIsLikePressed] = useState(false);
  const [isDislikePressed, setIsDislikePressed] = useState(false);

  const handleClick = (duration: number, isLike: boolean) => {
    if (isLike) {
      setIsLikePressed(true);
      setTimeout(() => {
        setIsLikePressed(false);
      }, duration);
    } else {
      setIsDislikePressed(true);
      setTimeout(() => {
        setIsDislikePressed(false);
      }, duration);
    }
  };

  return { isLikePressed, isDislikePressed, handleClick };
};

export default useAnimatePostIcons;
