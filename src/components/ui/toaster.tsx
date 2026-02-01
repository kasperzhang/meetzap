"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast:
            "group toast bg-white text-black border-2 border-black shadow-[4px_4px_0px_0px_#000] rounded-xl",
          description: "text-neutral-600",
          actionButton:
            "bg-[#FFE500] text-black border-2 border-black font-bold shadow-[2px_2px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000]",
          cancelButton:
            "bg-white text-black border-2 border-black font-bold shadow-[2px_2px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000]",
          error: "bg-[#FF6B6B] border-2 border-black",
          success: "bg-[#A8E6CF] border-2 border-black",
          warning: "bg-[#FFB347] border-2 border-black",
        },
      }}
    />
  );
}
