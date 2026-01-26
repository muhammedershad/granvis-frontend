import { FieldErrors, UseFormSetValue } from "react-hook-form";
import { IndianRupee } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { DatePicker } from "../ui/date-picker";
import { ProjectFormData } from "./schemas";
import { dateToUTC } from "@/lib/utils/date";

interface FinancialsSectionProps {
  errors: FieldErrors<ProjectFormData>;
  setValue: UseFormSetValue<ProjectFormData>;
  startDate?: string;
  endDate?: string;
}

export function FinancialsSection({
  errors,
  setValue,
  startDate,
  endDate,
}: FinancialsSectionProps) {
  return (
    <div className="p-4 pt-2 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <Label
            htmlFor="startDate"
            className="text-xs font-medium text-muted-foreground"
          >
            Start Date *
          </Label>
          <DatePicker
            date={startDate ? new Date(startDate) : undefined}
            onDateChange={(date) => {
              setValue("startDate", date ? dateToUTC(date) : "");
            }}
            placeholder="Select start date"
          />
          {errors.startDate && (
            <p className="text-[10px] text-red-500">
              {errors.startDate.message}
            </p>
          )}
        </div>
        <div className="space-y-3">
          <Label
            htmlFor="endDate"
            className="text-xs font-medium text-muted-foreground"
          >
            End Date
          </Label>
          <DatePicker
            date={endDate ? new Date(endDate) : undefined}
            onDateChange={(date) => {
              setValue("endDate", date ? dateToUTC(date) : "");
            }}
            placeholder="Select end date"
          />
        </div>
      </div>

      <div className="space-y-3">
        <Label
          htmlFor="totalBudget"
          className="text-xs font-medium text-muted-foreground"
        >
          Total Budget{" "}
          <span className="text-[10px] text-muted-foreground/70">
            (Optional)
          </span>
        </Label>
        <div className="relative">
          <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            id="totalBudget"
            type="number"
            onChange={(e) => setValue("totalBudget", e.target.value)}
            className="pl-9 bg-background"
            placeholder="850000.00"
          />
        </div>
        {errors.totalBudget && (
          <p className="text-[10px] text-red-500">
            {errors.totalBudget.message}
          </p>
        )}
      </div>
    </div>
  );
}
