"use client";

import * as React from "react";
import Link from "next/link";
import { format } from "date-fns";
import { toast } from "sonner";
import { Copy, Users, Calendar, Clock, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { HeatmapGrid } from "@/components/availability/heatmap-grid";
import { ScheduleDialog } from "@/components/event/schedule-dialog";
import { ScheduledMeetingCard } from "@/components/event/scheduled-meeting-card";
import { getSlotKey, generateTimeSlots } from "@/lib/utils/grid";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/i18n";

interface ScheduledMeetingData {
  eventId: string;
  title: string;
  description: string | null;
  slots: string; // JSON string
  scheduledAt: Date;
}

interface EventViewProps {
  event: {
    id: string;
    title: string;
    description: string | null;
    timezone: string;
    dates: { date: string }[];
    timeConfig: {
      startTime: string;
      endTime: string;
      slotDurationMinutes: number;
    };
    participants: {
      id: string;
      name: string;
      availability: { slotStart: Date; slotEnd: Date }[];
    }[];
  };
  scheduledMeeting?: ScheduledMeetingData | null;
}

export function EventView({ event, scheduledMeeting }: EventViewProps) {
  const { t } = useLanguage();
  const [shareUrl, setShareUrl] = React.useState(`/event/${event.id}/respond`);
  const [highlightedParticipant, setHighlightedParticipant] = React.useState<string | null>(null);
  const [excludedParticipants, setExcludedParticipants] = React.useState<Set<string>>(new Set());
  const [showScheduleDialog, setShowScheduleDialog] = React.useState(false);
  const [selectedSlotKeys, setSelectedSlotKeys] = React.useState<string[]>([]);
  const [isDesktop, setIsDesktop] = React.useState(false);

  const toggleExcluded = (name: string) => {
    setExcludedParticipants((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  React.useEffect(() => {
    setShareUrl(`${window.location.origin}/event/${event.id}/respond`);
    const mq = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [event.id]);

  const dates = React.useMemo(
    () => event.dates.map((d) => new Date(d.date)),
    [event.dates]
  );

  const allSlots = React.useMemo(
    () =>
      generateTimeSlots(
        dates,
        event.timeConfig.startTime,
        event.timeConfig.endTime,
        event.timeConfig.slotDurationMinutes
      ),
    [dates, event.timeConfig]
  );

  const aggregatedData = React.useMemo(() => {
    const map = new Map<string, { participants: string[]; count: number }>();

    for (const slot of allSlots) {
      map.set(getSlotKey(slot), { participants: [], count: 0 });
    }

    for (const participant of event.participants) {
      for (const avail of participant.availability) {
        const slotStart = new Date(avail.slotStart);
        const dateStr = format(slotStart, "yyyy-MM-dd");
        const timeStr = format(slotStart, "HH:mm");
        const key = `${dateStr}-${timeStr}`;

        const existing = map.get(key);
        if (existing) {
          existing.participants.push(participant.name);
          existing.count++;
        }
      }
    }

    return map;
  }, [event, allSlots]);

  const copyShareLink = () => {
    const url = `${window.location.origin}/event/${event.id}/respond`;
    navigator.clipboard.writeText(url);
    toast.success(t.eventView.linkCopied);
  };

  const sortedDates = [...dates].sort((a, b) => a.getTime() - b.getTime());
  const dateRange =
    sortedDates.length > 1
      ? `${format(sortedDates[0], "MMM d")} - ${format(sortedDates[sortedDates.length - 1], "MMM d, yyyy")}`
      : format(sortedDates[0], "MMM d, yyyy");

  // Convert selected slot keys to { slotStart, slotEnd } for the dialog
  const selectedSlotsForDialog = React.useMemo(() => {
    return allSlots
      .filter((slot) => selectedSlotKeys.includes(getSlotKey(slot)))
      .map((slot) => ({
        slotStart: slot.start.toISOString(),
        slotEnd: slot.end.toISOString(),
      }));
  }, [selectedSlotKeys, allSlots]);

  const handleSlotsSelected = (slotKeys: string[]) => {
    setSelectedSlotKeys(slotKeys);
  };

  const handleScheduleClick = () => {
    if (selectedSlotKeys.length > 0) {
      setShowScheduleDialog(true);
    }
  };

  // Parse scheduled meeting slots
  const parsedScheduledMeeting = React.useMemo(() => {
    if (!scheduledMeeting) return null;
    try {
      const slots = JSON.parse(scheduledMeeting.slots) as { slotStart: string; slotEnd: string }[];
      return {
        title: scheduledMeeting.title,
        description: scheduledMeeting.description,
        slots,
        scheduledAt: scheduledMeeting.scheduledAt,
      };
    } catch {
      return null;
    }
  }, [scheduledMeeting]);

  // If meeting is scheduled, show the card
  if (parsedScheduledMeeting) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">{event.title}</CardTitle>
                {event.description && (
                  <CardDescription className="mt-2">
                    {event.description}
                  </CardDescription>
                )}
              </div>
              <Button variant="outline" size="sm" onClick={copyShareLink}>
                <Share2 className="h-4 w-4 mr-2" />
                {t.eventView.share}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 text-sm text-neutral-600">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{dateRange}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>
                  {event.timeConfig.startTime} - {event.timeConfig.endTime}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>
                  {event.participants.length}{" "}
                  {event.participants.length === 1
                    ? t.eventView.participant
                    : t.eventView.participants_plural}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <ScheduledMeetingCard
          title={parsedScheduledMeeting.title}
          description={parsedScheduledMeeting.description}
          slots={parsedScheduledMeeting.slots}
          scheduledAt={parsedScheduledMeeting.scheduledAt}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{event.title}</CardTitle>
              {event.description && (
                <CardDescription className="mt-2">
                  {event.description}
                </CardDescription>
              )}
            </div>
            <Button variant="outline" size="sm" onClick={copyShareLink}>
              <Share2 className="h-4 w-4 mr-2" />
              {t.eventView.share}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 text-sm text-neutral-600">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{dateRange}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>
                {event.timeConfig.startTime} - {event.timeConfig.endTime}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>
                {event.participants.length}{" "}
                {event.participants.length === 1
                  ? t.eventView.participant
                  : t.eventView.participants_plural}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-[1fr_250px]">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>{t.eventView.groupAvailability}</CardTitle>
                <CardDescription>
                  {isDesktop && event.participants.length > 0
                    ? t.eventView.selectSlotsToSchedule
                    : t.eventView.hoverToSee}
                </CardDescription>
              </div>
              {isDesktop && (
                <div className="relative group">
                  <button
                    disabled={selectedSlotKeys.length === 0}
                    onClick={handleScheduleClick}
                    className={cn(
                      "px-4 py-2 rounded-lg font-bold text-sm transition-all whitespace-nowrap border-2",
                      selectedSlotKeys.length > 0
                        ? "bg-[#FFE500] border-black shadow-[3px_3px_0px_0px_#000] hover:shadow-[1px_1px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px]"
                        : "bg-neutral-200 text-neutral-400 border-transparent cursor-not-allowed"
                    )}
                  >
                    {t.eventView.scheduleMeeting}
                    {selectedSlotKeys.length > 0 && ` (${selectedSlotKeys.length})`}
                  </button>
                  {selectedSlotKeys.length === 0 && (
                    <div className="absolute right-0 top-full mt-2 px-3 py-1.5 bg-neutral-800 text-white text-xs rounded-md whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity">
                      {t.eventView.selectSlotsHint}
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {event.participants.length === 0 ? (
              <div className="text-center py-8 text-neutral-500">
                <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>{t.eventView.noResponses}</p>
                <p className="text-sm mt-1">
                  {t.eventView.shareToCollect}
                </p>
              </div>
            ) : (
              <HeatmapGrid
                dates={dates}
                startTime={event.timeConfig.startTime}
                endTime={event.timeConfig.endTime}
                slotDurationMinutes={event.timeConfig.slotDurationMinutes}
                aggregatedData={aggregatedData}
                totalParticipants={event.participants.length}
                highlightedParticipant={highlightedParticipant}
                excludedParticipants={excludedParticipants}
                selectable={isDesktop}
                onSlotsSelected={handleSlotsSelected}
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t.eventView.participants}</CardTitle>
          </CardHeader>
          <CardContent>
            {event.participants.length === 0 ? (
              <p className="text-sm text-neutral-500">{t.eventView.noParticipants}</p>
            ) : (
              <ul className="space-y-2">
                {event.participants.map((participant) => {
                  const isExcluded = excludedParticipants.has(participant.name);
                  return (
                    <li
                      key={participant.id}
                      className={cn(
                        "flex items-center justify-between text-sm rounded-lg px-2 py-1 -mx-2 cursor-pointer transition-colors",
                        isExcluded
                          ? "opacity-40 line-through"
                          : "hover:bg-[#FFE500]/30"
                      )}
                      onMouseEnter={() => !isExcluded && setHighlightedParticipant(participant.name)}
                      onMouseLeave={() => setHighlightedParticipant(null)}
                      onClick={() => toggleExcluded(participant.name)}
                    >
                      <span>{participant.name}</span>
                      <Link
                        href={`/event/${event.id}/respond?participantId=${participant.id}`}
                        className="text-neutral-500 hover:text-neutral-900"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {t.eventView.edit}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}

            <div className="mt-6">
              <Button asChild className="w-full">
                <Link href={`/event/${event.id}/respond`}>
                  {t.eventView.addYourAvailability}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-sm text-neutral-600">
            <Copy className="h-4 w-4" />
            <span>{t.eventView.shareThisLink}</span>
          </div>
          <div className="mt-2 flex gap-2">
            <code className="flex-1 px-3 py-2 bg-neutral-100 rounded-md text-sm overflow-x-auto">
              {shareUrl}
            </code>
            <Button variant="outline" size="sm" onClick={copyShareLink}>
              {t.eventView.copy}
            </Button>
          </div>
        </CardContent>
      </Card>

      {showScheduleDialog && selectedSlotsForDialog.length > 0 && (
        <ScheduleDialog
          eventId={event.id}
          defaultTitle={event.title}
          defaultDescription={event.description || ""}
          selectedSlots={selectedSlotsForDialog}
          onClose={() => setShowScheduleDialog(false)}
          onScheduled={() => {
            setShowScheduleDialog(false);
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}
