import { getEventAvailability } from "@/lib/db/queries";
import { EventView } from "@/components/event/event-view";
import { BackLink } from "@/components/back-link";
import Link from "next/link";

interface EventPageProps {
  params: Promise<{ eventId: string }>;
}

export async function generateMetadata({ params }: EventPageProps) {
  const { eventId } = await params;

  try {
    const event = await getEventAvailability(eventId);
    if (!event) return { title: "Event Not Found" };

    if (event.expiresAt && new Date(event.expiresAt) < new Date()) {
      return { title: "Event Expired - MeetZap" };
    }

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
  }

  // Show expired message if event not found or expired
  if (!event || (event.expiresAt && new Date(event.expiresAt) < new Date())) {
    return (
      <main className="min-h-screen bg-[#FFF8E7]">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
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

  return (
    <main className="min-h-screen bg-[#FFF8E7]">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <BackLink href="/" type="home" />

        <EventView event={event as any} />
      </div>
    </main>
  );
}
