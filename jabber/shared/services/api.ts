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

// Sample titles for users
const TITLES = [
  'Vibe Master', 'Chaos Wizard', 'Based Demon', 'Cursed Angel', 'Blessed Void',
  'Sleepy Bean', 'Caffeinated Noodle', 'Cryptid Creature', 'Brain Rot King',
  'Touch Grass Pls', 'No Thoughts Head Empty', 'Anxiety Gremlin', 'Depression Demon',
  'Serotonin Thief', 'Dopamine Dealer', 'ADHD Energy', 'Vibing Ghost', 'Feral Cat',
  'Unhinged Wizard', 'Chaotic Goblin'
];



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
  
  let baseLikes = 0;
  let multiplier = 1;
  
  switch (type) {
    case 'allTime':
      baseLikes = 5000;
      multiplier = 3;
      break;
    case 'trending':
      baseLikes = 2000;
      multiplier = 2;
      break;
    case 'forYou':
      baseLikes = 100;
      multiplier = 1;
      break;
    default:
      baseLikes = 50;
      break;
  }
  
  const likes = Math.floor(baseLikes * (0.5 + random * multiplier));
  const boostLevel = random > 0.8 ? Math.floor(random * 5) + 1 : 0;
  
  return {
    likes,
    boostLevel,
    reactions: REACTION_PATTERNS[Math.floor(random * REACTION_PATTERNS.length)],
    isLiked: random > 0.7,
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
      
      const userSeed = seed * 3;
      const userTitle = TITLES[userSeed % TITLES.length];
      
      return {
        id: `post-${type}-${page}-${i}`,
        text: POST_TEXT_POOL[postIndex % POST_TEXT_POOL.length],
        username: isMine ? 'chaos_wizard420' : USERNAME_POOL[seed % USERNAME_POOL.length],
        userId: isMine ? currentUserId : `user-${page}-${i}`,
        userTitle: isMine ? 'Chaos Wizard' : userTitle,
        likes: postData.likes || 0,
        reactions: postData.reactions || {},
        commentCount: Math.floor(seededRandom(seed * 2) * 50),
        createdAt: new Date(Date.now() - postIndex * 60 * 60 * 1000).toISOString(),
        isLiked: postData.isLiked || false,
        userReaction: seededRandom(seed * 4) > 0.8 ? ['🔥', '💀', '😭'][Math.floor(seededRandom(seed * 5) * 3)] : undefined,
        boostLevel: postData.boostLevel || 0,
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
      title: 'Chaos Wizard',
    };
    
    dataCache.set('current-user', user);
    return user;
  },
  
  // Clear cache method for refresh
  clearCache: () => {
    dataCache.clear();
  },

  // Post interaction methods
  likePost: async (postId: string): Promise<void> => {
    await new Promise((res) => setTimeout(res, 100));
    console.log('Liked post:', postId);
    // In a real app, this would make an API call to like the post
  },

  unlikePost: async (postId: string): Promise<void> => {
    await new Promise((res) => setTimeout(res, 100));
    console.log('Unliked post:', postId);
    // In a real app, this would make an API call to unlike the post
  },

  reactToPost: async (postId: string, emoji: string): Promise<void> => {
    await new Promise((res) => setTimeout(res, 100));
    console.log('Reacted to post:', postId, 'with emoji:', emoji);
    // In a real app, this would make an API call to react to the post
  },

  removeReaction: async (postId: string): Promise<void> => {
    await new Promise((res) => setTimeout(res, 100));
    console.log('Removed reaction from post:', postId);
    // In a real app, this would make an API call to remove the reaction
  },

  addComment: async (postId: string, text: string): Promise<Comment> => {
    await new Promise((res) => setTimeout(res, 200));
    console.log('Added comment to post:', postId, 'text:', text);
    
    const newComment: Comment = {
      id: `comment-${postId}-${Date.now()}`,
      postId,
      text,
      author: 'chaos_wizard420', // Current user
      userId: 'current-user',
      createdAt: new Date().toISOString(),
    };
    
    return newComment;
  },
};