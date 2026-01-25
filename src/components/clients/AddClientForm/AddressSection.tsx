import { FieldErrors, UseFormRegister } from "react-hook-form";
import { CreateClientFormData } from "@/lib/validations/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddressSectionProps {
  register: UseFormRegister<CreateClientFormData>;
  errors: FieldErrors<CreateClientFormData>;
}

export function AddressSection({ register, errors }: AddressSectionProps) {
  return (
    <div className="p-4 pt-2 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="space-y-1.5">
        <Label className="text-xs font-medium text-muted-foreground">
          Street Address *
        </Label>
        <Input
          {...register("street")}
          placeholder="e.g. 123 Main St"
          className="h-10"
        />
        {errors.street && (
          <p className="text-[10px] text-red-500">{errors.street.message}</p>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">
            City *
          </Label>
          <Input
            {...register("city")}
            placeholder="Mananthavady"
            className="h-10"
          />
          {errors.city && (
            <p className="text-[10px] text-red-500">{errors.city.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">
            State *
          </Label>
          <Input {...register("state")} placeholder="Kerala" className="h-10" />
          {errors.state && (
            <p className="text-[10px] text-red-500">{errors.state.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">
            Postal Code *
          </Label>
          <Input
            {...register("postalCode")}
            placeholder="670731"
            className="h-10"
          />
          {errors.postalCode && (
            <p className="text-[10px] text-red-500">
              {errors.postalCode.message}
            </p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">
            Country *
          </Label>
          <Input
            {...register("country")}
            placeholder="India"
            className="h-10"
          />
          {errors.country && (
            <p className="text-[10px] text-red-500">{errors.country.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
