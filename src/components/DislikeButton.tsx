import { FiTrendingDown } from "react-icons/fi";
import useAnimatePostIcons from "../hooks/useAnimatePostIcons";
import { api } from "../utils/api";

interface DislikeButtonProps {
  id: string;
}

export default function DislikeButton({ id }: DislikeButtonProps) {
  const { isDislikePressed, handleClick } = useAnimatePostIcons();

  const utils = api.useContext();
  const dislikePost = api.post.dislikeOne.useMutation({
    onSuccess() {
      void utils.post.invalidate();
    },
  });

  return (
    <button
      type="button"
      title="down"
      onClick={() => {
        dislikePost.mutate({
          id: id,
        });
        handleClick(250, true);
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
  );
}
