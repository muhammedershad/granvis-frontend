"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "./utils";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

interface DatePickerProps {
  date?: Date;
  onDateChange?: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  fromYear?: number;
  toYear?: number;
  onBlur?: () => void;
}

export function DatePicker({
  date,
  onDateChange,
  placeholder = "Pick a date",
  className,
  disabled = false,
  fromYear = 1950,
  toYear = new Date().getFullYear() + 10,
  onBlur,
}: DatePickerProps) {
  const [month, setMonth] = React.useState<Date>(date || new Date());
  const [open, setOpen] = React.useState(false);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const years = Array.from(
    { length: toYear - fromYear + 1 },
    (_, i) => fromYear + i
  );

  const handleMonthChange = (newMonth: string) => {
    const monthIndex = months.indexOf(newMonth);
    const newDate = new Date(month);
    newDate.setMonth(monthIndex);
    setMonth(newDate);
  };

  const handleYearChange = (newYear: string) => {
    const newDate = new Date(month);
    newDate.setFullYear(parseInt(newYear));
    setMonth(newDate);
  };

  const handlePreviousMonth = () => {
    const newDate = new Date(month);
    newDate.setMonth(newDate.getMonth() - 1);
    setMonth(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(month);
    newDate.setMonth(newDate.getMonth() + 1);
    setMonth(newDate);
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    onDateChange?.(selectedDate);
    setOpen(false);
    onBlur?.();
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "h-10 w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 size-4" />
          {date ? format(date, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-0" align="start">
        <div className="p-3 border-b">
          <div className="flex items-center justify-between gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={handlePreviousMonth}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex gap-2 flex-1">
              <Select
                value={months[month.getMonth()]}
                onValueChange={handleMonthChange}
              >
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {months.map((m) => (
                    <SelectItem key={m} value={m} className="text-sm">
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={month.getFullYear().toString()}
                onValueChange={handleYearChange}
              >
                <SelectTrigger className="h-8 w-24 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map((y) => (
                    <SelectItem
                      key={y}
                      value={y.toString()}
                      className="text-sm"
                    >
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={handleNextMonth}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          month={month}
          onMonthChange={setMonth}
          fromYear={fromYear}
          toYear={toYear}
          captionLayout="dropdown"
          classNames={{
            month_caption: "hidden",
          }}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  );
}
