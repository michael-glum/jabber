// shared/services/api.ts
import { Post, User, Comment } from '../models/types';

// Pre-generated data pools for better performance
const USERNAME_POOL = [
  'chaotic_goblin420', 'unhinged_wizard', 'feral_cat', 'vibing_ghost', 'based_demon',
  'cursed_angel', 'blessed_void', 'sleepy_bean', 'caffeinated_noodle', 'cryptid_creature',
  'chaos_wizard', 'vibe_master', 'brain_rot_king', 'touch_grass_pls', 'no_thoughts_head_empty',
  'anxiety_gremlin', 'depression_demon', 'serotonin_thief', 'dopamine_dealer', 'adhd_energy',
];

const POST_TEXT_POOL = [
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
  "if you're reading this, you've been manually breathing for the last 5 seconds",
  "adulting is just googling how to do stuff and hoping for the best",
  "my bank account and my will to live have a lot in common: they're both in the negatives",
  "therapist: and what do we do when we feel overwhelmed?\nme: add another hobby i'll abandon in 2 weeks",
  "society: be yourself\nalso society: no not like that",
];

const REGIONS = ['USA', 'Canada', 'UK', 'Australia', 'Germany', 'Japan', 'Brazil', 'Mexico'];

// Pre-generate reaction patterns for consistency
const REACTION_PATTERNS: Record<string, number>[] = [
  { '🔥': 523, '💀': 234, '😭': 189 },
  { '🤯': 892, '👀': 445, '✨': 321 },
  { '🤡': 156, '💯': 789, '👻': 234 },
  { '🎉': 667, '🚀': 445, '🥴': 123 },
  { '📈': 234, '🫡': 567, '🗿': 890 },
];

// Cache for generated data to avoid regeneration
const dataCache = new Map<string, any>();

// Seeded random for consistency
const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

// Generate consistent data based on ID
const generatePostData = (type: string, index: number): Partial<Post> => {
  const seed = type.charCodeAt(0) + index;
  const random = seededRandom(seed);
  
  let baseUpvotes = 0;
  let baseDownvotes = 0;
  let multiplier = 1;
  
  switch (type) {
    case 'allTime':
      baseUpvotes = 5000;
      baseDownvotes = 500;
      multiplier = 3;
      break;
    case 'trending':
      baseUpvotes = 2000;
      baseDownvotes = 200;
      multiplier = 2;
      break;
    case 'forYou':
      baseUpvotes = 100;
      baseDownvotes = 20;
      multiplier = 1;
      break;
    default:
      baseUpvotes = 50;
      baseDownvotes = 10;
      break;
  }
  
  const upvotes = Math.floor(baseUpvotes * (0.5 + random * multiplier));
  const downvotes = Math.floor(baseDownvotes * (0.5 + random * 0.5));
  const boostLevel = random > 0.8 ? Math.floor(random * 5) + 1 : 0;
  
  return {
    upvotes,
    downvotes,
    boostLevel,
    reactions: REACTION_PATTERNS[Math.floor(random * REACTION_PATTERNS.length)],
    userVote: random > 0.7 ? (random > 0.85 ? 'up' : 'down') : null,
  };
};

export const api = {
  getPosts: async (type: 'forYou' | 'allTime' | 'trending' | 'mine' | 'reactions', page: number): Promise<Post[]> => {
    const cacheKey = `posts-${type}-${page}`;
    
    // Return cached data if available
    if (dataCache.has(cacheKey)) {
      return dataCache.get(cacheKey);
    }
    
    // Simulate network delay
    await new Promise((res) => setTimeout(res, 300));
    
    const PAGE_SIZE = 10;
    const currentUserId = 'current-user';
    
    const posts = Array.from({ length: PAGE_SIZE }, (_, i) => {
      const isMine = type === 'mine';
      const postIndex = page * PAGE_SIZE + i;
      const seed = type.charCodeAt(0) + postIndex;
      
      const postData = generatePostData(type, postIndex);
      
      return {
        id: `post-${type}-${page}-${i}`,
        text: POST_TEXT_POOL[postIndex % POST_TEXT_POOL.length],
        username: isMine ? 'chaos_wizard420' : USERNAME_POOL[seed % USERNAME_POOL.length],
        userId: isMine ? currentUserId : `user-${page}-${i}`,
        likes: 0, // deprecated, using upvotes/downvotes now
        reactions: postData.reactions || {},
        commentCount: Math.floor(seededRandom(seed * 2) * 50),
        createdAt: new Date(Date.now() - postIndex * 60 * 60 * 1000).toISOString(),
        isLiked: seededRandom(seed * 3) > 0.7,
        userReaction: seededRandom(seed * 4) > 0.8 ? ['🔥', '💀', '😭'][Math.floor(seededRandom(seed * 5) * 3)] : undefined,
        boostLevel: postData.boostLevel || 0,
        upvotes: postData.upvotes || 0,
        downvotes: postData.downvotes || 0,
        userVote: postData.userVote,
      };
    });
    
    // Cache the result
    dataCache.set(cacheKey, posts);
    
    return posts;
  },
  
  getLeaderboardUsers: async (
    type: 'trending' | 'allTime',
    page: number
  ): Promise<User[]> => {
    const cacheKey = `leaderboard-${type}-${page}`;
    
    if (dataCache.has(cacheKey)) {
      return dataCache.get(cacheKey);
    }
    
    await new Promise((res) => setTimeout(res, 200));
    
    const PAGE_SIZE = 50;
    const baseScore = type === 'allTime' ? 10000 : 1000;
    const startRank = page * PAGE_SIZE + 1;
    
    const users = Array.from({ length: PAGE_SIZE }, (_, i) => {
      const seed = type.charCodeAt(0) + page * 1000 + i;
      const rank = startRank + i;
      
      return {
        id: `${type}-user-${page}-${i}`,
        username: USERNAME_POOL[(seed * 7) % USERNAME_POOL.length],
        region: REGIONS[seed % REGIONS.length],
        jabberScore: Math.max(baseScore - rank * 10, 100) + Math.floor(seededRandom(seed) * 50),
        level: Math.max(1, Math.floor((baseScore - rank * 10) / 1000)),
        streak: Math.floor(seededRandom(seed * 2) * 30),
        badges: rank <= 10 ? ['🏆', '⚡', '🔥'] : rank <= 50 ? ['⭐'] : [],
      };
    });
    
    dataCache.set(cacheKey, users);
    return users;
  },
  
  getComments: async (postId: string, page: number): Promise<Comment[]> => {
    await new Promise((res) => setTimeout(res, 200));
    const PAGE_SIZE = 10;
    
    return Array.from({ length: PAGE_SIZE }, (_, i) => {
      const seed = postId.charCodeAt(0) + page * 100 + i;
      
      return {
        id: `comment-${postId}-${page}-${i}`,
        postId,
        text: POST_TEXT_POOL[(seed * 3) % POST_TEXT_POOL.length],
        author: USERNAME_POOL[(seed * 5) % USERNAME_POOL.length],
        userId: `user-comment-${page}-${i}`,
        createdAt: new Date(Date.now() - i * 30 * 60 * 1000).toISOString(),
      };
    });
  },
  
  getCurrentUser: async (): Promise<User> => {
    if (dataCache.has('current-user')) {
      return dataCache.get('current-user');
    }
    
    await new Promise((res) => setTimeout(res, 100));
    
    const user = {
      id: 'current-user',
      username: 'chaos_wizard420',
      region: 'USA',
      jabberScore: 4269,
      level: 12,
      streak: 7,
      badges: ['🔥', '👑', '💯'],
    };
    
    dataCache.set('current-user', user);
    return user;
  },
  
  // Clear cache method for refresh
  clearCache: () => {
    dataCache.clear();
  },
};