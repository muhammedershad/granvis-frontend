/* eslint-disable @typescript-eslint/no-explicit-any */
import { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";
import NextImage from "next/image";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { DatePicker } from "./ui/date-picker";
import { type CreateEmployeeFormInput } from "@/lib/validations/employee";
import { Image as ImageIcon, X } from "lucide-react";

interface PersonalSectionProps {
  register: UseFormRegister<CreateEmployeeFormInput>;
  setValue: UseFormSetValue<CreateEmployeeFormInput>;
  errors: FieldErrors<CreateEmployeeFormInput>;
  formData: CreateEmployeeFormInput;
  imagePreview: string | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
}

export function AddEmployeePersonalSection({
  register,
  setValue,
  errors,
  formData,
  imagePreview,
  onImageChange,
  onRemoveImage,
}: PersonalSectionProps) {
  return (
    <div className="p-4 pt-2 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">
            First Name *
          </Label>
          <Input
            {...register("firstName")}
            placeholder="e.g. John"
            className="h-10"
            maxLength={50}
          />
          {errors.firstName && (
            <p className="text-[10px] text-red-500">
              {errors.firstName.message}
            </p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">
            Middle Name
          </Label>
          <Input
            {...register("middleName")}
            placeholder="e.g. Michael"
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
            placeholder="e.g. Doe"
            className="h-10"
            maxLength={50}
          />
          {errors.lastName && (
            <p className="text-[10px] text-red-500">
              {errors.lastName.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">
            Email Address *
          </Label>
          <Input
            type="email"
            {...register("email")}
            placeholder="john.doe@company.com"
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">
            Gender *
          </Label>
          <Select
            value={formData.gender}
            onValueChange={(value) => setValue("gender", value as any)}
          >
            <SelectTrigger className="h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
          {errors.gender && (
            <p className="text-[10px] text-red-500">{errors.gender.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">
            Date of Birth
          </Label>
          <DatePicker
            date={
              formData.dateOfBirth ? new Date(formData.dateOfBirth) : undefined
            }
            onDateChange={(date) => {
              setValue(
                "dateOfBirth",
                date ? date.toISOString().split("T")[0] : ""
              );
            }}
            placeholder="Select date of birth"
            fromYear={1950}
            toYear={new Date().getFullYear()}
          />
        </div>
      </div>

      {/* Employee Photo Upload */}
      <div className="space-y-2">
        <Label className="text-xs font-medium text-muted-foreground">
          Photo
        </Label>
        {!imagePreview ? (
          <div className="relative">
            <input
              id="employeePhoto"
              type="file"
              accept="image/*"
              onChange={onImageChange}
              className="hidden"
            />
            <label
              htmlFor="employeePhoto"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-lg cursor-pointer bg-gray-50/50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-300 group"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <ImageIcon className="h-8 w-8 text-muted-foreground mb-2 group-hover:text-orange-500 transition-colors" />
                <p className="text-xs text-muted-foreground">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
              </div>
            </label>
          </div>
        ) : (
          <div className="relative w-full h-48 border-2 border-gray-200 dark:border-white/10 rounded-lg overflow-hidden bg-gray-50/50 dark:bg-white/5">
            <NextImage
              src={imagePreview}
              alt="Employee preview"
              fill
              className="object-cover"
            />
            <button
              type="button"
              onClick={onRemoveImage}
              className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors shadow-lg z-10"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
