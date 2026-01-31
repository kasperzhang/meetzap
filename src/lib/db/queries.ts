import { eq } from "drizzle-orm";
import { db } from ".";
import {
  events,
  eventDates,
  eventTimeConfig,
  participants,
  availability,
} from "./schema";
import { nanoid } from "nanoid";
import type {
  CreateEventInput,
  CreateParticipantInput,
} from "@/lib/validations/event";

export async function createEvent(input: CreateEventInput) {
  const eventId = nanoid(10);

  await db.transaction(async (tx) => {
    await tx.insert(events).values({
      id: eventId,
      title: input.title,
      description: input.description,
      timezone: input.timezone,
    });

    await tx.insert(eventDates).values(
      input.dates.map((date) => ({
        eventId,
        date,
      }))
    );

    await tx.insert(eventTimeConfig).values({
      eventId,
      startTime: input.startTime,
      endTime: input.endTime,
      slotDurationMinutes: input.slotDurationMinutes,
    });
  });

  return eventId;
}

export async function getEvent(eventId: string) {
  const event = await db.query.events.findFirst({
    where: eq(events.id, eventId),
    with: {
      dates: true,
      timeConfig: true,
      participants: true,
    },
  });

  return event;
}

export async function createParticipant(
  eventId: string,
  input: CreateParticipantInput
) {
  const participantId = nanoid(10);

  await db.transaction(async (tx) => {
    await tx.insert(participants).values({
      id: participantId,
      eventId,
      name: input.name,
    });

    if (input.availability.length > 0) {
      await tx.insert(availability).values(
        input.availability.map((slot) => ({
          participantId,
          eventId,
          slotStart: new Date(slot.slotStart),
          slotEnd: new Date(slot.slotEnd),
        }))
      );
    }
  });

  return participantId;
}

export async function getParticipant(participantId: string) {
  return db.query.participants.findFirst({
    where: eq(participants.id, participantId),
    with: {
      availability: true,
    },
  });
}

export async function updateParticipantAvailability(
  participantId: string,
  eventId: string,
  slots: { slotStart: string; slotEnd: string }[]
) {
  await db.transaction(async (tx) => {
    await tx
      .delete(availability)
      .where(eq(availability.participantId, participantId));

    if (slots.length > 0) {
      await tx.insert(availability).values(
        slots.map((slot) => ({
          participantId,
          eventId,
          slotStart: new Date(slot.slotStart),
          slotEnd: new Date(slot.slotEnd),
        }))
      );
    }
  });
}

export async function getEventAvailability(eventId: string) {
  const event = await db.query.events.findFirst({
    where: eq(events.id, eventId),
    with: {
      dates: true,
      timeConfig: true,
      participants: {
        with: {
          availability: true,
        },
      },
    },
  });

  return event;
}

export async function getAggregatedAvailability(eventId: string) {
  const eventData = await getEventAvailability(eventId);

  if (!eventData) {
    return null;
  }

  const slotMap = new Map<string, string[]>();

  for (const participant of eventData.participants) {
    for (const slot of participant.availability) {
      const key = slot.slotStart.toISOString();
      const existing = slotMap.get(key) || [];
      existing.push(participant.name);
      slotMap.set(key, existing);
    }
  }

  return {
    event: eventData,
    aggregated: Array.from(slotMap.entries()).map(([slotStart, names]) => ({
      slotStart,
      participants: names,
      count: names.length,
    })),
  };
}
