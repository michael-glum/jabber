// shared/models/types.ts
export type Post = {
  id: string;
  text: string;
}

export type User = {
  id: string;
  username: string;
  region: string;
  jabberScore: number;
};

export type Comment = {
  id: string;
  postId: string;
  text: string;
  author: string;
};