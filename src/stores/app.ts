import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { FullPost } from "../types/types";

// used zustand to create a global store for new posts that are created
interface AppState {
  postsOptimisticUpdateApplied: boolean;
  setPostsOptimisticUpdateApplied: (
    postsOptimisticUpdateApplied: boolean
  ) => void;
  posts: FullPost[];
  setPosts: (setPosts: FullPost[]) => void;
}

const useAppStore = create<AppState>()(
  devtools((set) => ({
    postsOptimisticUpdateApplied: false,
    setPostsOptimisticUpdateApplied: (postsOptimisticUpdateApplied) =>
      set((state) => ({
        ...state,
        postsOptimisticUpdateApplied,
      })),
    posts: [],
    setPosts: (posts) =>
      set((state) => ({
        ...state,
        posts,
      })),
  }))
);

export default useAppStore;
