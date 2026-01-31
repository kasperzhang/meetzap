import { pgTable, text, timestamp, integer, date, time, primaryKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const events = pgTable("events", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  timezone: text("timezone").notNull().default("UTC"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const eventDates = pgTable(
  "event_dates",
  {
    eventId: text("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    date: date("date").notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.eventId, table.date] }),
  })
);

export const eventTimeConfig = pgTable("event_time_config", {
  eventId: text("event_id")
    .primaryKey()
    .references(() => events.id, { onDelete: "cascade" }),
  startTime: time("start_time").notNull(),
  endTime: time("end_time").notNull(),
  slotDurationMinutes: integer("slot_duration_minutes").notNull().default(30),
});

export const participants = pgTable("participants", {
  id: text("id").primaryKey(),
  eventId: text("event_id")
    .notNull()
    .references(() => events.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const availability = pgTable(
  "availability",
  {
    participantId: text("participant_id")
      .notNull()
      .references(() => participants.id, { onDelete: "cascade" }),
    eventId: text("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    slotStart: timestamp("slot_start").notNull(),
    slotEnd: timestamp("slot_end").notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.participantId, table.slotStart] }),
  })
);

// Relations
export const eventsRelations = relations(events, ({ many, one }) => ({
  dates: many(eventDates),
  timeConfig: one(eventTimeConfig),
  participants: many(participants),
  availability: many(availability),
}));

export const eventDatesRelations = relations(eventDates, ({ one }) => ({
  event: one(events, {
    fields: [eventDates.eventId],
    references: [events.id],
  }),
}));

export const eventTimeConfigRelations = relations(eventTimeConfig, ({ one }) => ({
  event: one(events, {
    fields: [eventTimeConfig.eventId],
    references: [events.id],
  }),
}));

export const participantsRelations = relations(participants, ({ one, many }) => ({
  event: one(events, {
    fields: [participants.eventId],
    references: [events.id],
  }),
  availability: many(availability),
}));

export const availabilityRelations = relations(availability, ({ one }) => ({
  participant: one(participants, {
    fields: [availability.participantId],
    references: [participants.id],
  }),
  event: one(events, {
    fields: [availability.eventId],
    references: [events.id],
  }),
}));
