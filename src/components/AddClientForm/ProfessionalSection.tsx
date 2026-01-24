import { FieldErrors, UseFormRegister } from "react-hook-form";
import { CreateClientFormData } from "@/lib/validations/client";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface ProfessionalSectionProps {
  register: UseFormRegister<CreateClientFormData>;
  errors: FieldErrors<CreateClientFormData>;
}

export function ProfessionalSection({
  register,
  errors: _errors,
}: ProfessionalSectionProps) {
  return (
    <div className="p-4 pt-2 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="space-y-1.5">
        <Label className="text-xs font-medium text-muted-foreground">
          Occupation
        </Label>
        <Input
          {...register("occupation")}
          placeholder="e.g. Project Lead"
          className="h-10"
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs font-medium text-muted-foreground">
          Employer
        </Label>
        <Input
          {...register("employer")}
          placeholder="e.g. TechCorp"
          className="h-10"
        />
      </div>
    </div>
  );
}
