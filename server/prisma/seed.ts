import { PrismaClient, PostType, VoteType, VoteTargetType, MemberRole } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
  console.log("🌱 Seeding database...\n");

  // Clean existing data
  await prisma.vote.deleteMany();
  await prisma.savedPost.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.communityMembership.deleteMany();
  await prisma.community.deleteMany();
  await prisma.user.deleteMany();

  console.log("  🗑️  Cleaned existing data");

  // Create users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        clerkId: "clerk_seed_user_1",
        username: "devmaster42",
        email: "devmaster42@example.com",
        displayName: "Dev Master",
        bio: "Full-stack developer. Open source enthusiast.",
        karma: 12450,
      },
    }),
    prisma.user.create({
      data: {
        clerkId: "clerk_seed_user_2",
        username: "naturelover_88",
        email: "naturelover88@example.com",
        displayName: "Nature Lover",
        bio: "Photographer and outdoor adventurer.",
        karma: 8920,
      },
    }),
    prisma.user.create({
      data: {
        clerkId: "clerk_seed_user_3",
        username: "tech_wizard",
        email: "techwizard@example.com",
        displayName: "Tech Wizard",
        bio: "Software architect. TypeScript fanatic.",
        karma: 6780,
      },
    }),
    prisma.user.create({
      data: {
        clerkId: "clerk_seed_user_4",
        username: "factfinder",
        email: "factfinder@example.com",
        displayName: "Fact Finder",
        bio: "Curious mind. TIL enthusiast.",
        karma: 15670,
      },
    }),
    prisma.user.create({
      data: {
        clerkId: "clerk_seed_user_5",
        username: "puppylove99",
        email: "puppylove99@example.com",
        displayName: "Puppy Love",
        bio: "Dog mom. Sharing cuteness daily.",
        karma: 23100,
      },
    }),
  ]);

  console.log(`  👤 Created ${users.length} users`);

  // Create communities
  const communities = await Promise.all([
    prisma.community.create({
      data: {
        name: "programming",
        displayName: "Programming",
        description: "A community for discussing all things programming. Share your projects, ask questions, and learn from fellow developers.",
        ownerId: users[0].id,
      },
    }),
    prisma.community.create({
      data: {
        name: "photography",
        displayName: "Photography",
        description: "A community for sharing and discussing photography. All skill levels welcome!",
        ownerId: users[1].id,
      },
    }),
    prisma.community.create({
      data: {
        name: "todayilearned",
        displayName: "Today I Learned",
        description: "You learn something new every day; what did you learn today?",
        ownerId: users[3].id,
      },
    }),
    prisma.community.create({
      data: {
        name: "webdev",
        displayName: "Web Development",
        description: "A community dedicated to web development. Pair programming, code reviews, and helpful discussions.",
        ownerId: users[2].id,
      },
    }),
    prisma.community.create({
      data: {
        name: "aww",
        displayName: "Aww",
        description: "Things that make you go AWW! Like puppies, bunnies, babies, and so on.",
        ownerId: users[4].id,
      },
    }),
    prisma.community.create({
      data: {
        name: "askreddit",
        displayName: "Ask Reddit",
        description: "The place to ask and answer thought-provoking questions.",
        ownerId: users[0].id,
      },
    }),
  ]);

  console.log(`  🏘️  Created ${communities.length} communities`);

  // Create memberships (each user joins several communities)
  const memberships = [];
  for (const user of users) {
    for (const community of communities) {
      memberships.push(
        prisma.communityMembership.create({
          data: {
            userId: user.id,
            communityId: community.id,
            role: community.ownerId === user.id ? MemberRole.ADMIN : MemberRole.MEMBER,
          },
        })
      );
    }
  }
  await Promise.all(memberships);
  console.log(`  🤝 Created ${memberships.length} memberships`);

  // Create posts
  const posts = await Promise.all([
    prisma.post.create({
      data: {
        title: "Just launched my new open-source project — feedback welcome!",
        content: "After 6 months of development, I finally launched my project. It's a developer tool that helps automate repetitive tasks. Would love to hear your thoughts and get some early feedback from the community.",
        type: PostType.TEXT,
        authorId: users[0].id,
        communityId: communities[0].id,
        voteScore: 2713,
      },
    }),
    prisma.post.create({
      data: {
        title: "Sunset over the mountains — captured this beauty on my hike yesterday",
        content: "Taken with my phone, no filters. Nature is incredible.",
        type: PostType.IMAGE,
        imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop",
        authorId: users[1].id,
        communityId: communities[1].id,
        voteScore: 14813,
      },
    }),
    prisma.post.create({
      data: {
        title: "TIL that honey never spoils — archaeologists found 3,000-year-old honey in Egyptian tombs",
        content: "The honey was still perfectly edible! This is because honey has very low moisture content and is highly acidic, which makes it an inhospitable environment for bacteria and microorganisms.",
        type: PostType.TEXT,
        authorId: users[3].id,
        communityId: communities[2].id,
        voteScore: 8718,
      },
    }),
    prisma.post.create({
      data: {
        title: "The best way to structure a Next.js 14 project — a comprehensive guide",
        content: "After building dozens of Next.js applications, I've settled on a project structure that scales well. Here's my approach with detailed explanations for each directory and file organization pattern.",
        type: PostType.TEXT,
        authorId: users[2].id,
        communityId: communities[3].id,
        voteScore: 4478,
      },
    }),
    prisma.post.create({
      data: {
        title: "My dog finally learned to shake hands after 2 months of training!",
        content: "So proud of this little guy. Consistency really is key when training pets.",
        type: PostType.IMAGE,
        imageUrl: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&h=400&fit=crop",
        authorId: users[4].id,
        communityId: communities[4].id,
        voteScore: 23139,
      },
    }),
    prisma.post.create({
      data: {
        title: "What's your unpopular food opinion?",
        content: "I'll go first: pineapple absolutely belongs on pizza, and I will die on this hill. What are your controversial food takes?",
        type: PostType.TEXT,
        authorId: users[0].id,
        communityId: communities[5].id,
        voteScore: 10549,
      },
    }),
    prisma.post.create({
      data: {
        title: "Built a mechanical keyboard from scratch — here's the result",
        content: "Custom PCB, hand-lubed switches, and a beautiful walnut case. Typing on this is pure bliss.",
        type: PostType.IMAGE,
        imageUrl: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&h=400&fit=crop",
        authorId: users[2].id,
        communityId: communities[0].id,
        voteScore: 6578,
      },
    }),
  ]);

  console.log(`  📝 Created ${posts.length} posts`);

  // Create comments
  const comments = await Promise.all([
    prisma.comment.create({
      data: {
        content: "This is amazing! I've been looking for something like this for months. The documentation is really well done too.",
        authorId: users[2].id,
        postId: posts[0].id,
        voteScore: 229,
      },
    }),
    prisma.comment.create({
      data: {
        content: "Have you considered adding TypeScript support? That would make it even more useful for enterprise projects.",
        authorId: users[3].id,
        postId: posts[0].id,
        voteScore: 148,
      },
    }),
    prisma.comment.create({
      data: {
        content: "Absolutely stunning photo! Where was this taken?",
        authorId: users[0].id,
        postId: posts[1].id,
        voteScore: 567,
      },
    }),
    prisma.comment.create({
      data: {
        content: "Mind-blowing fact! I remember reading about this in National Geographic.",
        authorId: users[1].id,
        postId: posts[2].id,
        voteScore: 342,
      },
    }),
    prisma.comment.create({
      data: {
        content: "Good boy! 🐕 What breed is he?",
        authorId: users[0].id,
        postId: posts[4].id,
        voteScore: 890,
      },
    }),
  ]);

  // Create nested replies
  await Promise.all([
    prisma.comment.create({
      data: {
        content: "Thanks so much! I spent a lot of time on the docs because I know how important they are.",
        authorId: users[0].id,
        postId: posts[0].id,
        parentId: comments[0].id,
        voteScore: 87,
      },
    }),
    prisma.comment.create({
      data: {
        content: "TypeScript support is on the roadmap! Should be in the next release.",
        authorId: users[0].id,
        postId: posts[0].id,
        parentId: comments[1].id,
        voteScore: 65,
      },
    }),
    prisma.comment.create({
      data: {
        content: "This was in the Swiss Alps, near Interlaken!",
        authorId: users[1].id,
        postId: posts[1].id,
        parentId: comments[2].id,
        voteScore: 234,
      },
    }),
  ]);

  console.log(`  💬 Created ${comments.length + 3} comments`);

  // Create some votes
  const voteData = [
    { userId: users[1].id, postId: posts[0].id, type: VoteType.UPVOTE, targetType: VoteTargetType.POST },
    { userId: users[2].id, postId: posts[0].id, type: VoteType.UPVOTE, targetType: VoteTargetType.POST },
    { userId: users[3].id, postId: posts[0].id, type: VoteType.UPVOTE, targetType: VoteTargetType.POST },
    { userId: users[0].id, postId: posts[1].id, type: VoteType.UPVOTE, targetType: VoteTargetType.POST },
    { userId: users[3].id, postId: posts[1].id, type: VoteType.UPVOTE, targetType: VoteTargetType.POST },
    { userId: users[0].id, postId: posts[4].id, type: VoteType.UPVOTE, targetType: VoteTargetType.POST },
    { userId: users[2].id, postId: posts[4].id, type: VoteType.UPVOTE, targetType: VoteTargetType.POST },
  ];

  for (const vote of voteData) {
    await prisma.vote.create({ data: vote });
  }

  console.log(`  👍 Created ${voteData.length} votes`);

  // Create saved posts
  await prisma.savedPost.create({
    data: { userId: users[0].id, postId: posts[1].id },
  });
  await prisma.savedPost.create({
    data: { userId: users[0].id, postId: posts[2].id },
  });

  console.log(`  🔖 Created 2 saved posts`);

  console.log("\n✅ Seeding complete!\n");
}

seed()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
