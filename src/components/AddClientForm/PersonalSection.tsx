import { FieldErrors, UseFormRegister } from "react-hook-form";
import { CreateClientFormData } from "@/lib/validations/client";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface PersonalSectionProps {
  register: UseFormRegister<CreateClientFormData>;
  errors: FieldErrors<CreateClientFormData>;
  genderValue: string;
  onGenderChange: (value: string) => void;
}

export function PersonalSection({
  register,
  errors,
  genderValue,
  onGenderChange,
}: PersonalSectionProps) {
  return (
    <div className="p-4 pt-2 grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="space-y-1.5">
        <Label className="text-xs font-medium text-muted-foreground">
          First Name *
        </Label>
        <Input
          {...register("firstName")}
          placeholder="e.g. Liam"
          className="h-10"
          maxLength={50}
        />
        {errors.firstName && (
          <p className="text-[10px] text-red-500">{errors.firstName.message}</p>
        )}
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs font-medium text-muted-foreground">
          Middle Name
        </Label>
        <Input
          {...register("middleName")}
          placeholder="e.g. James"
          className="h-10"
          maxLength={50}
        />
        {errors.middleName && (
          <p className="text-[10px] text-red-500">
            {errors.middleName.message}
          </p>
        )}
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs font-medium text-muted-foreground">
          Last Name *
        </Label>
        <Input
          {...register("lastName")}
          placeholder="e.g. Chen"
          className="h-10"
          maxLength={50}
        />
        {errors.lastName && (
          <p className="text-[10px] text-red-500">{errors.lastName.message}</p>
        )}
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs font-medium text-muted-foreground">
          Email Address
        </Label>
        <Input
          type="email"
          {...register("email")}
          placeholder="liam.chen@example.com"
          className="h-10"
        />
        {errors.email && (
          <p className="text-[10px] text-red-500">{errors.email.message}</p>
        )}
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs font-medium text-muted-foreground">
          Phone Number *
        </Label>
        <Input
          {...register("phone")}
          placeholder="+91 98765 43210"
          className="h-10"
        />
        {errors.phone && (
          <p className="text-[10px] text-red-500">{errors.phone.message}</p>
        )}
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs font-medium text-muted-foreground">
          Gender
        </Label>
        <Select value={genderValue} onValueChange={onGenderChange}>
          <SelectTrigger className="h-10">
            <SelectValue placeholder="Select Identity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Male">Male</SelectItem>
            <SelectItem value="Female">Female</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs font-medium text-muted-foreground">
          Date of Birth
        </Label>
        <Input type="date" {...register("dateOfBirth")} className="h-10" />
      </div>
    </div>
  );
}
