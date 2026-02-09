"use client";

import * as React from "react";
import { format } from "date-fns";
import { generateTimeSlots, getSlotKey, generateTimeLabels } from "@/lib/utils/grid";
import type { TimeSlot } from "@/types";
import { cn } from "@/lib/utils";

interface HeatmapGridProps {
  dates: Date[];
  startTime: string;
  endTime: string;
  slotDurationMinutes: number;
  aggregatedData: Map<string, { participants: string[]; count: number }>;
  totalParticipants: number;
  highlightedParticipant?: string | null;
  excludedParticipants?: Set<string>;
}

function getHeatmapColor(count: number, total: number): string {
  if (count === 0 || total === 0) return "bg-white";

  const ratio = count / total;

  if (ratio === 1) return "bg-[#0d9488]";
  if (ratio >= 0.75) return "bg-[#14b8a6]";
  if (ratio >= 0.5) return "bg-[#2dd4bf]";
  if (ratio >= 0.25) return "bg-[#5eead4]";
  return "bg-[#99f6e4]";
}

export function HeatmapGrid({
  dates,
  startTime,
  endTime,
  slotDurationMinutes,
  aggregatedData,
  totalParticipants,
  highlightedParticipant,
  excludedParticipants,
}: HeatmapGridProps) {
  const [hoveredSlot, setHoveredSlot] = React.useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = React.useState({ x: 0, y: 0 });

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

  const sortedDates = React.useMemo(
    () => [...dates].sort((a, b) => a.getTime() - b.getTime()),
    [dates]
  );

  const effectiveData = React.useMemo(() => {
    if (!excludedParticipants || excludedParticipants.size === 0) return aggregatedData;

    const filtered = new Map<string, { participants: string[]; count: number }>();
    for (const [key, value] of aggregatedData) {
      const remaining = value.participants.filter((p) => !excludedParticipants.has(p));
      filtered.set(key, { participants: remaining, count: remaining.length });
    }
    return filtered;
  }, [aggregatedData, excludedParticipants]);

  const effectiveTotal = React.useMemo(() => {
    if (!excludedParticipants) return totalParticipants;
    return totalParticipants - excludedParticipants.size;
  }, [totalParticipants, excludedParticipants]);

  const handleMouseEnter = (e: React.MouseEvent, cellId: string) => {
    setHoveredSlot(cellId);
    setTooltipPosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setTooltipPosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseLeave = () => {
    setHoveredSlot(null);
  };

  const hoveredData = hoveredSlot ? effectiveData.get(hoveredSlot) : null;

  return (
    <div className="relative">
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
              className="h-16 flex flex-col items-center justify-center text-xs font-medium border-b border-black"
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
                const data = effectiveData.get(cellId);
                const count = data?.count || 0;
                const colorClass = getHeatmapColor(count, effectiveTotal);

                const isHighlighted =
                  highlightedParticipant &&
                  data?.participants.includes(highlightedParticipant);

                return (
                  <div
                    key={cellId}
                    className={cn(
                      "h-6 border border-black -ml-px -mt-px cursor-pointer transition-all",
                      isHighlighted ? "bg-[#FFE500]" : colorClass,
                      hoveredSlot === cellId && "ring-2 ring-[#FFE500] ring-offset-1"
                    )}
                    onMouseEnter={(e) => handleMouseEnter(e, cellId)}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                  />
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      {hoveredSlot && hoveredData && (
        <div
          className="fixed z-50 bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_#000] p-3 text-sm pointer-events-none"
          style={{
            left: tooltipPosition.x + 10,
            top: tooltipPosition.y + 10,
          }}
        >
          <div className="font-bold mb-1">
            {hoveredData.count} / {effectiveTotal} available
          </div>
          {hoveredData.participants.length > 0 && (
            <ul className="text-neutral-600 text-xs space-y-0.5">
              {hoveredData.participants.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="mt-4 flex items-center gap-2 text-xs font-medium text-black">
        <span>Fewer</span>
        <div className="flex gap-0.5">
          <div className="w-4 h-4 bg-white border border-black rounded-sm" />
          <div className="w-4 h-4 bg-[#99f6e4] border border-black rounded-sm" />
          <div className="w-4 h-4 bg-[#5eead4] border border-black rounded-sm" />
          <div className="w-4 h-4 bg-[#2dd4bf] border border-black rounded-sm" />
          <div className="w-4 h-4 bg-[#14b8a6] border border-black rounded-sm" />
          <div className="w-4 h-4 bg-[#0d9488] border border-black rounded-sm" />
        </div>
        <span>More</span>
      </div>
    </div>
  );
}
