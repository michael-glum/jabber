// shared/services/api.ts
import { Post, User, Comment } from '../models/types';

// Mock data generators
const generateUsername = () => {
  const adjectives = ['chaotic', 'unhinged', 'feral', 'vibing', 'based', 'cursed', 'blessed', 'sleepy', 'caffeinated', 'cryptid'];
  const nouns = ['goblin', 'wizard', 'cat', 'ghost', 'demon', 'angel', 'void', 'bean', 'noodle', 'creature'];
  return `${adjectives[Math.floor(Math.random() * adjectives.length)]}_${nouns[Math.floor(Math.random() * nouns.length)]}${Math.floor(Math.random() * 999)}`;
};

const generatePostText = () => {
  const posts = [
    "why do they call it oven when you of in the cold food of out hot eat the food",
    "just realized birds are government drones but honestly they're doing a great job",
    "normalize crying in the produce aisle at 3am",
    "hot take: cereal is soup",
    "i'm not saying i'm batman but have you ever seen me and batman in the same room?",
    "accidentally said 'you too' when the waiter said enjoy your meal so now i have to move to a new city",
    "the mitochondria is the powerhouse of the cell and that's the only thing keeping me going",
    "just saw a dog and my day is made. that's it. that's the post.",
    "why is it called a building if it's already built? discuss.",
    "spotify wrapped but it's just the sound of me screaming into the void for 12 months straight",
    "unpopular opinion: sleeping is just death without the commitment",
    "me: i need to save money\nalso me: ooh shiny thing",
    "remember when we thought quicksand would be a bigger problem in adult life?",
    "my love language is sending memes at 2am with no context",
    "brain: you need water\nme: best i can do is iced coffee",
  ];
  return posts[Math.floor(Math.random() * posts.length)];
};

const generateReactions = () => {
  const reactions: Record<string, number> = {};
  const emojis = ['🔥', '💀', '😭', '🤯', '👀', '✨', '🤡', '💯', '👻', '🎉'];
  
  // Add 2-5 random reactions
  const reactionCount = Math.floor(Math.random() * 8) + 2;
  for (let i = 0; i < reactionCount; i++) {
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
    if (!reactions[emoji]) {
      reactions[emoji] = Math.floor(Math.random() * 10000) + 1;
    }
  }
  
  return reactions;
};

// Generate boost level based on post type
const generateBoostLevel = (type: string): number => {
  if (type === 'mine') return 0; // User's own posts start unboosted
  
  const rand = Math.random();
  switch (type) {
    case 'allTime':
      // High engagement posts likely had boosts
      if (rand > 0.7) return Math.floor(Math.random() * 3) + 3; // 3-5
      if (rand > 0.4) return Math.floor(Math.random() * 2) + 1; // 1-2
      return 0;
    case 'trending':
      // Some boosted posts
      if (rand > 0.8) return Math.floor(Math.random() * 3) + 2; // 2-4
      if (rand > 0.6) return 1;
      return 0;
    case 'forYou':
      // Occasional boosted posts
      if (rand > 0.9) return Math.floor(Math.random() * 3) + 1; // 1-3
      return 0;
    default:
      return 0;
  }
};

export const api = {
  getPosts: async (type: 'forYou' | 'allTime' | 'trending' | 'mine' | 'reactions', page: number): Promise<Post[]> => {
    await new Promise((res) => setTimeout(res, 500));
    const PAGE_SIZE = 10;
    const currentUserId = 'current-user';
    
    return Array.from({ length: PAGE_SIZE }, (_, i) => {
      const isMine = type === 'mine';
      const postIndex = page * PAGE_SIZE + i + 1;
      
      // Generate different engagement levels based on type
      let baseLikes = 0;
      let multiplier = 1;
      
      switch (type) {
        case 'allTime':
          baseLikes = 1000;
          multiplier = 5;
          break;
        case 'trending':
          baseLikes = 500;
          multiplier = 3;
          break;
        case 'forYou':
          baseLikes = 50;
          multiplier = 2;
          break;
        case 'mine':
        case 'reactions':
          baseLikes = 20;
          multiplier = 1;
          break;
      }
      
      const boostLevel = generateBoostLevel(type);
      
      return {
        id: `post-${type}-${page}-${i}`,
        text: generatePostText(),
        username: isMine ? 'current_user' : generateUsername(),
        userId: isMine ? currentUserId : `user-${page}-${i}`,
        likes: Math.floor(Math.random() * baseLikes * multiplier) + baseLikes,
        reactions: generateReactions(),
        commentCount: Math.floor(Math.random() * 50),
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        isLiked: Math.random() > 0.7,
        userReaction: Math.random() > 0.8 ? ['🔥', '💀', '😭'][Math.floor(Math.random() * 3)] : undefined,
        boostLevel,
      };
    });
  },
  
  getLeaderboardUsers: async (
    type: 'trending' | 'allTime',
    page: number
  ): Promise<User[]> => {
    await new Promise((res) => setTimeout(res, 400));
    const PAGE_SIZE = 50;
    
    // Generate scores that make sense for rankings
    const baseScore = type === 'allTime' ? 10000 : 1000;
    const startRank = page * PAGE_SIZE + 1;
    
    return Array.from({ length: PAGE_SIZE }, (_, i) => ({
      id: `${type}-user-${page}-${i}`,
      username: generateUsername(),
      region: ['USA', 'Canada', 'UK', 'Australia', 'Germany', 'Japan'][Math.floor(Math.random() * 6)],
      jabberScore: Math.max(baseScore - (startRank + i) * 10, 100) + Math.floor(Math.random() * 50),
    }));
  },
  
  getComments: async (postId: string, page: number): Promise<Comment[]> => {
    await new Promise((res) => setTimeout(res, 300));
    const PAGE_SIZE = 10;
    
    return Array.from({ length: PAGE_SIZE }, (_, i) => ({
      id: `comment-${postId}-${page}-${i}`,
      postId,
      text: generatePostText(), // Reuse post generator for chaotic comments
      author: generateUsername(),
      userId: `user-comment-${page}-${i}`,
      createdAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
    }));
  },
  
  getCurrentUser: async (): Promise<User> => {
    await new Promise((res) => setTimeout(res, 200));
    return {
      id: 'current-user',
      username: 'chaos_wizard420',
      region: 'USA',
      jabberScore: Math.floor(Math.random() * 5000) + 1000,
    };
  },
};