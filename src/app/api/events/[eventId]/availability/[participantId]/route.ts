import { NextResponse } from "next/server";
import {
  getParticipant,
  updateParticipantAvailability,
} from "@/lib/db/queries";
import { updateAvailabilitySchema } from "@/lib/validations/event";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ eventId: string; participantId: string }> }
) {
  try {
    const { eventId, participantId } = await params;

    const participant = await getParticipant(participantId);
    if (!participant) {
      return NextResponse.json(
        { error: "Participant not found" },
        { status: 404 }
      );
    }

    if (participant.eventId !== eventId) {
      return NextResponse.json(
        { error: "Participant does not belong to this event" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = updateAvailabilitySchema.parse(body);

    await updateParticipantAvailability(
      participantId,
      eventId,
      validatedData.availability
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: error },
        { status: 400 }
      );
    }

    console.error("Error updating availability:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
