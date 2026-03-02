"use client";

import { useCallback, useState } from "react";
import { Calendar, CalendarDays } from "lucide-react";
import {
  format,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";

type DatePreset = "today" | "this_week" | "this_month" | "this_year" | "all";

interface DateRangeFilterProps {
  onChange: (params: { startDate?: string; endDate?: string }) => void;
}

export function DateRangeFilter({ onChange }: DateRangeFilterProps) {
  const [preset, setPreset] = useState<DatePreset | "custom">("all");
  const [customStart, setCustomStart] = useState<Date | undefined>();
  const [customEnd, setCustomEnd] = useState<Date | undefined>();

  const handlePresetChange = useCallback(
    (value: string) => {
      const p = value as DatePreset | "custom";
      setPreset(p);

      if (p === "all") {
        onChange({});
        return;
      }

      if (p === "custom") {
        return;
      }

      const now = new Date();
      const end = now.toISOString();
      let start: string;

      switch (p) {
        case "today":
          start = startOfDay(now).toISOString();
          break;
        case "this_week":
          start = startOfWeek(now, { weekStartsOn: 1 }).toISOString();
          break;
        case "this_month":
          start = startOfMonth(now).toISOString();
          break;
        case "this_year":
          start = startOfYear(now).toISOString();
          break;
        default:
          start = "";
      }

      onChange({ startDate: start, endDate: end });
    },
    [onChange]
  );

  const handleCustomApply = useCallback(() => {
    onChange({
      startDate: customStart ? customStart.toISOString() : undefined,
      endDate: customEnd ? customEnd.toISOString() : undefined,
    });
  }, [customStart, customEnd, onChange]);

  return (
    <div className="flex items-center gap-2">
      <CalendarDays className="h-4 w-4 text-muted-foreground" />
      <Select value={preset} onValueChange={handlePresetChange}>
        <SelectTrigger className="w-[160px] h-9 bg-white/60 dark:bg-white/5 border-white/40 dark:border-white/10 text-sm">
          <SelectValue placeholder="Date Range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Time</SelectItem>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="this_week">This Week</SelectItem>
          <SelectItem value="this_month">This Month</SelectItem>
          <SelectItem value="this_year">This Year</SelectItem>
          <SelectItem value="custom">Custom Range</SelectItem>
        </SelectContent>
      </Select>

      {preset === "custom" && (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-9 bg-white/60 dark:bg-white/5 border-white/40 dark:border-white/10"
            >
              <Calendar className="mr-2 h-4 w-4" />
              {customStart && customEnd
                ? `${format(customStart, "MMM d")} - ${format(customEnd, "MMM d")}`
                : "Select dates"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-4 space-y-3" align="end">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Start Date
              </label>
              <DatePicker
                date={customStart}
                onDateChange={setCustomStart}
                placeholder="Start date"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                End Date
              </label>
              <DatePicker
                date={customEnd}
                onDateChange={setCustomEnd}
                placeholder="End date"
              />
            </div>
            <Button size="sm" className="w-full" onClick={handleCustomApply}>
              Apply
            </Button>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
