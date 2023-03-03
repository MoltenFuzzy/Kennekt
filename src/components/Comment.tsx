import React, { useState } from "react";

interface Comment {
  id: number;
  author: string;
  text: string;
  replies: Comment[];
}

interface CommentProps {
  comment: Comment;
}

const Comment: React.FC<CommentProps> = ({ comment }) => {
  const [showReplies, setShowReplies] = useState(false);

  const toggleReplies = () => {
    setShowReplies(!showReplies);
  };

  return (
    <div>
      <div>
        <span>{comment.author}: </span>
        <span>{comment.text}</span>
      </div>
      {comment.replies.length > 0 && (
        <button onClick={toggleReplies}>
          {showReplies ? "Hide Replies" : "Show Replies"}
        </button>
      )}
      {showReplies &&
        comment.replies.map((reply) => (
          <Comment key={reply.id} comment={reply} />
        ))}
    </div>
  );
};

export default Comment;
