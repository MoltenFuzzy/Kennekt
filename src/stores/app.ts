import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { FullPost } from "../types/types";

interface AppState {
  posts: FullPost[];
  setPosts: (setPosts: FullPost[]) => void;
}

const useAppStore = create<AppState>()(
  devtools((set) => ({
    posts: [],
    setPosts: (posts) =>
      set((state) => ({
        ...state,
        posts,
      })),
  }))
);

export default useAppStore;
