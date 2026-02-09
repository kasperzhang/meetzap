import { NextResponse } from "next/server";
import { getEvent, getScheduledMeeting, scheduleMeeting } from "@/lib/db/queries";
import { scheduleMeetingSchema } from "@/lib/validations/event";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;

    const event = await getEvent(eventId);
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const existing = await getScheduledMeeting(eventId);
    if (existing) {
      return NextResponse.json(
        { error: "Meeting already scheduled" },
        { status: 409 }
      );
    }

    const body = await request.json();
    const parsed = scheduleMeetingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    await scheduleMeeting(
      eventId,
      parsed.data.title,
      parsed.data.description,
      parsed.data.slots
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error scheduling meeting:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
