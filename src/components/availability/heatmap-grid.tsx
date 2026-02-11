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
  selectable?: boolean;
  onSlotsSelected?: (slots: string[]) => void;
}

// Interpolate between two hex colors; t in [0, 1]
function lerpColor(a: string, b: string, t: number): string {
  const parse = (hex: string) => [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
  const [r1, g1, b1] = parse(a);
  const [r2, g2, b2] = parse(b);
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const bl = Math.round(b1 + (b2 - b1) * t);
  return `#${((1 << 24) | (r << 16) | (g << 8) | bl).toString(16).slice(1)}`;
}

// Generate a color for count out of total, interpolating from light teal to dark teal
function getHeatmapColorHex(count: number, total: number): string {
  if (count === 0 || total === 0) return "#FFFFFF";
  // t goes from 0 (count=1) to 1 (count=total)
  const t = total === 1 ? 1 : (count - 1) / (total - 1);
  return lerpColor("#D4F5EF", "#03A48C", t);
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
  selectable = false,
  onSlotsSelected,
}: HeatmapGridProps) {
  const [hoveredSlot, setHoveredSlot] = React.useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = React.useState({ x: 0, y: 0 });

  // Drag selection state
  const [selectedSlots, setSelectedSlots] = React.useState<Set<string>>(new Set());
  const [isSelecting, setIsSelecting] = React.useState(false);
  const [dragStart, setDragStart] = React.useState<{ dateIdx: number; rowIdx: number } | null>(null);
  const [dragEnd, setDragEnd] = React.useState<{ dateIdx: number; rowIdx: number } | null>(null);

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

  // Generate legend colors: one swatch per count level (0 through effectiveTotal)
  const legendColors = React.useMemo(() => {
    const colors: string[] = [getHeatmapColorHex(0, effectiveTotal)];
    for (let i = 1; i <= effectiveTotal; i++) {
      colors.push(getHeatmapColorHex(i, effectiveTotal));
    }
    return colors;
  }, [effectiveTotal]);

  // Compute cells in drag rectangle
  const dragSelectedCells = React.useMemo(() => {
    if (!selectable || !dragStart || !dragEnd) return new Set<string>();
    const minDate = Math.min(dragStart.dateIdx, dragEnd.dateIdx);
    const maxDate = Math.max(dragStart.dateIdx, dragEnd.dateIdx);
    const minRow = Math.min(dragStart.rowIdx, dragEnd.rowIdx);
    const maxRow = Math.max(dragStart.rowIdx, dragEnd.rowIdx);

    const cells = new Set<string>();
    for (let d = minDate; d <= maxDate; d++) {
      const dateStr = format(sortedDates[d], "yyyy-MM-dd");
      const slotsForDate = slotsByDate.get(dateStr) || [];
      for (let r = minRow; r <= maxRow; r++) {
        const slot = slotsForDate[r];
        if (slot) cells.add(getSlotKey(slot));
      }
    }
    return cells;
  }, [selectable, dragStart, dragEnd, sortedDates, slotsByDate]);

  // Determine if current drag would deselect (all dragged cells are already selected)
  const isDragDeselecting = React.useMemo(() => {
    if (dragSelectedCells.size === 0) return false;
    return [...dragSelectedCells].every((c) => selectedSlots.has(c));
  }, [dragSelectedCells, selectedSlots]);

  const handleCellMouseDown = (e: React.MouseEvent, dateIdx: number, rowIdx: number) => {
    if (!selectable) return;
    e.preventDefault();
    setIsSelecting(true);
    setDragStart({ dateIdx, rowIdx });
    setDragEnd({ dateIdx, rowIdx });
  };

  const handleCellMouseEnterSelection = (dateIdx: number, rowIdx: number) => {
    if (!selectable || !isSelecting) return;
    setDragEnd({ dateIdx, rowIdx });
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!selectable || !isSelecting) return;
    setIsSelecting(false);
    if (dragSelectedCells.size > 0) {
      const newSelected = new Set(selectedSlots);
      // Toggle: if all drag cells are already selected, deselect them
      const allAlreadySelected = [...dragSelectedCells].every((c) => selectedSlots.has(c));
      if (allAlreadySelected) {
        for (const c of dragSelectedCells) newSelected.delete(c);
      } else {
        for (const c of dragSelectedCells) newSelected.add(c);
      }
      setSelectedSlots(newSelected);
      onSlotsSelected?.(Array.from(newSelected));
    }
    setDragStart(null);
    setDragEnd(null);
  };

  const handleMouseEnter = (e: React.MouseEvent, cellId: string) => {
    if (!isSelecting) {
      setHoveredSlot(cellId);
      setTooltipPosition({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isSelecting) {
      setTooltipPosition({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseLeave = () => {
    setHoveredSlot(null);
  };

  const hoveredData = hoveredSlot ? effectiveData.get(hoveredSlot) : null;

  return (
    <div className="relative">
      <div
        className="overflow-x-auto select-none"
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
          if (isSelecting) {
            setIsSelecting(false);
            setDragStart(null);
            setDragEnd(null);
          }
        }}
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
              {sortedDates.map((date, dateIndex) => {
                const dateStr = format(date, "yyyy-MM-dd");
                const slotsForDate = slotsByDate.get(dateStr) || [];
                const slot = slotsForDate[rowIndex];
                if (!slot) return <div key={`${dateStr}-${rowIndex}`} className="h-6" />;

                const cellId = getSlotKey(slot);
                const data = effectiveData.get(cellId);
                const count = data?.count || 0;
                const heatmapHex = getHeatmapColorHex(count, effectiveTotal);

                const isHighlighted =
                  highlightedParticipant &&
                  data?.participants.includes(highlightedParticipant);

                const isSelected = selectedSlots.has(cellId);
                const isDragSelected = dragSelectedCells.has(cellId);

                // Determine if this cell uses inline heatmap color
                const useInlineColor =
                  !isSelected &&
                  !(isDragSelected && isSelecting) &&
                  !isHighlighted;

                return (
                  <div
                    key={cellId}
                    className={cn(
                      "h-6 border -ml-px -mt-px cursor-pointer transition-all",
                      isSelected && isDragSelected && isSelecting && isDragDeselecting
                        ? "bg-[#E0F5F0] border-[#03A48C] z-10 relative"
                        : isSelected
                          ? "bg-[#FFE500] border-[#D4A800] z-10 relative"
                          : isDragSelected && isSelecting
                            ? "bg-[#FEF3C7] border-[#D4A800] z-10 relative"
                            : isHighlighted
                              ? "bg-[#FFE500] border-black"
                              : "border-black",
                      hoveredSlot === cellId && !isSelecting && !isSelected && "ring-2 ring-[#FFE500] ring-offset-1 z-10 relative"
                    )}
                    style={useInlineColor ? { backgroundColor: heatmapHex } : undefined}
                    onMouseEnter={(e) => {
                      handleMouseEnter(e, cellId);
                      handleCellMouseEnterSelection(dateIndex, rowIndex);
                    }}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    onMouseDown={(e) => handleCellMouseDown(e, dateIndex, rowIndex)}
                  />
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      {hoveredSlot && hoveredData && !isSelecting && (
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
          {legendColors.map((color, i) => (
            <div
              key={i}
              className="w-4 h-4 border border-black rounded-sm"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <span>More</span>
      </div>

    </div>
  );
}
