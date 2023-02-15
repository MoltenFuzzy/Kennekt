import { FiTrendingUp } from "react-icons/fi";
import useAnimatePostIcons from "../hooks/useAnimatePostIcons";
import { api } from "../utils/api";

interface LikeButtonProps {
  id: string;
}

export default function LikeButton({ id }: LikeButtonProps) {
  const { isLikePressed, handleClick } = useAnimatePostIcons();

  const utils = api.useContext();
  const likePost = api.post.likeOne.useMutation({
    onSuccess() {
      void utils.post.invalidate();
    },
  });

  return (
    <button
      title="up"
      type="button"
      onClick={() => {
        likePost.mutate({
          id: id,
        });
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
  );
}