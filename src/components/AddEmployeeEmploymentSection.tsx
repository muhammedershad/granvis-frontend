import {
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormTrigger,
} from "react-hook-form";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { DatePicker } from "./ui/date-picker";
import { type CreateEmployeeFormInput } from "@/lib/validations/employee";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "./ui/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useSelector } from "react-redux";
import { IAuthRoles, getAuthDetails } from "@/store/slices/authSlice";
import { getRoleOptions } from "@/lib/rbac";
import { dateToUTC } from "@/lib/utils/date";

interface Manager {
  id: string;
  name: string;
  role?: string;
  position?: string;
}

interface EmploymentSectionProps {
  register: UseFormRegister<CreateEmployeeFormInput>;
  setValue: UseFormSetValue<CreateEmployeeFormInput>;
  trigger: UseFormTrigger<CreateEmployeeFormInput>;
  errors: FieldErrors<CreateEmployeeFormInput>;
  formData: CreateEmployeeFormInput;
  managers: Manager[];
  managerOpen: boolean;
  setManagerOpen: (open: boolean) => void;
}

export function AddEmployeeEmploymentSection({
  register,
  setValue,
  trigger,
  errors,
  formData,
  managers,
  managerOpen,
  setManagerOpen,
}: EmploymentSectionProps) {
  // Get current user's role from auth state
  const { user } = useSelector(getAuthDetails);
  const currentUserRole = user?.role as IAuthRoles | undefined;

  // Get allowed roles based on current user's role
  const allowedRoles = getRoleOptions(currentUserRole);

  return (
    <div className="p-4 pt-2 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">
            Position *
          </Label>
          <Input
            {...register("position")}
            placeholder="e.g. Senior Architect"
            className="h-10"
            onBlur={() => trigger("position")}
          />
          {errors.position && (
            <p className="text-[10px] text-red-500">
              {errors.position.message}
            </p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">
            Employment Type *
          </Label>
          <Select
            value={formData.employmentType}
            onValueChange={(val) => setValue("employmentType", val as any)}
          >
            <SelectTrigger className="h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Full-time">Full-time</SelectItem>
              <SelectItem value="Part-time">Part-time</SelectItem>
              <SelectItem value="Contract">Contract</SelectItem>
              <SelectItem value="Intern">Intern</SelectItem>
            </SelectContent>
          </Select>
          {errors.employmentType && (
            <p className="text-[10px] text-red-500">
              {errors.employmentType.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">
            Department *
          </Label>
          <Select
            value={formData.department}
            onValueChange={(val) => setValue("department", val as any)}
          >
            <SelectTrigger className="h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="architecture">Architecture</SelectItem>
              <SelectItem value="interior">Interior</SelectItem>
              <SelectItem value="landscape">Landscape</SelectItem>
              <SelectItem value="construction">Construction</SelectItem>
              <SelectItem value="drafting">Drafting</SelectItem>
              <SelectItem value="accountant">Accountant</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
            </SelectContent>
          </Select>
          {errors.department && (
            <p className="text-[10px] text-red-500">
              {errors.department.message}
            </p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">
            Role *
          </Label>
          <Select
            value={formData.role}
            onValueChange={(val) => setValue("role", val as any)}
          >
            <SelectTrigger className="h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {allowedRoles.length > 0 ? (
                allowedRoles.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="employee" disabled>
                  No roles available
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          {errors.role && (
            <p className="text-[10px] text-red-500">{errors.role.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">
            Manager
          </Label>
          <Popover open={managerOpen} onOpenChange={setManagerOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className={cn(
                  "w-full justify-between h-10 font-normal",
                  !formData.managerId && "text-muted-foreground"
                )}
              >
                {formData.managerId
                  ? managers.find((m) => m.id === formData.managerId)?.name
                  : "Select manager"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-[var(--radix-popover-trigger-width)] p-0"
              align="start"
            >
              <Command>
                <CommandInput placeholder="Search manager..." className="h-9" />
                <CommandList>
                  <CommandEmpty>
                    {managers.length === 0
                      ? "No managers available. Create employees with Manager, Admin, or Super Admin roles first."
                      : "No manager found with that name."}
                  </CommandEmpty>
                  <CommandGroup>
                    {managers.map((manager) => (
                      <CommandItem
                        key={manager.id}
                        value={manager.name}
                        onSelect={() => {
                          setValue("managerId", manager.id);
                          setManagerOpen(false);
                        }}
                        className="cursor-pointer"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            formData.managerId === manager.id
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">
                            {manager.name}
                          </span>
                          <span className="text-xs text-muted-foreground capitalize">
                            {manager.role?.replace("_", " ")} •{" "}
                            {manager.position}
                          </span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">
            Salary
          </Label>
          <Input
            type="number"
            {...register("salary")}
            placeholder="0"
            className="h-10"
            onBlur={() => trigger("salary")}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">
            Hire Date *
          </Label>
          <DatePicker
            date={formData.hireDate ? new Date(formData.hireDate) : undefined}
            onDateChange={(date) => {
              setValue("hireDate", dateToUTC(date));
            }}
            onBlur={() => trigger("hireDate")}
            placeholder="Select hire date"
          />
          {errors.hireDate && (
            <p className="text-[10px] text-red-500">
              {errors.hireDate.message}
            </p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">
            Join Date *
          </Label>
          <DatePicker
            date={formData.joinDate ? new Date(formData.joinDate) : undefined}
            onDateChange={(date) => {
              setValue("joinDate", dateToUTC(date));
            }}
            onBlur={() => trigger("joinDate")}
            placeholder="Select join date"
          />
          {errors.joinDate && (
            <p className="text-[10px] text-red-500">
              {errors.joinDate.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">
            Status *
          </Label>
          <Select
            value={formData.employmentStatus}
            onValueChange={(val) => setValue("employmentStatus", val as any)}
          >
            <SelectTrigger className="h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
            </SelectContent>
          </Select>
          {errors.employmentStatus && (
            <p className="text-[10px] text-red-500">
              {errors.employmentStatus.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
