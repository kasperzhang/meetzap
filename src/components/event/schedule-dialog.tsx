"use client";

import * as React from "react";
import { useLanguage } from "@/i18n";

interface ScheduleDialogProps {
  eventId: string;
  defaultTitle: string;
  defaultDescription: string;
  selectedSlots: { slotStart: string; slotEnd: string }[];
  onClose: () => void;
  onScheduled: () => void;
}

export function ScheduleDialog({
  eventId,
  defaultTitle,
  defaultDescription,
  selectedSlots,
  onClose,
  onScheduled,
}: ScheduleDialogProps) {
  const { t } = useLanguage();
  const [title, setTitle] = React.useState(defaultTitle);
  const [description, setDescription] = React.useState(defaultDescription);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async () => {
    if (!title.trim()) return;
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/events/${eventId}/schedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || undefined,
          slots: selectedSlots,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to schedule meeting");
      }

      onScheduled();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white border-3 border-black rounded-2xl shadow-[6px_6px_0px_0px_#000] p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-bold mb-4">{t.eventView.scheduleMeeting}</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              {t.eventView.meetingTitle}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              className="w-full px-3 py-2 border-2 border-black rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FFE500]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              {t.eventView.meetingDescription}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
              rows={3}
              className="w-full px-3 py-2 border-2 border-black rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FFE500] resize-none"
            />
          </div>

          <div className="bg-[#FEF3C7] border-2 border-[#F59E0B] rounded-lg p-3 text-sm text-neutral-700">
            {t.eventView.scheduleWarning}
          </div>

          <div className="text-sm text-neutral-500">
            {selectedSlots.length} time slot(s) selected
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-2">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !title.trim()}
              className="flex-1 px-4 py-2 bg-[#FFE500] border-2 border-black rounded-lg font-bold text-sm shadow-[3px_3px_0px_0px_#000] hover:shadow-[1px_1px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "..." : t.eventView.confirmSchedule}
            </button>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 border-2 border-black rounded-lg text-sm font-medium hover:bg-neutral-100 transition-colors"
            >
              {t.eventView.cancel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
