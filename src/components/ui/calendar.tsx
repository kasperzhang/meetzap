"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";
import { zhCN, enUS } from "date-fns/locale";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/i18n";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const { locale } = useLanguage();
  const dateLocale = locale === "zh" ? zhCN : enUS;

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      locale={dateLocale}
      className={cn("p-6 w-full", className)}
      classNames={{
        months: "flex flex-col space-y-4 w-full",
        month: "space-y-4 w-full",
        month_caption: "flex items-center justify-between mb-4",
        caption_label: "text-lg font-black",
        nav: "flex items-center gap-2",
        button_previous:
          "h-9 w-9 bg-[#FFE500] p-0 inline-flex items-center justify-center rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000] transition-all",
        button_next:
          "h-9 w-9 bg-[#FFE500] p-0 inline-flex items-center justify-center rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000] transition-all",
        month_grid: "w-full",
        weekdays: "grid grid-cols-7 w-full mb-2",
        weekday: "text-black font-black text-sm py-2 text-center",
        week: "grid grid-cols-7 w-full",
        day: cn("relative p-1 text-center text-sm focus-within:relative focus-within:z-20"),
        day_button: cn(
          "h-12 w-full p-0 font-bold rounded-lg flex items-center justify-center border-2 border-transparent hover:border-black hover:bg-[#FFE500]/30 transition-all"
        ),
        range_start: "day-range-start",
        range_end: "day-range-end",
        selected:
          "bg-[#FFE500] text-black font-black border-2 border-black shadow-[2px_2px_0px_0px_#000]",
        today: "bg-[#4ECDC4] text-black font-black border-2 border-black",
        outside:
          "day-outside text-neutral-400 opacity-40 aria-selected:bg-[#FFE500]/50 aria-selected:text-black aria-selected:opacity-70",
        disabled: "text-neutral-400 opacity-40",
        range_middle: "aria-selected:bg-[#FFE500]/50 aria-selected:text-black",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) =>
          orientation === "left" ? (
            <ChevronLeft className="h-5 w-5" />
          ) : (
            <ChevronRight className="h-5 w-5" />
          ),
        MonthCaption: ({ calendarMonth, displayIndex }) => {
          return (
            <div className="text-lg font-black">
              {format(calendarMonth.date, "MMMM yyyy", { locale: dateLocale })}
            </div>
          );
        },
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
