import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-lg border-2 border-black bg-white px-3 py-2 text-sm shadow-[3px_3px_0px_0px_#000] transition-all placeholder:text-neutral-500 focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[1px_1px_0px_0px_#000] focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
