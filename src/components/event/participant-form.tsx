"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AvailabilityGrid } from "@/components/availability/availability-grid";
import { slotsToAvailability, generateTimeSlots, availabilityToSlotKeys } from "@/lib/utils/grid";
import { createParticipantSchema, type CreateParticipantInput } from "@/lib/validations/event";
import { useLanguage, interpolate } from "@/i18n";
import type { TimeSlot } from "@/types";

interface ParticipantFormProps {
  eventId: string;
  eventTitle: string;
  dates: Date[];
  startTime: string;
  endTime: string;
  slotDurationMinutes: number;
  existingParticipant?: {
    id: string;
    name: string;
    availability: { slotStart: Date; slotEnd: Date }[];
  };
}

export function ParticipantForm({
  eventId,
  eventTitle,
  dates,
  startTime,
  endTime,
  slotDurationMinutes,
  existingParticipant,
}: ParticipantFormProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const [selectedSlots, setSelectedSlots] = React.useState<Set<string>>(() => {
    if (existingParticipant?.availability) {
      return availabilityToSlotKeys(existingParticipant.availability);
    }
    return new Set();
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const allSlots = React.useMemo(
    () => generateTimeSlots(dates, startTime, endTime, slotDurationMinutes),
    [dates, startTime, endTime, slotDurationMinutes]
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ name: string }>({
    defaultValues: {
      name: existingParticipant?.name || "",
    },
  });

  const onSubmit = async (data: { name: string }) => {
    if (selectedSlots.size === 0) {
      toast.error(t.participantForm.selectAtLeastOne);
      return;
    }

    setIsSubmitting(true);

    const availability = slotsToAvailability(selectedSlots, allSlots);

    try {
      const url = existingParticipant
        ? `/api/events/${eventId}/availability/${existingParticipant.id}`
        : `/api/events/${eventId}/participants`;

      const method = existingParticipant ? "PUT" : "POST";

      const body = existingParticipant
        ? { availability }
        : { name: data.name, availability };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to submit availability");
      }

      toast.success(t.participantForm.success);
      router.push(`/event/${eventId}`);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t.errors.somethingWentWrong);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{interpolate(t.participantForm.yourAvailabilityFor, { eventTitle })}</CardTitle>
          <CardDescription>
            {t.participantForm.instructions}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!existingParticipant && (
            <div className="space-y-2">
              <Label htmlFor="name">{t.participantForm.yourName}</Label>
              <Input
                id="name"
                placeholder={t.participantForm.yourNamePlaceholder}
                {...register("name", { required: t.validation.nameRequired })}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t.participantForm.selectAvailableTimes}</CardTitle>
          <CardDescription>
            {t.participantForm.dragInstructions}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AvailabilityGrid
            dates={dates}
            startTime={startTime}
            endTime={endTime}
            slotDurationMinutes={slotDurationMinutes}
            initialSelection={selectedSlots}
            onSelectionChange={setSelectedSlots}
          />
          <p className="text-sm text-neutral-600 mt-4">
            {interpolate(t.participantForm.slotsSelected, { count: selectedSlots.size })}
          </p>
        </CardContent>
      </Card>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting
          ? t.participantForm.submitting
          : existingParticipant
          ? t.participantForm.updateButton
          : t.participantForm.submitButton}
      </Button>
    </form>
  );
}
