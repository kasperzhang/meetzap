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
    <main className="min-h-screen bg-neutral-50 flex items-center justify-center">
      <div className="text-center px-4">
        <AlertCircle className="h-16 w-16 mx-auto text-red-500 mb-6" />
        <h1 className="text-3xl font-bold mb-2">{t.errors.somethingWentWrong}</h1>
        <p className="text-neutral-600 mb-8 max-w-md">
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
