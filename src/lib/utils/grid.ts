import {
  format,
  parse,
  addMinutes,
  isBefore,
  isEqual,
  parseISO,
  startOfDay,
  setHours,
  setMinutes,
} from "date-fns";
import type { TimeSlot } from "@/types";

export function generateTimeSlots(
  dates: Date[],
  startTime: string,
  endTime: string,
  slotDurationMinutes: number
): TimeSlot[] {
  const slots: TimeSlot[] = [];

  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);

  for (const date of dates) {
    let current = setMinutes(setHours(startOfDay(date), startHour), startMinute);
    const end = setMinutes(setHours(startOfDay(date), endHour), endMinute);

    while (isBefore(current, end) || isEqual(current, end)) {
      const slotEnd = addMinutes(current, slotDurationMinutes);
      if (isBefore(slotEnd, end) || isEqual(slotEnd, end)) {
        slots.push({
          start: current,
          end: slotEnd,
          dateStr: format(current, "yyyy-MM-dd"),
          timeStr: format(current, "HH:mm"),
        });
      }
      current = slotEnd;
    }
  }

  return slots;
}

export function getSlotKey(slot: TimeSlot): string {
  return `${slot.dateStr}-${slot.timeStr}`;
}

export function parseSlotKey(key: string): { date: string; time: string } {
  const [date, time] = key.split("-");
  return { date, time };
}

export function generateTimeLabels(
  startTime: string,
  endTime: string,
  slotDurationMinutes: number
): string[] {
  const labels: string[] = [];
  const baseDate = new Date();

  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);

  let current = setMinutes(setHours(startOfDay(baseDate), startHour), startMinute);
  const end = setMinutes(setHours(startOfDay(baseDate), endHour), endMinute);

  while (isBefore(current, end)) {
    labels.push(format(current, "h:mm a"));
    current = addMinutes(current, slotDurationMinutes);
  }

  return labels;
}

export function groupSlotsByDate(
  slots: TimeSlot[]
): Map<string, TimeSlot[]> {
  const grouped = new Map<string, TimeSlot[]>();

  for (const slot of slots) {
    const existing = grouped.get(slot.dateStr) || [];
    existing.push(slot);
    grouped.set(slot.dateStr, existing);
  }

  return grouped;
}

export function slotsToAvailability(
  selectedSlots: Set<string>,
  allSlots: TimeSlot[]
): { slotStart: string; slotEnd: string }[] {
  return allSlots
    .filter((slot) => selectedSlots.has(getSlotKey(slot)))
    .map((slot) => ({
      slotStart: slot.start.toISOString(),
      slotEnd: slot.end.toISOString(),
    }));
}

export function availabilityToSlotKeys(
  availability: { slotStart: Date; slotEnd: Date }[]
): Set<string> {
  const keys = new Set<string>();

  for (const slot of availability) {
    const dateStr = format(slot.slotStart, "yyyy-MM-dd");
    const timeStr = format(slot.slotStart, "HH:mm");
    keys.add(`${dateStr}-${timeStr}`);
  }

  return keys;
}
