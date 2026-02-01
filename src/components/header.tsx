"use client";

import Link from "next/link";
import { LanguageSwitch } from "./language-switch";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b-4 border-black bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-black text-black">MeetZap</span>
        </Link>
        <LanguageSwitch />
      </div>
    </header>
  );
}
