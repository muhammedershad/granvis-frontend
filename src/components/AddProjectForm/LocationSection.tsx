import { FieldErrors, UseFormRegister } from "react-hook-form";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { ProjectFormData } from "./schemas";

interface LocationSectionProps {
  register: UseFormRegister<ProjectFormData>;
  errors: FieldErrors<ProjectFormData>;
}

export function LocationSection({
  register,
  errors,
}: LocationSectionProps) {
  return (
    <div className="p-4 pt-2 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="space-y-3">
        <Label
          htmlFor="address"
          className="text-xs font-medium text-muted-foreground"
        >
          Address *
        </Label>
        <Input
          id="address"
          {...register("address")}
          placeholder="Street address of project site"
          className="bg-background"
        />
        {errors.address && (
          <p className="text-[10px] text-red-500">{errors.address.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-3">
          <Label
            htmlFor="city"
            className="text-xs font-medium text-muted-foreground"
          >
            City *
          </Label>
          <Input id="city" {...register("city")} className="bg-background" />
          {errors.city && (
            <p className="text-[10px] text-red-500">{errors.city.message}</p>
          )}
        </div>
        <div className="space-y-3">
          <Label
            htmlFor="state"
            className="text-xs font-medium text-muted-foreground"
          >
            State *
          </Label>
          <Input id="state" {...register("state")} className="bg-background" />
          {errors.state && (
            <p className="text-[10px] text-red-500">{errors.state.message}</p>
          )}
        </div>
        <div className="space-y-3">
          <Label
            htmlFor="country"
            className="text-xs font-medium text-muted-foreground"
          >
            Country
          </Label>
          <Input
            id="country"
            {...register("country")}
            className="bg-background"
          />
        </div>
      </div>
    </div>
  );
}
