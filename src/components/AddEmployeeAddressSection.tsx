import { FieldErrors, UseFormRegister, UseFormTrigger } from "react-hook-form";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { type CreateEmployeeFormInput } from "@/lib/validations/employee";

interface AddressSectionProps {
  register: UseFormRegister<CreateEmployeeFormInput>;
  trigger: UseFormTrigger<CreateEmployeeFormInput>;
  errors: FieldErrors<CreateEmployeeFormInput>;
}

export function AddEmployeeAddressSection({
  register,
  trigger,
  errors,
}: AddressSectionProps) {
  return (
    <div className="p-4 pt-2 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="space-y-1.5">
        <Label className="text-xs font-medium text-muted-foreground">
          Street Address *
        </Label>
        <Input
          {...register("address.street")}
          placeholder="e.g. 123 Main St"
          className="h-10"
          onBlur={() => trigger("address.street")}
        />
        {errors.address?.street && (
          <p className="text-[10px] text-red-500">
            {errors.address.street.message}
          </p>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">
            City *
          </Label>
          <Input
            {...register("address.city")}
            placeholder="Mananthavady"
            className="h-10"
            onBlur={() => trigger("address.city")}
          />
          {errors.address?.city && (
            <p className="text-[10px] text-red-500">
              {errors.address.city.message}
            </p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">
            State *
          </Label>
          <Input
            {...register("address.state")}
            placeholder="Kerala"
            className="h-10"
            onBlur={() => trigger("address.state")}
          />
          {errors.address?.state && (
            <p className="text-[10px] text-red-500">
              {errors.address.state.message}
            </p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">
            Pin Code *
          </Label>
          <Input
            {...register("address.pinCode")}
            placeholder="670731"
            className="h-10"
            onBlur={() => trigger("address.pinCode")}
          />
          {errors.address?.pinCode && (
            <p className="text-[10px] text-red-500">
              {errors.address.pinCode.message}
            </p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">
            Country *
          </Label>
          <Input
            {...register("address.country")}
            placeholder="India"
            className="h-10"
            onBlur={() => trigger("address.country")}
          />
          {errors.address?.country && (
            <p className="text-[10px] text-red-500">
              {errors.address.country.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
