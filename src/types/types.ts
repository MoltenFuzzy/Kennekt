import type { RouterOutputs } from "../utils/api";
import type { User } from "@prisma/client";
// TODO: Depreciate this type and call it when needed
export type FullPost = RouterOutputs["post"]["getOne"];
export type TestComment = RouterOutputs["comment"]["getOne"];

export type Comment = {
  id: string;
  authorId: string;
  postId: string;
  content: string;
  parentCommentId: string | null;
  replies: Comment[];
} & {
  author: User;
};

// export type FullComment = Comment & TestComment;

// const x = {} as FullComment;
