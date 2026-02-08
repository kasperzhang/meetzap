export interface BlogPost {
  slug: string;
  title: string;
  titleZh: string;
  description: string;
  descriptionZh: string;
  date: string;
  readingTime: number;
  keywords: string[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: "best-when2meet-alternatives-2025",
    title: "5 Best When2Meet Alternatives in 2025 (Free & Easy)",
    titleZh: "2025年5个最佳When2Meet替代工具（免费且简单）",
    description: "Looking for a better way to schedule group meetings? Here are the top When2Meet alternatives, including free tools that are easier to use and more modern.",
    descriptionZh: "正在寻找更好的方式来安排团队会议？以下是最佳的When2Meet替代工具，包括更易用、更现代的免费工具。",
    date: "2025-02-08",
    readingTime: 6,
    keywords: ["when2meet alternative", "scheduling tool", "free meeting scheduler", "group scheduling", "meeting planner"],
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}
