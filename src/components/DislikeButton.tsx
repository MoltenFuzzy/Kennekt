import { SiLetterboxd } from "react-icons/si";
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
        handleClick(250, false);
      }}
    >
      <SiLetterboxd
        color="#eb4034"
        size={25}
        className={`animate__animated ${
          isDislikePressed ? "animate__heartBeat" : ""
        }`}
      />
    </button>
  );
}
