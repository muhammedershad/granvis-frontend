import { FieldErrors, UseFormRegister } from "react-hook-form";
import { Calendar, DollarSign } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { ProjectFormData } from "./schemas";

interface FinancialsSectionProps {
  register: UseFormRegister<ProjectFormData>;
  errors: FieldErrors<ProjectFormData>;
}

export function FinancialsSection({
  register,
  errors,
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
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              id="startDate"
              type="date"
              {...register("startDate")}
              className="pl-9 bg-background"
            />
          </div>
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
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              id="endDate"
              type="date"
              {...register("endDate")}
              className="pl-9 bg-background"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <Label
            htmlFor="deadline"
            className="text-xs font-medium text-muted-foreground"
          >
            Deadline
          </Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              id="deadline"
              type="date"
              {...register("deadline")}
              className="pl-9 bg-background"
            />
          </div>
        </div>
        <div className="space-y-3">
          <Label
            htmlFor="estimatedDuration"
            className="text-xs font-medium text-muted-foreground"
          >
            Duration (days)
          </Label>
          <Input
            id="estimatedDuration"
            type="number"
            {...register("estimatedDuration")}
            placeholder="180"
            className="bg-background"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <Label
            htmlFor="totalBudget"
            className="text-xs font-medium text-muted-foreground"
          >
            Total Budget *
          </Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              id="totalBudget"
              type="number"
              {...register("totalBudget")}
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
        <div className="space-y-3">
          <Label
            htmlFor="spentAmount"
            className="text-xs font-medium text-muted-foreground"
          >
            Spent Amount
          </Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              id="spentAmount"
              type="number"
              {...register("spentAmount")}
              className="pl-9 bg-background"
              placeholder="0.00"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
