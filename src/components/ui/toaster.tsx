"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast:
            "group toast bg-white text-neutral-950 border-neutral-200 shadow-lg",
          description: "text-neutral-500",
          actionButton: "bg-neutral-900 text-neutral-50",
          cancelButton: "bg-neutral-100 text-neutral-500",
        },
      }}
    />
  );
}
