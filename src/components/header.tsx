"use client";

import Link from "next/link";
import { LanguageSwitch } from "./language-switch";
import { Zap } from "lucide-react";
import { useLanguage } from "@/i18n";

export function Header() {
  const { t } = useLanguage();

  return (
    <header className="w-full pt-4">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="h-10 w-10 bg-[#FFE500] border-2 border-black rounded-lg shadow-[3px_3px_0px_0px_#000] flex items-center justify-center group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:shadow-[1px_1px_0px_0px_#000] transition-all">
            <Zap className="h-6 w-6 text-black fill-black" />
          </div>
          <span className="text-2xl font-black text-black">
            Meet<span className="text-[#FF6B6B]">Zap</span>
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/blog"
            className="text-sm font-bold text-black hover:text-neutral-600 transition-colors"
          >
            {t.nav.blog}
          </Link>
          <LanguageSwitch />
        </div>
      </div>
    </header>
  );
}
