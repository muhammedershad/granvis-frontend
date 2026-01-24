import { UseFormRegister } from "react-hook-form";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { type CreateEmployeeFormInput } from "@/lib/validations/employee";

interface EmergencySectionProps {
  register: UseFormRegister<CreateEmployeeFormInput>;
}

export function AddEmployeeEmergencySection({
  register,
}: EmergencySectionProps) {
  return (
    <div className="p-4 pt-2 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">
            Name
          </Label>
          <Input
            {...register("emergencyContact.name")}
            placeholder="Contact Name"
            className="h-10"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">
            Relationship
          </Label>
          <Input
            {...register("emergencyContact.relationship")}
            placeholder="e.g. Spouse"
            className="h-10"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">
            Phone
          </Label>
          <Input
            {...register("emergencyContact.phone")}
            placeholder="+91 98765 43210"
            className="h-10"
          />
        </div>
      </div>
    </div>
  );
}
