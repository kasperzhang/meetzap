CREATE TABLE "availability" (
	"participant_id" text NOT NULL,
	"event_id" text NOT NULL,
	"slot_start" timestamp NOT NULL,
	"slot_end" timestamp NOT NULL,
	CONSTRAINT "availability_participant_id_slot_start_pk" PRIMARY KEY("participant_id","slot_start")
);
--> statement-breakpoint
CREATE TABLE "event_dates" (
	"event_id" text NOT NULL,
	"date" date NOT NULL,
	CONSTRAINT "event_dates_event_id_date_pk" PRIMARY KEY("event_id","date")
);
--> statement-breakpoint
CREATE TABLE "event_time_config" (
	"event_id" text PRIMARY KEY NOT NULL,
	"start_time" time NOT NULL,
	"end_time" time NOT NULL,
	"slot_duration_minutes" integer DEFAULT 30 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"timezone" text DEFAULT 'UTC' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "participants" (
	"id" text PRIMARY KEY NOT NULL,
	"event_id" text NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "scheduled_meetings" (
	"event_id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"slots" text NOT NULL,
	"scheduled_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "availability" ADD CONSTRAINT "availability_participant_id_participants_id_fk" FOREIGN KEY ("participant_id") REFERENCES "public"."participants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "availability" ADD CONSTRAINT "availability_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_dates" ADD CONSTRAINT "event_dates_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_time_config" ADD CONSTRAINT "event_time_config_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "participants" ADD CONSTRAINT "participants_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scheduled_meetings" ADD CONSTRAINT "scheduled_meetings_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;