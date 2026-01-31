"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface GridCellProps {
  cellId: string;
  state: "selected" | "pending-select" | "pending-deselect" | "none";
  onMouseDown: (cellId: string) => void;
  onMouseEnter: (cellId: string) => void;
  onTouchStart: (cellId: string, e: React.TouchEvent) => void;
  registerCell: (cellId: string, rect: DOMRect) => void;
}

export const GridCell = React.memo(function GridCell({
  cellId,
  state,
  onMouseDown,
  onMouseEnter,
  onTouchStart,
  registerCell,
}: GridCellProps) {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (ref.current) {
      registerCell(cellId, ref.current.getBoundingClientRect());
    }
  }, [cellId, registerCell]);

  React.useEffect(() => {
    const handleResize = () => {
      if (ref.current) {
        registerCell(cellId, ref.current.getBoundingClientRect());
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [cellId, registerCell]);

  return (
    <div
      ref={ref}
      className={cn(
        "h-6 border border-neutral-200 cursor-pointer transition-colors select-none",
        state === "selected" && "bg-emerald-500",
        state === "pending-select" && "bg-emerald-300",
        state === "pending-deselect" && "bg-red-200",
        state === "none" && "bg-white hover:bg-neutral-100"
      )}
      onMouseDown={() => onMouseDown(cellId)}
      onMouseEnter={() => onMouseEnter(cellId)}
      onTouchStart={(e) => onTouchStart(cellId, e)}
    />
  );
});
