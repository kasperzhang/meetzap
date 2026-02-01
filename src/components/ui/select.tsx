import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          className={cn(
            "flex h-10 w-full appearance-none rounded-lg border-2 border-black bg-white px-3 py-2 text-sm shadow-[3px_3px_0px_0px_#000] transition-all focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[1px_1px_0px_0px_#000] focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 pointer-events-none" />
      </div>
    );
  }
);
Select.displayName = "Select";

export { Select };
