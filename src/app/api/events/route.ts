import { NextResponse } from "next/server";
import { createEvent } from "@/lib/db/queries";
import { createEventSchema } from "@/lib/validations/event";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = createEventSchema.parse(body);

    const eventId = await createEvent(validatedData);

    return NextResponse.json({ id: eventId }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: error },
        { status: 400 }
      );
    }

    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
