"use client";

import * as React from "react";
import { format, parseISO } from "date-fns";
import { useGridSelection } from "@/hooks/use-grid-selection";
import { GridCell } from "./grid-cell";
import { generateTimeSlots, getSlotKey, generateTimeLabels } from "@/lib/utils/grid";
import type { TimeSlot } from "@/types";

function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
}

interface AvailabilityGridProps {
  dates: Date[];
  startTime: string;
  endTime: string;
  slotDurationMinutes: number;
  initialSelection?: Set<string>;
  onSelectionChange?: (selection: Set<string>) => void;
  readOnly?: boolean;
}

export function AvailabilityGrid({
  dates,
  startTime,
  endTime,
  slotDurationMinutes,
  initialSelection,
  onSelectionChange,
  readOnly = false,
}: AvailabilityGridProps) {
  const isMobile = useIsMobile();

  const slots = React.useMemo(
    () => generateTimeSlots(dates, startTime, endTime, slotDurationMinutes),
    [dates, startTime, endTime, slotDurationMinutes]
  );

  const timeLabels = React.useMemo(
    () => generateTimeLabels(startTime, endTime, slotDurationMinutes),
    [startTime, endTime, slotDurationMinutes]
  );

  const slotsByDate = React.useMemo(() => {
    const grouped = new Map<string, TimeSlot[]>();
    for (const slot of slots) {
      const existing = grouped.get(slot.dateStr) || [];
      existing.push(slot);
      grouped.set(slot.dateStr, existing);
    }
    return grouped;
  }, [slots]);

  const allCellIds = React.useMemo(
    () => slots.map((slot) => getSlotKey(slot)),
    [slots]
  );

  const {
    selectedCells,
    isSelecting,
    registerCell,
    handleMouseDown,
    handleMouseEnter,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    getCellState,
  } = useGridSelection({
    initialSelection,
    onSelectionChange,
    tapToToggle: isMobile,
  });

  React.useEffect(() => {
    if (!isSelecting) return;

    const handleGlobalMouseUp = () => handleMouseUp();
    window.addEventListener("mouseup", handleGlobalMouseUp);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("mouseup", handleGlobalMouseUp);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isSelecting, handleMouseUp, handleTouchEnd]);

  const sortedDates = React.useMemo(
    () => [...dates].sort((a, b) => a.getTime() - b.getTime()),
    [dates]
  );

  if (readOnly) {
    return (
      <div className="overflow-x-auto">
        <div
          className="grid gap-0 min-w-fit"
          style={{
            gridTemplateColumns: `80px repeat(${sortedDates.length}, minmax(60px, 1fr))`,
          }}
        >
          <div className="h-16" />
          {sortedDates.map((date) => (
            <div
              key={date.toISOString()}
              className="h-16 flex flex-col items-center justify-center text-xs font-medium border-b border-neutral-200"
            >
              <span className="text-neutral-500">
                {format(date, "EEE")}
              </span>
              <span>{format(date, "MMM d")}</span>
            </div>
          ))}

          {timeLabels.map((label, rowIndex) => (
            <React.Fragment key={label}>
              <div className="h-6 flex items-start justify-end pr-2 text-xs text-neutral-500 -translate-y-[30%]">
                {label}
              </div>
              {sortedDates.map((date) => {
                const dateStr = format(date, "yyyy-MM-dd");
                const slotsForDate = slotsByDate.get(dateStr) || [];
                const slot = slotsForDate[rowIndex];
                if (!slot) return <div key={`${dateStr}-${rowIndex}`} className="h-6" />;

                const cellId = getSlotKey(slot);
                const isSelected = selectedCells.has(cellId);

                return (
                  <div
                    key={cellId}
                    className={`h-6 border border-neutral-200 -ml-px -mt-px ${
                      isSelected ? "bg-emerald-500" : "bg-white"
                    }`}
                  />
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className="overflow-x-auto select-none"
      onTouchMove={(e) => handleTouchMove(e, allCellIds)}
    >
      <div
        className="grid gap-0 min-w-fit"
        style={{
          gridTemplateColumns: `80px repeat(${sortedDates.length}, minmax(60px, 1fr))`,
        }}
      >
        <div className="h-16" />
        {sortedDates.map((date) => (
          <div
            key={date.toISOString()}
            className="h-16 flex flex-col items-center justify-center text-xs font-medium border-b border-neutral-200"
          >
            <span className="text-neutral-500">{format(date, "EEE")}</span>
            <span>{format(date, "MMM d")}</span>
          </div>
        ))}

        {timeLabels.map((label, rowIndex) => (
          <React.Fragment key={label}>
            <div className="h-6 flex items-start justify-end pr-2 text-xs text-neutral-500 -translate-y-[30%]">
              {label}
            </div>
            {sortedDates.map((date) => {
              const dateStr = format(date, "yyyy-MM-dd");
              const slotsForDate = slotsByDate.get(dateStr) || [];
              const slot = slotsForDate[rowIndex];
              if (!slot) return <div key={`${dateStr}-${rowIndex}`} className="h-6" />;

              const cellId = getSlotKey(slot);

              return (
                <GridCell
                  key={cellId}
                  cellId={cellId}
                  state={getCellState(cellId)}
                  onMouseDown={handleMouseDown}
                  onMouseEnter={(id) => handleMouseEnter(id, allCellIds)}
                  onTouchStart={handleTouchStart}
                  registerCell={registerCell}
                />
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
