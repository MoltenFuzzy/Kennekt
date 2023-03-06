import React, { useState } from "react";
import type { RouterOutputs } from "../utils/api";

interface CommentProps {
  commentData: RouterOutputs["comment"]["getAllFromPost"][0];
}

const Comment: React.FC<CommentProps> = ({ commentData }) => {
  const [showReplies, setShowReplies] = useState(false);

  const toggleReplies = () => {
    setShowReplies(!showReplies);
  };

  return (
    <div className="relative flex-col overflow-hidden rounded border-[#2d3748] bg-zinc-800 p-6 text-white shadow-md">
      <span>{commentData.author.username}: </span>
      <span>{commentData.text}</span>
    </div>
  );
};

export default Comment;
