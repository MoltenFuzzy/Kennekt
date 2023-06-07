/* eslint-disable @typescript-eslint/no-misused-promises */
// import React, { useEffect, useRef, useState } from "react";
// import { useForm } from "react-hook-form";
// import { api } from "../utils/api";
// import type { Comment } from "../types/types";
// import { BiCommentAdd } from "react-icons/bi";

// interface CommentSectionProps {
//   postId: string;
// }

// interface CommentFormProps {
//   forwardedRef: React.Ref<HTMLTextAreaElement>;
// }

// const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
//   const [comments, setComments] = useState<Comment[]>([]);

//   const newComment = useRef<HTMLTextAreaElement | null>(null);
//   const createComment = api.comment.createOne.useMutation({});
//   const createReply = api.comment.createReply.useMutation({});
//   const { data } = api.comment.getAllFromPost.useQuery({
//     postId: postId,
//   });

//   useEffect(() => {
//     if (data) {
//       setComments(data);
//     }
//   }, [data]);

//   const handleAddComment = async () => {
//     const comment = (await createComment.mutateAsync({
//       postId: postId,
//       content: newComment.current?.value || "",
//     })) as unknown as Comment; // TODO: fix this or not idc

//     setComments((prevComments) => [...prevComments, comment]);
//     newComment.current = null;
//   };

//   const handleAddReply = async (parentId: string, replyContent: string) => {
//     const newReply = (await createReply.mutateAsync({
//       parentCommentId: parentId,
//       content: replyContent,
//     })) as unknown as Comment; // TODO: fix this or not idc

//     // i need to go to replies of the comment with id === parentId and add newReply to it
//     const addReplyToComment = (comments: Comment[]): Comment[] => {
//       if (!newReply) return comments;

//       return comments.map((comment) => {
//         if (comment.id === parentId) {
//           return {
//             ...comment,
//             replies: [...comment.replies, newReply],
//           };
//         } else if (comment.replies.length > 0) {
//           return {
//             ...comment,
//             replies: addReplyToComment(comment.replies),
//           };
//         }
//         return comment;
//       });
//     };

//     const updatedComments = addReplyToComment(comments);
//     setComments(updatedComments);
//   };

//   // recursive function to render replies
//   const renderReplies = (replies: Comment[]) => {
//     return replies?.map((reply) => (
//       <div key={reply.id} className="ml-4">
//         <p>{reply.content}</p>
//         {reply.replies && renderReplies(reply.replies)}
//         {isReplyFormOpen && (
//           <ReplyForm parentId={reply.id} onAddReply={handleAddReply} />
//         )}
//       </div>
//     ));
//   };

//   const CommentForm: React.FC<CommentFormProps> = ({ forwardedRef }) => {
//     const [isCommentFormOpen, setIsCommentFormOpen] = useState(false);

//     if (!isCommentFormOpen) {
//       return (
//         <button
//           className="mt-2 bg-blue-500 px-4 py-2  hover:bg-blue-600"
//           onClick={() => setIsCommentFormOpen(true)}
//         >
//           Open Comment
//         </button>
//       );
//     }

//     return (
//       <div className="mt-4">
//         <textarea
//           className="w-full border border-gray-300 bg-black p-2"
//           rows={4}
//           ref={forwardedRef}
//         ></textarea>
//         <button
//           className="mt-2 bg-blue-500 px-4 py-2  hover:bg-blue-600"
//           onClick={handleAddComment}
//         >
//           Add Comment
//         </button>
//       </div>
//     );
//   };

//   const ReplyForm: React.FC<{
//     parentId: string;
//     onAddReply: (parentId: string, replyContent: string) => void;
//   }> = ({ parentId, onAddReply }) => {
//     const [isReplyFormOpen, setIsReplyFormOpen] = useState(false);
//     const [reply, setReply] = useState("");

//     const handleAddReply = () => {
//       onAddReply(parentId, reply);
//       setReply("");
//     };

//     if (!isReplyFormOpen) return null;

//     return (
//       <>
//         <div className="mt-2">
//           <textarea
//             className="w-full border border-gray-300 bg-black p-2"
//             rows={3}
//             value={reply}
//             onChange={(e) => setReply(e.target.value)}
//           ></textarea>
//           <button
//             className="mt-2 bg-blue-500 px-4 py-1  hover:bg-blue-600"
//             onClick={handleAddReply}
//           >
//             Add Reply
//           </button>
//         </div>
//       </>
//     );
//   };

//   return (
//     <div className="text-white">
//       <h2 className="text-2xl font-bold">Comments</h2>
//       {comments.map((comment) => (
//         <div key={comment.id}>
//           <div>
//             <p className="text-md font-bold">{comment.author.username}</p>
//             <p className="bg-slate-600">{comment.content}</p>
//             <button onClick={() => setIsReplyFormOpen(!isReplyFormOpen)}>
//               <BiCommentAdd color="#82EEFD" size={25} />
//             </button>
//           </div>
//           {renderReplies(comment.replies)}
//           <ReplyForm parentId={comment.id} onAddReply={handleAddReply} />
//         </div>
//       ))}
//       <CommentForm forwardedRef={newComment} />
//     </div>
//   );
// };

// export default CommentSection;

//! FIX THIS VERSION

import React, { use, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { api } from "../utils/api";
import type { Comment } from "../types/types";
import { BiCommentAdd } from "react-icons/bi";

interface CommentSectionProps {
  postId: string;
}

interface CommentFormProps {
  forwardedRef: React.Ref<HTMLTextAreaElement>;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [formOpen, setFormOpen] = useState<{
    [key: string]: boolean;
  }>({});
  const initalFormOpen = false;

  const newComment = useRef<HTMLTextAreaElement | null>(null);
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
    if (!newComment.current || newComment.current.value === "") {
      return;
    }

    const comment = (await createComment.mutateAsync({
      postId: postId,
      content: newComment.current.value,
    })) as unknown as Comment;

    setComments((prevComments) => [...prevComments, comment]);
    newComment.current = null;
  };

  const handleAddReply = async (parentId: string, replyContent: string) => {
    if (replyContent === "") {
      return;
    }

    const newReply = (await createReply.mutateAsync({
      parentCommentId: parentId,
      content: replyContent,
    })) as unknown as Comment;

    // BUG: only goes one level deep
    const updatedComments = comments.map((comment) => {
      console.log(comment.id, parentId);
      if (comment.id === parentId) {
        return {
          ...comment,
          replies: [...comment.replies, newReply],
        };
      }
      return comment;
    });

    setComments(updatedComments);

    // Close the ReplyForm after adding a reply
    setFormOpen((prevState) => ({ ...prevState, [parentId]: false }));
  };

  // recursive function to render replies
  const renderReplies = (replies: Comment[]) => {
    return replies?.map((reply) => (
      <div key={reply.id} className="ml-4">
        <p>{reply.content}</p>{" "}
        <button onClick={() => toggleReplyForm(reply.id)}>
          <BiCommentAdd color="#82EEFD" size={25} />
        </button>
        {!formOpen[reply.id] ||
          (!initalFormOpen && (
            <ReplyForm
              parentId={reply.id}
              onAddReply={handleAddReply}
              onToggleReplyForm={() => toggleReplyForm(reply.id)}
            />
          ))}
        {reply.replies && renderReplies(reply.replies)}
      </div>
    ));
  };

  const CommentForm: React.FC<CommentFormProps> = ({ forwardedRef }) => {
    const [isCommentFormOpen, setIsCommentFormOpen] = useState(false);

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
    onToggleReplyForm: () => void;
  }> = ({ parentId, onAddReply, onToggleReplyForm }) => {
    const [reply, setReply] = useState("");

    const handleAddReply = () => {
      onAddReply(parentId, reply);
      setReply("");
    };

    return (
      <>
        <div className="mt-2">
          <p className="text-sm font-bold">Reply:</p>
          <textarea
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
      {comments.map((comment) => (
        <div key={comment.id}>
          <div>
            <p className="text-md font-bold">{comment.author.username}</p>
            <p className="bg-slate-600">{comment.content}</p>
            <button onClick={() => toggleReplyForm(comment.id)}>
              <BiCommentAdd color="#82EEFD" size={25} />
            </button>
          </div>
          {!formOpen[comment.id] ||
            (!initalFormOpen && (
              <ReplyForm
                parentId={comment.id}
                onAddReply={handleAddReply}
                onToggleReplyForm={() => toggleReplyForm(comment.id)}
              />
            ))}
          {renderReplies(comment.replies)}
        </div>
      ))}
      <CommentForm forwardedRef={newComment} />
    </div>
  );
};

export default CommentSection;
