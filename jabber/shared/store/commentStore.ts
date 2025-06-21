// shared/store/commentStore.ts
import { create } from 'zustand';
import { Comment } from '../models/types';

type CommentStore = {
  localComments: Record<string, Comment | null>;
  setLocalComment: (postId: string, comment: Comment | null) => void;
  getLocalComment: (postId: string) => Comment | null;
};

export const useLocalCommentStore = create<CommentStore>((set, get) => ({
  localComments: {},
  setLocalComment: (postId, comment) => {
    set((state) => ({
      localComments: { ...state.localComments, [postId]: comment },
    }));
  },
  getLocalComment: (postId) => {
    return get().localComments[postId] || null;
  },
}));
