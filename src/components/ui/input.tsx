import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-lg border-2 border-black bg-white px-3 py-2 text-sm shadow-[3px_3px_0px_0px_#000] transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[1px_1px_0px_0px_#000] focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
