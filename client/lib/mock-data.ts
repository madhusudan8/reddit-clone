export interface Post {
  id: string;
  title: string;
  content: string;
  community: string;
  communityAvatar: string;
  author: string;
  authorAvatar: string;
  upvotes: number;
  downvotes: number;
  commentCount: number;
  timePosted: string;
  imageUrl?: string;
  type: "text" | "image" | "link";
  linkUrl?: string;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  members: number;
  online: number;
  avatar: string;
  banner: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  author: string;
  authorAvatar: string;
  content: string;
  upvotes: number;
  downvotes: number;
  timePosted: string;
  replies: Comment[];
}

export const mockPosts: Post[] = [
  {
    id: "1",
    title: "Just launched my new open-source project — feedback welcome!",
    content:
      "After 6 months of development, I finally launched my project. It's a developer tool that helps automate repetitive tasks. Would love to hear your thoughts and get some early feedback from the community.",
    community: "programming",
    communityAvatar: "🖥️",
    author: "devmaster42",
    authorAvatar: "",
    upvotes: 2847,
    downvotes: 134,
    commentCount: 342,
    timePosted: "3 hours ago",
    type: "text",
  },
  {
    id: "2",
    title: "Sunset over the mountains — captured this beauty on my hike yesterday",
    content: "Taken with my phone, no filters. Nature is incredible.",
    community: "photography",
    communityAvatar: "📷",
    author: "naturelover_88",
    authorAvatar: "",
    upvotes: 15234,
    downvotes: 421,
    commentCount: 589,
    timePosted: "5 hours ago",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop",
    type: "image",
  },
  {
    id: "3",
    title: "TIL that honey never spoils — archaeologists found 3,000-year-old honey in Egyptian tombs",
    content:
      "The honey was still perfectly edible! This is because honey has very low moisture content and is highly acidic, which makes it an inhospitable environment for bacteria and microorganisms.",
    community: "todayilearned",
    communityAvatar: "💡",
    author: "factfinder",
    authorAvatar: "",
    upvotes: 8921,
    downvotes: 203,
    commentCount: 721,
    timePosted: "8 hours ago",
    type: "text",
  },
  {
    id: "4",
    title: "My dog finally learned to shake hands after 2 months of training!",
    content: "So proud of this little guy. Consistency really is key when training pets.",
    community: "aww",
    communityAvatar: "🐾",
    author: "puppylove99",
    authorAvatar: "",
    upvotes: 23451,
    downvotes: 312,
    commentCount: 1243,
    timePosted: "12 hours ago",
    imageUrl: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&h=400&fit=crop",
    type: "image",
  },
  {
    id: "5",
    title: "The best way to structure a Next.js 14 project — a comprehensive guide",
    content:
      "After building dozens of Next.js applications, I've settled on a project structure that scales well. Here's my approach with detailed explanations for each directory and file organization pattern.",
    community: "webdev",
    communityAvatar: "🌐",
    author: "frontend_guru",
    authorAvatar: "",
    upvotes: 4567,
    downvotes: 89,
    commentCount: 234,
    timePosted: "1 day ago",
    type: "text",
  },
  {
    id: "6",
    title: "What's your unpopular food opinion?",
    content:
      "I'll go first: pineapple absolutely belongs on pizza, and I will die on this hill. What are your controversial food takes?",
    community: "askreddit",
    communityAvatar: "❓",
    author: "curious_cat",
    authorAvatar: "",
    upvotes: 12890,
    downvotes: 2341,
    commentCount: 4521,
    timePosted: "1 day ago",
    type: "text",
  },
  {
    id: "7",
    title: "Built a mechanical keyboard from scratch — here's the result",
    content: "Custom PCB, hand-lubed switches, and a beautiful walnut case. Typing on this is pure bliss.",
    community: "mechanicalkeyboards",
    communityAvatar: "⌨️",
    author: "keeb_enthusiast",
    authorAvatar: "",
    upvotes: 6734,
    downvotes: 156,
    commentCount: 445,
    timePosted: "2 days ago",
    imageUrl: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&h=400&fit=crop",
    type: "image",
  },
];

export const mockCommunities: Community[] = [
  {
    id: "1",
    name: "programming",
    description:
      "A community for discussing all things programming. Share your projects, ask questions, and learn from fellow developers.",
    members: 5200000,
    online: 12400,
    avatar: "🖥️",
    banner: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&h=300&fit=crop",
    createdAt: "Jan 25, 2008",
  },
  {
    id: "2",
    name: "photography",
    description:
      "A community for sharing and discussing photography. All skill levels welcome!",
    members: 3800000,
    online: 8900,
    avatar: "📷",
    banner: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=1200&h=300&fit=crop",
    createdAt: "Mar 14, 2009",
  },
  {
    id: "3",
    name: "todayilearned",
    description:
      "You learn something new every day; what did you learn today?",
    members: 29000000,
    online: 45000,
    avatar: "💡",
    banner: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&h=300&fit=crop",
    createdAt: "Dec 28, 2008",
  },
  {
    id: "4",
    name: "webdev",
    description:
      "A community dedicated to web development. Pair programming, code reviews, and helpful discussions.",
    members: 1200000,
    online: 5600,
    avatar: "🌐",
    banner: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&h=300&fit=crop",
    createdAt: "Jun 10, 2012",
  },
  {
    id: "5",
    name: "askreddit",
    description:
      "The place to ask and answer thought-provoking questions.",
    members: 42000000,
    online: 89000,
    avatar: "❓",
    banner: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=300&fit=crop",
    createdAt: "Jan 25, 2008",
  },
  {
    id: "6",
    name: "aww",
    description: "Things that make you go AWW! Like puppies, bunnies, babies, and so on.",
    members: 34000000,
    online: 23000,
    avatar: "🐾",
    banner: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1200&h=300&fit=crop",
    createdAt: "Jan 25, 2008",
  },
];

export const mockComments: Comment[] = [
  {
    id: "c1",
    author: "tech_wizard",
    authorAvatar: "",
    content:
      "This is amazing! I've been looking for something like this for months. The documentation is really well done too.",
    upvotes: 234,
    downvotes: 5,
    timePosted: "2 hours ago",
    replies: [
      {
        id: "c1r1",
        author: "devmaster42",
        authorAvatar: "",
        content:
          "Thanks so much! I spent a lot of time on the docs because I know how important they are.",
        upvotes: 89,
        downvotes: 2,
        timePosted: "1 hour ago",
        replies: [
          {
            id: "c1r1r1",
            author: "code_ninja",
            authorAvatar: "",
            content: "The API design is really clean. Would love to contribute!",
            upvotes: 45,
            downvotes: 0,
            timePosted: "45 min ago",
            replies: [],
          },
        ],
      },
    ],
  },
  {
    id: "c2",
    author: "react_fan",
    authorAvatar: "",
    content:
      "Have you considered adding TypeScript support? That would make it even more useful for enterprise projects.",
    upvotes: 156,
    downvotes: 8,
    timePosted: "3 hours ago",
    replies: [
      {
        id: "c2r1",
        author: "devmaster42",
        authorAvatar: "",
        content:
          "TypeScript support is on the roadmap! Should be in the next release.",
        upvotes: 67,
        downvotes: 1,
        timePosted: "2 hours ago",
        replies: [],
      },
    ],
  },
  {
    id: "c3",
    author: "open_source_lover",
    authorAvatar: "",
    content:
      "Just starred the repo. The architecture is really well thought out. I especially like how you handled the plugin system.",
    upvotes: 312,
    downvotes: 3,
    timePosted: "4 hours ago",
    replies: [],
  },
  {
    id: "c4",
    author: "beginner_dev",
    authorAvatar: "",
    content:
      "As someone just starting out, this is incredibly helpful. The examples in the README made it easy to get started.",
    upvotes: 98,
    downvotes: 1,
    timePosted: "5 hours ago",
    replies: [],
  },
];

export const trendingCommunities = [
  { name: "programming", members: "5.2M", icon: "🖥️", growth: "+12%" },
  { name: "webdev", members: "1.2M", icon: "🌐", growth: "+8%" },
  { name: "askreddit", members: "42M", icon: "❓", growth: "+3%" },
  { name: "photography", members: "3.8M", icon: "📷", growth: "+15%" },
  { name: "todayilearned", members: "29M", icon: "💡", growth: "+5%" },
];

export const suggestedUsers = [
  { name: "devmaster42", karma: "124.5k", avatar: "👨‍💻" },
  { name: "naturelover_88", karma: "89.2k", avatar: "🌿" },
  { name: "tech_wizard", karma: "67.8k", avatar: "🧙" },
  { name: "code_ninja", karma: "45.1k", avatar: "🥷" },
];

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "k";
  }
  return num.toString();
}
