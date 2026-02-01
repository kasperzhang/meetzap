"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CreateEventForm } from "@/components/event/create-event-form";
import { useLanguage } from "@/i18n";

export default function CreateEventPage() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-[#FFF8E7]">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-bold text-black hover:text-neutral-700 mb-6 border-2 border-black bg-white px-3 py-1.5 rounded-lg shadow-[2px_2px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000] transition-all"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          {t.createEvent.backToHome}
        </Link>

        <h1 className="text-3xl font-black mb-8 text-black">{t.createEvent.pageTitle}</h1>

        <CreateEventForm />
      </div>
    </main>
  );
}
