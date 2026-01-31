"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CalendarX } from "lucide-react";
import { useLanguage } from "@/i18n";

export function NotFoundContent() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-neutral-50 flex items-center justify-center">
      <div className="text-center px-4">
        <CalendarX className="h-16 w-16 mx-auto text-neutral-400 mb-6" />
        <h1 className="text-3xl font-bold mb-2">{t.notFound.title}</h1>
        <p className="text-neutral-600 mb-8 max-w-md">
          {t.notFound.description}
        </p>
        <Button asChild>
          <Link href="/">{t.notFound.goToHome}</Link>
        </Button>
      </div>
    </main>
  );
}
