import type { Post, Image, User } from ".prisma/client";

export type FullPost = Post & {
  images: Image[];
  author: User;
};
