"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/i18n";

interface BackLinkProps {
  href: string;
  type: "home" | "event";
}

export function BackLink({ href, type }: BackLinkProps) {
  const { t } = useLanguage();

  const text = type === "home"
    ? t.eventView.backToHome
    : t.participantForm.backToEvent;

  return (
    <Link
      href={href}
      className="inline-flex items-center text-sm text-neutral-600 hover:text-neutral-900 mb-6"
    >
      <ArrowLeft className="h-4 w-4 mr-1" />
      {text}
    </Link>
  );
}
