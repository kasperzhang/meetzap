"use client";

import Link from "next/link";
import { LanguageSwitch } from "./language-switch";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold text-emerald-600">MeetZap</span>
        </Link>
        <LanguageSwitch />
      </div>
    </header>
  );
}
