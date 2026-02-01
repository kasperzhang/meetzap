"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CalendarX } from "lucide-react";
import { useLanguage } from "@/i18n";

export function NotFoundContent() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-[#FFF8E7] flex items-center justify-center">
      <div className="text-center px-4">
        <div className="h-20 w-20 bg-[#FFB347] border-2 border-black rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[4px_4px_0px_0px_#000]">
          <CalendarX className="h-10 w-10 text-black" />
        </div>
        <h1 className="text-3xl font-black mb-2 text-black">{t.notFound.title}</h1>
        <p className="text-neutral-700 mb-8 max-w-md font-medium">
          {t.notFound.description}
        </p>
        <Button asChild>
          <Link href="/">{t.notFound.goToHome}</Link>
        </Button>
      </div>
    </main>
  );
}
