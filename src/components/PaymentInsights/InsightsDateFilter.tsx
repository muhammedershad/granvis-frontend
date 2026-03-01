import { format, startOfYear, subDays, subMonths } from "date-fns";
import { CalendarRange } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { DatePicker } from "../ui/date-picker";

interface InsightsDateFilterProps {
  startDate: Date | undefined;
  endDate: Date | undefined;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
}

const PRESETS = [
  {
    label: "30D",
    getRange: () => ({ start: subDays(new Date(), 30), end: new Date() }),
  },
  {
    label: "3M",
    getRange: () => ({ start: subMonths(new Date(), 3), end: new Date() }),
  },
  {
    label: "6M",
    getRange: () => ({ start: subMonths(new Date(), 6), end: new Date() }),
  },
  {
    label: "12M",
    getRange: () => ({ start: subMonths(new Date(), 12), end: new Date() }),
  },
  {
    label: "YTD",
    getRange: () => ({ start: startOfYear(new Date()), end: new Date() }),
  },
  {
    label: "All",
    getRange: () => ({
      start: undefined as Date | undefined,
      end: undefined as Date | undefined,
    }),
  },
];

export function InsightsDateFilter({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: InsightsDateFilterProps) {
  const handlePreset = (preset: (typeof PRESETS)[number]) => {
    const range = preset.getRange();
    onStartDateChange(range.start);
    onEndDateChange(range.end);
  };

  return (
    <Card className="p-4 backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 shadow-xl shadow-gray-200/50 dark:shadow-black/50">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-center gap-2 text-muted-foreground shrink-0">
          <CalendarRange className="w-4 h-4" />
          <span className="text-sm font-medium">Date Range</span>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 flex-1">
          <DatePicker
            date={startDate}
            onDateChange={onStartDateChange}
            placeholder="Start date"
            className="w-full sm:w-[180px]"
            fromYear={2020}
            toYear={new Date().getFullYear() + 1}
          />
          <span className="text-muted-foreground text-sm hidden sm:block">
            to
          </span>
          <DatePicker
            date={endDate}
            onDateChange={onEndDateChange}
            placeholder="End date"
            className="w-full sm:w-[180px]"
            fromYear={2020}
            toYear={new Date().getFullYear() + 1}
          />
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {PRESETS.map((preset) => (
            <Button
              key={preset.label}
              variant="ghost"
              size="sm"
              className="text-xs h-7 px-2"
              onClick={() => handlePreset(preset)}
            >
              {preset.label}
            </Button>
          ))}
        </div>

        {(startDate || endDate) && (
          <p className="text-xs text-muted-foreground shrink-0">
            {startDate ? format(startDate, "dd MMM yyyy") : "All"} -{" "}
            {endDate ? format(endDate, "dd MMM yyyy") : "Now"}
          </p>
        )}
      </div>
    </Card>
  );
}
