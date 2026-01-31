import { z } from "zod";
import type { Translations } from "@/i18n";

export function createEventSchemaWithTranslations(t: Translations["validation"]) {
  return z.object({
    title: z
      .string()
      .min(1, t.titleRequired)
      .max(100, t.titleMaxLength),
    description: z
      .string()
      .max(500, t.descriptionMaxLength)
      .optional(),
    timezone: z.string().min(1, t.timezoneRequired),
    dates: z
      .array(z.string())
      .min(1, t.selectAtLeastOneDate)
      .max(31, t.maxDates),
    startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, t.invalidTimeFormat),
    endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, t.invalidTimeFormat),
    slotDurationMinutes: z.number().int().min(15).max(120),
  });
}

export const createEventSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
  timezone: z.string().min(1, "Timezone is required"),
  dates: z
    .array(z.string())
    .min(1, "Select at least one date")
    .max(31, "Maximum 31 dates allowed"),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
  slotDurationMinutes: z.number().int().min(15).max(120),
});

export const createParticipantSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(50, "Name must be less than 50 characters"),
  availability: z.array(
    z.object({
      slotStart: z.string(),
      slotEnd: z.string(),
    })
  ),
});

export const updateAvailabilitySchema = z.object({
  availability: z.array(
    z.object({
      slotStart: z.string(),
      slotEnd: z.string(),
    })
  ),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type CreateParticipantInput = z.infer<typeof createParticipantSchema>;
export type UpdateAvailabilityInput = z.infer<typeof updateAvailabilitySchema>;
