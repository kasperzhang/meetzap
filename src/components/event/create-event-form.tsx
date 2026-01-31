"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createEventSchema, type CreateEventInput } from "@/lib/validations/event";
import { useLanguage, interpolate } from "@/i18n";

const TIMEZONES = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Anchorage",
  "Pacific/Honolulu",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Asia/Singapore",
  "Australia/Sydney",
  "UTC",
];

export function CreateEventForm() {
  const router = useRouter();
  const { t } = useLanguage();
  const [selectedDates, setSelectedDates] = React.useState<Date[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const slotDurations = [
    { value: 15, label: t.createEvent.slotDurations[15] },
    { value: 30, label: t.createEvent.slotDurations[30] },
    { value: 60, label: t.createEvent.slotDurations[60] },
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CreateEventInput>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      title: "",
      description: "",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      dates: [],
      startTime: "09:00",
      endTime: "17:00",
      slotDurationMinutes: 30,
    },
  });

  React.useEffect(() => {
    setValue(
      "dates",
      selectedDates.map((d) => format(d, "yyyy-MM-dd"))
    );
  }, [selectedDates, setValue]);

  const onSubmit = async (data: CreateEventInput) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create event");
      }

      const { id } = await response.json();
      toast.success(t.createEvent.success);
      router.push(`/event/${id}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t.errors.somethingWentWrong);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDateSelect = (dates: Date[] | undefined) => {
    setSelectedDates(dates || []);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t.createEvent.eventDetails}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">{t.createEvent.eventTitle}</Label>
            <Input
              id="title"
              placeholder={t.createEvent.eventTitlePlaceholder}
              {...register("title")}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t.createEvent.description}</Label>
            <Textarea
              id="description"
              placeholder={t.createEvent.descriptionPlaceholder}
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="timezone">{t.createEvent.timezone}</Label>
            <Select {...register("timezone")}>
              {TIMEZONES.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t.createEvent.selectDates}</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="multiple"
            selected={selectedDates}
            onSelect={handleDateSelect}
            disabled={{ before: new Date() }}
            className="rounded-md border"
          />
          {errors.dates && (
            <p className="text-sm text-red-500 mt-2">{errors.dates.message}</p>
          )}
          {selectedDates.length > 0 && (
            <p className="text-sm text-neutral-600 mt-2">
              {interpolate(t.createEvent.datesSelected, { count: selectedDates.length })}
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t.createEvent.timeRange}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">{t.createEvent.startTime}</Label>
              <Input id="startTime" type="time" {...register("startTime")} />
              {errors.startTime && (
                <p className="text-sm text-red-500">{errors.startTime.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">{t.createEvent.endTime}</Label>
              <Input id="endTime" type="time" {...register("endTime")} />
              {errors.endTime && (
                <p className="text-sm text-red-500">{errors.endTime.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="slotDuration">{t.createEvent.slotDuration}</Label>
            <Select
              {...register("slotDurationMinutes", { valueAsNumber: true })}
            >
              {slotDurations.map((duration) => (
                <option key={duration.value} value={duration.value}>
                  {duration.label}
                </option>
              ))}
            </Select>
          </div>
        </CardContent>
      </Card>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? t.createEvent.creating : t.createEvent.createButton}
      </Button>
    </form>
  );
}
