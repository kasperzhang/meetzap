"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/i18n";
import { blogPosts } from "@/data/blog-posts";

export default function BlogPage() {
  const { t, locale } = useLanguage();

  return (
    <main className="min-h-screen bg-[#FFF8E7]">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-3xl font-black mb-2">{t.blog.title}</h1>
        <p className="text-neutral-600 mb-10">{t.blog.subtitle}</p>

        <div className="space-y-6">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block bg-white border-2 border-black rounded-xl p-6 shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all"
            >
              <div className="flex items-center gap-3 text-xs text-neutral-500 mb-2">
                <time>{post.date}</time>
                <span>{post.readingTime} {t.blog.minRead}</span>
              </div>
              <h2 className="text-lg font-black mb-2">
                {locale === "zh" ? post.titleZh : post.title}
              </h2>
              <p className="text-sm text-neutral-600 mb-3">
                {locale === "zh" ? post.descriptionZh : post.description}
              </p>
              <span className="inline-flex items-center gap-1 text-sm font-bold text-black">
                {t.blog.readMore} <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
