import { notFound } from "next/navigation";
import { getEventAvailability } from "@/lib/db/queries";
import { EventView } from "@/components/event/event-view";
import { BackLink } from "@/components/back-link";

interface EventPageProps {
  params: Promise<{ eventId: string }>;
}

export async function generateMetadata({ params }: EventPageProps) {
  const { eventId } = await params;

  try {
    const event = await getEventAvailability(eventId);
    if (!event) return { title: "Event Not Found" };

    return {
      title: `${event.title} - MeetZap`,
      description: event.description || "View group availability",
    };
  } catch {
    return { title: "Event - MeetZap" };
  }
}

export default async function EventPage({ params }: EventPageProps) {
  const { eventId } = await params;

  let event;
  try {
    event = await getEventAvailability(eventId);
  } catch (error) {
    console.error("Error fetching event:", error);
    notFound();
  }

  if (!event) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <BackLink href="/" type="home" />

        <EventView event={event as any} />
      </div>
    </main>
  );
}
