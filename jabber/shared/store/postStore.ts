// shared/store/postStore.ts
import { create } from 'zustand';
import { Post } from '~/shared/models/types';

type PostStore = {
  localNewPost: Post | null;
  setLocalNewPost: (post: Post | null) => void;
};

export const useLocalPostStore = create<PostStore>((set) => ({
  localNewPost: null,
  setLocalNewPost: (post) => set({ localNewPost: post }),
}));