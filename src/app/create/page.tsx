"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CreateEventForm } from "@/components/event/create-event-form";
import { useLanguage } from "@/i18n";

export default function CreateEventPage() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-neutral-600 hover:text-neutral-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          {t.createEvent.backToHome}
        </Link>

        <h1 className="text-3xl font-bold mb-8">{t.createEvent.pageTitle}</h1>

        <CreateEventForm />
      </div>
    </main>
  );
}
