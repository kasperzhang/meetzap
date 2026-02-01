"use client";

import * as React from "react";
import { DayPicker, useDayPicker } from "react-day-picker";
import { zhCN, enUS } from "date-fns/locale";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/i18n";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

// Custom caption component that includes both month label and nav buttons
function CustomCaption({ calendarMonth }: { calendarMonth: { date: Date } }) {
  const { goToMonth, nextMonth, previousMonth } = useDayPicker();
  const { locale } = useLanguage();
  const dateLocale = locale === "zh" ? zhCN : enUS;

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="text-lg font-black">
        {format(calendarMonth.date, "MMMM yyyy", { locale: dateLocale })}
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => previousMonth && goToMonth(previousMonth)}
          disabled={!previousMonth}
          className="h-9 w-9 bg-[#FFE500] p-0 inline-flex items-center justify-center rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000] transition-all disabled:opacity-50"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => nextMonth && goToMonth(nextMonth)}
          disabled={!nextMonth}
          className="h-9 w-9 bg-[#FFE500] p-0 inline-flex items-center justify-center rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000] transition-all disabled:opacity-50"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

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
      hideNavigation
      className={cn("p-6 w-full", className)}
      classNames={{
        months: "flex flex-col space-y-4 w-full",
        month: "space-y-4 w-full",
        month_caption: "hidden",
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
        MonthCaption: CustomCaption,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
