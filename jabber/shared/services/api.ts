// shared/services/api.ts
import { Post, User, Comment } from '../models/types';

export const api = {
  getPosts: async (_type: 'forYou' | 'allTime' | 'trending' | 'mine' | 'reactions', page: number): Promise<Post[]> => {
    await new Promise((res) => setTimeout(res, 500));
    const PAGE_SIZE = 10;
    return Array.from({ length: PAGE_SIZE }, (_, i) => ({
      id: `post-${page}-${i}`,
      text: `This is post #${page * PAGE_SIZE + i + 1}`,
    }));
  },
  getLeaderboardUsers: async (
    type: 'trending' | 'allTime',
    page: number
  ): Promise<User[]> => {
    await new Promise((res) => setTimeout(res, 400));
    const PAGE_SIZE = 50;
    return Array.from({ length: PAGE_SIZE }, (_, i) => ({
      id: `${type}-user-${page}-${i}`,
      username: `user_${type}_${page * PAGE_SIZE + i + 1}`,
      region: ['USA', 'Canada', 'UK'][i % 3],
      jabberScore: Math.floor(Math.random() * 1000),
    }));
  },
  getComments: async (postId: string, page: number): Promise<Comment[]> => {
    await new Promise((res) => setTimeout(res, 300));
    const PAGE_SIZE = 10;
    return Array.from({ length: PAGE_SIZE }, (_, i) => ({
      id: `comment-${postId}-${page}-${i}`,
      postId,
      text: `Comment #${page * PAGE_SIZE + i + 1} on post ${postId}`,
      author: `user_${page * PAGE_SIZE + i + 1}`,
    }));
  },
  getCurrentUser: async (): Promise<User> => {
    await new Promise((res) => setTimeout(res, 200));
    return {
      id: 'current-user',
      username: 'current_user',
      region: 'USA',
      jabberScore: Math.floor(Math.random() * 1000),
    };
  },
};