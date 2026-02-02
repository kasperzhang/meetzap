import { getEvent, getParticipant } from "@/lib/db/queries";
import { ParticipantForm } from "@/components/event/participant-form";
import { BackLink } from "@/components/back-link";
import Link from "next/link";

interface RespondPageProps {
  params: Promise<{ eventId: string }>;
  searchParams: Promise<{ participantId?: string }>;
}

export async function generateMetadata({ params }: RespondPageProps) {
  const { eventId } = await params;

  try {
    const event = await getEvent(eventId);
    if (!event) return { title: "Event Not Found" };

    if (event.expiresAt && new Date(event.expiresAt) < new Date()) {
      return { title: "Event Expired - MeetZap" };
    }

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
  }

  // Show expired message if event not found or expired
  if (!event || !event.timeConfig || (event.expiresAt && new Date(event.expiresAt) < new Date())) {
    return (
      <main className="min-h-screen bg-[#FFF8E7]">
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Event Has Expired
            </h1>
            <p className="text-gray-600 mb-8">
              This event is no longer available. Events expire 30 days after the last scheduled date.
            </p>
            <Link
              href="/"
              className="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Create a New Event
            </Link>
          </div>
        </div>
      </main>
    );
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
    <main className="min-h-screen bg-[#FFF8E7]">
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
