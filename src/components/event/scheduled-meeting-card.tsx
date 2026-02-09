"use client";

import { format } from "date-fns";
import { CalendarCheck } from "lucide-react";
import { useLanguage } from "@/i18n";

interface ScheduledMeetingCardProps {
  title: string;
  description: string | null;
  slots: { slotStart: string; slotEnd: string }[];
  scheduledAt: Date;
}

export function ScheduledMeetingCard({
  title,
  description,
  slots,
  scheduledAt,
}: ScheduledMeetingCardProps) {
  const { t } = useLanguage();

  // Sort slots by start time
  const sortedSlots = [...slots].sort(
    (a, b) => new Date(a.slotStart).getTime() - new Date(b.slotStart).getTime()
  );

  // Group consecutive slots by date for display
  const slotsByDate = new Map<string, { slotStart: string; slotEnd: string }[]>();
  for (const slot of sortedSlots) {
    const dateStr = format(new Date(slot.slotStart), "yyyy-MM-dd");
    const existing = slotsByDate.get(dateStr) || [];
    existing.push(slot);
    slotsByDate.set(dateStr, existing);
  }

  return (
    <div className="border-3 border-black rounded-2xl shadow-[6px_6px_0px_0px_#000] bg-white overflow-hidden">
      <div className="bg-[#03A48C] px-6 py-4 flex items-center gap-3">
        <CalendarCheck className="h-8 w-8 text-white" />
        <div>
          <h2 className="text-xl font-bold text-white">
            {t.eventView.meetingScheduled}
          </h2>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-lg font-bold">{title}</h3>
          {description && (
            <p className="text-neutral-600 text-sm mt-1">{description}</p>
          )}
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium text-neutral-500">
            {t.eventView.scheduledFor}
          </p>
          {Array.from(slotsByDate.entries()).map(([dateStr, dateSlots]) => {
            const date = new Date(dateSlots[0].slotStart);
            const firstStart = new Date(dateSlots[0].slotStart);
            const lastEnd = new Date(dateSlots[dateSlots.length - 1].slotEnd);

            return (
              <div
                key={dateStr}
                className="flex items-center gap-3 bg-[#F3FFFD] border-2 border-[#03A48C] rounded-lg px-4 py-3"
              >
                <div className="text-center min-w-[50px]">
                  <div className="text-xs font-medium text-neutral-500">
                    {format(date, "EEE")}
                  </div>
                  <div className="text-lg font-bold">
                    {format(date, "d")}
                  </div>
                  <div className="text-xs text-neutral-500">
                    {format(date, "MMM")}
                  </div>
                </div>
                <div className="border-l-2 border-[#03A48C] pl-3">
                  <div className="font-medium">
                    {format(firstStart, "h:mm a")} - {format(lastEnd, "h:mm a")}
                  </div>
                  <div className="text-xs text-neutral-500">
                    {dateSlots.length} slot(s)
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-xs text-neutral-400">
          {t.eventView.scheduledFor} {format(new Date(scheduledAt), "MMM d, yyyy 'at' h:mm a")}
        </p>
      </div>
    </div>
  );
}
