export interface Event {
  id: string;
  title: string;
  description: string | null;
  timezone: string;
  createdAt: Date;
}

export interface EventDate {
  eventId: string;
  date: Date;
}

export interface EventTimeConfig {
  eventId: string;
  startTime: string;
  endTime: string;
  slotDurationMinutes: number;
}

export interface Participant {
  id: string;
  eventId: string;
  name: string;
  createdAt: Date;
}

export interface Availability {
  participantId: string;
  eventId: string;
  slotStart: Date;
  slotEnd: Date;
}

export interface TimeSlot {
  start: Date;
  end: Date;
  dateStr: string;
  timeStr: string;
}

export interface GridSelection {
  [key: string]: boolean;
}

export interface AggregatedSlot {
  slot: TimeSlot;
  participants: string[];
  count: number;
}

export interface EventWithDetails extends Event {
  dates: Date[];
  timeConfig: EventTimeConfig;
  participants: Participant[];
}

export interface CreateEventInput {
  title: string;
  description?: string;
  timezone: string;
  dates: string[];
  startTime: string;
  endTime: string;
  slotDurationMinutes: number;
}

export interface CreateParticipantInput {
  name: string;
  availability: {
    slotStart: string;
    slotEnd: string;
  }[];
}
