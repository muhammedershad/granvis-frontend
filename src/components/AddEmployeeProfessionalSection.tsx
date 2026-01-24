import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { DatePicker } from "./ui/date-picker";
import { type CreateEmployeeFormInput } from "@/lib/validations/employee";
import { dateToUTC } from "@/lib/utils/date";

interface ProfessionalSectionProps {
  register: UseFormRegister<CreateEmployeeFormInput>;
  setValue: UseFormSetValue<CreateEmployeeFormInput>;
  formData: CreateEmployeeFormInput;
}

export function AddEmployeeProfessionalSection({
  register,
  setValue,
  formData,
}: ProfessionalSectionProps) {
  return (
    <div className="p-4 pt-2 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">
            Years of Experience
          </Label>
          <Input
            type="number"
            {...register("experience")}
            placeholder="0"
            className="h-10"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">
            Degree
          </Label>
          <Input
            {...register("education.degree")}
            placeholder="e.g. Bachelor of Architecture"
            className="h-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">
            University
          </Label>
          <Input
            {...register("education.university")}
            placeholder="e.g. MIT"
            className="h-10"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">
            Date of Passing
          </Label>
          <DatePicker
            date={
              formData.education?.dateOfPassing
                ? new Date(formData.education.dateOfPassing)
                : undefined
            }
            onDateChange={(date) => {
              setValue("education.dateOfPassing", dateToUTC(date));
            }}
            placeholder="Select date of passing"
            fromYear={1970}
            toYear={new Date().getFullYear() + 5}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs font-medium text-muted-foreground">
          Skills (comma-separated)
        </Label>
        <Textarea
          {...register("skillsInput")}
          placeholder="AutoCAD, Revit, Project Management"
          className="min-h-[80px]"
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs font-medium text-muted-foreground">
          Certifications (comma-separated)
        </Label>
        <Textarea
          {...register("certificationsInput")}
          placeholder="LEED AP, PMP"
          className="min-h-[80px]"
        />
      </div>
    </div>
  );
}
