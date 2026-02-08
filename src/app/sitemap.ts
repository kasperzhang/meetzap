import type { MetadataRoute } from "next";
import { blogPosts } from "@/data/blog-posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const blogEntries: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `https://meetzap.app/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    {
      url: "https://meetzap.app",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://meetzap.app/create",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: "https://meetzap.app/blog",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    ...blogEntries,
    {
      url: "https://meetzap.app/privacy",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];
}
