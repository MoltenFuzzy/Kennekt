import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { RouterOutputs } from "../utils/api";

type FullPost = RouterOutputs["post"]["getOneWithAll"];

// used zustand to create a global store for new posts that are created
interface HomePageState {
  postsOptimisticUpdateApplied: boolean;
  setPostsOptimisticUpdateApplied: (
    postsOptimisticUpdateApplied: boolean
  ) => void;
  posts: Map<string, FullPost>; // used to test the optimistic update
  setPosts: (posts: Map<string, FullPost>) => void;
}

const useHomePageStore = create<HomePageState>()(
  devtools((set) => ({
    postsOptimisticUpdateApplied: false,
    setPostsOptimisticUpdateApplied: (postsOptimisticUpdateApplied) =>
      set((state) => ({
        ...state,
        postsOptimisticUpdateApplied,
      })),
    posts: new Map<string, FullPost>(),
    setPosts: (posts) =>
      set((state) => ({
        ...state,
        posts,
      })),
  }))
);

export default useHomePageStore;
