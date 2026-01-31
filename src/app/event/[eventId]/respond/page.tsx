import { notFound } from "next/navigation";
import { getEvent, getParticipant } from "@/lib/db/queries";
import { ParticipantForm } from "@/components/event/participant-form";
import { BackLink } from "@/components/back-link";

interface RespondPageProps {
  params: Promise<{ eventId: string }>;
  searchParams: Promise<{ participantId?: string }>;
}

export async function generateMetadata({ params }: RespondPageProps) {
  const { eventId } = await params;

  try {
    const event = await getEvent(eventId);
    if (!event) return { title: "Event Not Found" };

    return {
      title: `Respond - ${event.title} - MeetZap`,
      description: "Mark your availability for this event",
    };
  } catch {
    return { title: "Respond - MeetZap" };
  }
}

export default async function RespondPage({ params, searchParams }: RespondPageProps) {
  const { eventId } = await params;
  const { participantId } = await searchParams;

  let event;
  try {
    event = await getEvent(eventId);
  } catch (error) {
    console.error("Error fetching event:", error);
    notFound();
  }

  if (!event || !event.timeConfig) {
    notFound();
  }

  let existingParticipant;
  if (participantId) {
    try {
      existingParticipant = await getParticipant(participantId);
      if (existingParticipant && existingParticipant.eventId !== eventId) {
        existingParticipant = undefined;
      }
    } catch (error) {
      console.error("Error fetching participant:", error);
    }
  }

  const dates = event.dates.map((d) => new Date(d.date));

  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <BackLink href={`/event/${eventId}`} type="event" />

        <ParticipantForm
          eventId={eventId}
          eventTitle={event.title}
          dates={dates}
          startTime={event.timeConfig.startTime}
          endTime={event.timeConfig.endTime}
          slotDurationMinutes={event.timeConfig.slotDurationMinutes}
          existingParticipant={
            existingParticipant
              ? {
                  id: existingParticipant.id,
                  name: existingParticipant.name,
                  availability: existingParticipant.availability as any,
                }
              : undefined
          }
        />
      </div>
    </main>
  );
}
