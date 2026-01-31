import { NextResponse } from "next/server";
import { createParticipant, getEvent } from "@/lib/db/queries";
import { createParticipantSchema } from "@/lib/validations/event";

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

    const body = await request.json();
    const validatedData = createParticipantSchema.parse(body);

    const participantId = await createParticipant(eventId, validatedData);

    return NextResponse.json({ id: participantId }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: error },
        { status: 400 }
      );
    }

    console.error("Error creating participant:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
