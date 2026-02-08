"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/i18n";
import { useParams } from "next/navigation";
import { getPostBySlug } from "@/data/blog-posts";
import { BlogPostContent } from "./content";

export default function BlogPostPage() {
  const { t, locale } = useLanguage();
  const params = useParams();
  const slug = params.slug as string;
  const post = getPostBySlug(slug);

  if (!post) {
    return (
      <main className="min-h-screen bg-[#FFF8E7]">
        <div className="container mx-auto px-4 py-12 max-w-3xl text-center">
          <h1 className="text-2xl font-black mb-4">{t.notFound.title}</h1>
          <Link href="/blog" className="font-bold text-black hover:text-neutral-600">
            {t.blog.backToBlog}
          </Link>
        </div>
      </main>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: {
      "@type": "Person",
      name: "kasperzhang",
      url: "https://x.com/kasperzhang",
    },
    publisher: {
      "@type": "Person",
      name: "kasperzhang",
    },
    keywords: post.keywords.join(", "),
  };

  return (
    <main className="min-h-screen bg-[#FFF8E7]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-bold text-black hover:text-neutral-600 transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          {t.blog.backToBlog}
        </Link>

        <article className="bg-white border-2 border-black rounded-xl p-8 shadow-[4px_4px_0px_0px_#000] policy-content">
          <div className="flex items-center gap-3 text-xs text-neutral-400 mb-4">
            <time>{post.date}</time>
            <span>{post.readingTime} {t.blog.minRead}</span>
          </div>
          <h1 className="text-2xl font-black mb-6">
            {locale === "zh" ? post.titleZh : post.title}
          </h1>

          <BlogPostContent slug={slug} locale={locale} />
        </article>
      </div>
    </main>
  );
}
