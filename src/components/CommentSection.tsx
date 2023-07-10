/* eslint-disable @typescript-eslint/no-misused-promises */
import type { FC, RefObject } from "react";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form"; // TODO: add form validation
import { api } from "../utils/api";
import { Comment } from "../types/types";
import { BiSolidCommentAdd } from "react-icons/bi";
import Link from "next/link";
import Image from "next/image";
import defaultPicture from "../../images/user.png";
import { HiDotsHorizontal } from "react-icons/hi";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

interface CommentSectionProps {
  postId: string;
}

interface CommentFormProps {
  forwardedRef: RefObject<HTMLTextAreaElement>;
}

interface CommentProps {
  comment: Comment;
  toggleReplyForm: (id: string) => void;
}

const Comment: FC<CommentProps> = ({ comment, toggleReplyForm }) => {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="border-l-2 border-teal-500 p-3">
      <Link href={`/user/${comment.author?.username ?? ""}`}>
        <div className="flex items-center gap-x-3">
          <Image
            alt="profile"
            className="rounded-md"
            src={comment.author?.image || defaultPicture.src}
            height={30}
            width={30}
          />
          <span>{comment.author?.username}</span>
        </div>
      </Link>

      <p>{comment.content}</p>
      <div className="flex items-center gap-x-2">
        <button onClick={() => setIsLiked(!isLiked)}>
          {isLiked ? (
            <AiFillHeart
              color="#82EEFD"
              strokeWidth={70}
              stroke="black"
              size={25}
              className={`animate__animated ${
                isLiked ? "animate__flash animate__faster" : ""
              }`}
            />
          ) : (
            <AiOutlineHeart
              size={25}
              className={`${
                isLiked
                  ? ""
                  : "animate__animated animate__flash animate__faster"
              }`}
            />
          )}
        </button>
        <button onClick={() => toggleReplyForm(comment.id)}>
          <BiSolidCommentAdd color="#14B8A6" size={25} />
        </button>
        <button>
          <HiDotsHorizontal size={20} color="white" />
        </button>
      </div>
    </div>
  );
};

const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [formOpen, setFormOpen] = useState<{
    [key: string]: boolean;
  }>({});

  const commentRef = useRef<HTMLTextAreaElement | null>(null);
  const createComment = api.comment.createOne.useMutation({});
  const createReply = api.comment.createReply.useMutation({});
  const { data } = api.comment.getAllFromPost.useQuery({
    postId: postId,
  });

  useEffect(() => {
    if (data) {
      setComments(data);
    }
  }, [data]);

  const handleAddComment = async () => {
    if (!commentRef.current || commentRef.current.value === "") {
      return;
    }

    const comment = (await createComment.mutateAsync({
      postId: postId,
      content: commentRef.current.value,
    })) as unknown as Comment;

    setComments((prevComments) => [...prevComments, comment]);
    commentRef.current = null;
  };

  const handleAddReply = async (parentId: string, replyContent: string) => {
    // TODO: throw error message if replyContent is empty
    if (replyContent === "") {
      return;
    }

    const newReply = (await createReply.mutateAsync({
      parentCommentId: parentId,
      content: replyContent,
    })) as unknown as Comment; // TODO: fix this or not idc

    // i need to go to replies of the comment with id === parentId and add newReply to it
    const addReplyToComment = (comments: Comment[]): Comment[] => {
      if (!newReply) return comments;

      return comments.map((comment) => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: [...comment.replies, newReply],
          };
        }
        // if comment has replies, go to replies and add newReply to it
        else if (comment.replies.length > 0) {
          return {
            ...comment,
            replies: addReplyToComment(comment.replies),
          };
        }
        return comment;
      });
    };

    const updatedComments = addReplyToComment(comments);
    setComments(updatedComments);
    // Close the ReplyForm after adding a reply
    setFormOpen((prevState) => ({ ...prevState, [parentId]: false }));
  };

  // recursive function to render replies
  const renderReplies = (replies: Comment[]) => {
    return replies?.map((reply) => (
      <div key={reply.id} className="ml-4">
        <Comment toggleReplyForm={toggleReplyForm} comment={reply} />
        {formOpen[reply.id] && (
          <ReplyForm parentId={reply.id} onAddReply={handleAddReply} />
        )}
        {reply.replies && renderReplies(reply.replies)}
      </div>
    ));
  };

  const CommentForm: React.FC<CommentFormProps> = ({ forwardedRef }) => {
    const [isCommentFormOpen, setIsCommentFormOpen] = useState(false);

    // TODO: Refactor
    const scrollToTextArea = () => {
      forwardedRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
      scrollToTextArea();
    });
    // !----------------!

    if (!isCommentFormOpen) {
      return (
        <button
          className="mt-2 bg-blue-500 px-4 py-2  hover:bg-blue-600"
          onClick={() => setIsCommentFormOpen(true)}
        >
          Add Comment
        </button>
      );
    }

    return (
      <div className="mt-4">
        <textarea
          className="w-full border border-gray-300 bg-black p-2"
          rows={4}
          ref={forwardedRef}
        ></textarea>
        <button
          className="mt-2 bg-blue-500 px-4 py-2  hover:bg-blue-600"
          onClick={handleAddComment}
        >
          Add Comment
        </button>
      </div>
    );
  };

  const ReplyForm: React.FC<{
    parentId: string;
    onAddReply: (parentId: string, replyContent: string) => void;
  }> = ({ parentId, onAddReply }) => {
    const replyRef = useRef<HTMLTextAreaElement | null>(null);
    const [reply, setReply] = useState("");

    // TODO: Refactor
    const scrollToTextArea = () => {
      replyRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
      scrollToTextArea();
    });

    // !----------------!

    const handleAddReply = () => {
      onAddReply(parentId, reply);
      setReply("");
    };

    return (
      <>
        <div className="mt-2">
          <p className="text-sm font-bold">Reply:</p>
          <textarea
            ref={replyRef}
            className="w-full border border-gray-300 bg-black p-2"
            rows={3}
            value={reply}
            onChange={(e) => setReply(e.target.value)}
          ></textarea>
          <button
            className="mt-2 bg-blue-500 px-4 py-1 hover:bg-blue-600"
            onClick={handleAddReply}
          >
            Add Reply
          </button>
        </div>
      </>
    );
  };

  const toggleReplyForm = (parentId: string) => {
    console.log(parentId);
    setFormOpen((prevState) => ({
      ...prevState,
      [parentId]: !prevState[parentId],
    }));
  };

  return (
    <div className="text-white">
      <h2 className="text-2xl font-bold">Comments</h2>
      <CommentForm forwardedRef={commentRef} />
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="relative h-fit flex-col overflow-hidden rounded border-[#2d3748] bg-zinc-800 text-white shadow-md"
        >
          <Comment toggleReplyForm={toggleReplyForm} comment={comment} />
          {formOpen[comment.id] && (
            <ReplyForm parentId={comment.id} onAddReply={handleAddReply} />
          )}
          {renderReplies(comment.replies)}
        </div>
      ))}
    </div>
  );
};

export default CommentSection;
