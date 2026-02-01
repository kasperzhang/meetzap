"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useLanguage } from "@/i18n";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const { t } = useLanguage();

  useEffect(() => {
    console.error("Error:", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-[#FFF8E7] flex items-center justify-center">
      <div className="text-center px-4">
        <div className="h-20 w-20 bg-[#FF6B6B] border-2 border-black rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[4px_4px_0px_0px_#000]">
          <AlertCircle className="h-10 w-10 text-black" />
        </div>
        <h1 className="text-3xl font-black mb-2 text-black">{t.errors.somethingWentWrong}</h1>
        <p className="text-neutral-700 mb-8 max-w-md font-medium">
          {t.errors.unexpectedError}
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={reset}>{t.errors.tryAgain}</Button>
          <Button variant="outline" onClick={() => (window.location.href = "/")}>
            {t.errors.goToHome}
          </Button>
        </div>
      </div>
    </main>
  );
}
