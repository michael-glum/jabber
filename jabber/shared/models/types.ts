// shared/models/types.ts
export type Post = {
  id: string;
  text: string;
  username: string;
  userId: string;
  likes: number;
  reactions: Record<string, number>;
  commentCount: number;
  createdAt: string;
  isLiked?: boolean;
  userReaction?: string;
  boostLevel: number;
  upvotes: number;
  downvotes: number;
  userVote?: 'up' | 'down' | null;
  trendingRank?: number;
}

export type User = {
  id: string;
  username: string;
  region: string;
  jabberScore: number;
  level?: number;
  streak?: number;
  badges?: string[];
};

export type Comment = {
  id: string;
  postId: string;
  text: string;
  author: string;
  userId: string;
  createdAt: string;
};