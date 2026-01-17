/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from "react";
import NextImage from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Separator } from "./ui/separator";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { createEmployeeFormSchema, type CreateEmployeeFormInput } from "@/lib/validations/employee";
import { useCreateEmployeeMutation, useGetManagersQuery } from "@/lib/api/employeesApi";
import { toast } from "sonner";
import { cn } from "./ui/utils";
import {
  User,
  Building2,
  MapPin,
  Phone,
  Briefcase,
  Sparkles,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Image as ImageIcon,
  X,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { DatePicker } from "./ui/date-picker";

interface AddEmployeeFormProps {
  onSuccess?: () => void;
  onCancel: () => void;
}

export function AddEmployeeForm({ onSuccess, onCancel }: AddEmployeeFormProps) {
  const [createEmployee, { isLoading }] = useCreateEmployeeMutation();
  const { data: managers = [] } = useGetManagersQuery();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string>("personal");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [managerOpen, setManagerOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger
  } = useForm<CreateEmployeeFormInput>({
    resolver: zodResolver(createEmployeeFormSchema),
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      phone: "",
      avatar: "",
      gender: "Male",
      dateOfBirth: "",
      employeeId: `EMP-${Date.now()}`,
      position: "",
      department: "architecture",
      managerId: "",
      hireDate: "",
      joinDate: new Date().toISOString().split('T')[0],
      employmentStatus: "Active",
      employmentType: "Full-time",
      role: "employee",
      salary: "",
      address: {
        street: "",
        city: "",
        state: "",
        pinCode: "",
        country: "India",
      },
      emergencyContact: {
        name: "",
        relationship: "",
        phone: "",
      },
      skillsInput: "",
      experience: "",
      education: {
        degree: "",
        university: "",
        dateOfPassing: "",
      },
      certificationsInput: "",
    },
  });

  const formData = watch();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setValue("avatar", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageFile(null);
    setValue("avatar", "");
  };

  const onSubmit = async (data: CreateEmployeeFormInput) => {
    setSubmitError(null);
    try {
      // Transform the data to match the API schema
      const employeeData = {
        firstName: data.firstName,
        middleName: data.middleName,
        lastName: data.lastName,
        name: [data.firstName, data.middleName, data.lastName].filter(Boolean).join(' '),
        email: data.email,
        phone: data.phone,
        avatar: data.avatar,
        gender: data.gender,
        dateOfBirth: data.dateOfBirth,
        employeeId: data.employeeId,
        position: data.position,
        department: data.department,
        managerId: data.managerId || undefined,
        manager: data.managerId ? managers.find(m => m.id === data.managerId)?.name : undefined,
        hireDate: data.hireDate,
        joinDate: data.joinDate,
        employmentStatus: data.employmentStatus,
        status: data.employmentStatus,
        employmentType: data.employmentType,
        role: data.role,
        salary: data.salary ? parseFloat(data.salary) : undefined,
        address: {
          street: data.address.street,
          city: data.address.city,
          state: data.address.state,
          pinCode: data.address.pinCode,
          country: data.address.country,
        },
        emergencyContact: data.emergencyContact?.name ? {
          name: data.emergencyContact.name,
          relationship: data.emergencyContact.relationship || "",
          phone: data.emergencyContact.phone || "",
        } : undefined,
        skills: data.skillsInput ? data.skillsInput.split(",").map(s => s.trim()).filter(Boolean) : [],
        experience: data.experience ? parseInt(data.experience) : 0,
        education: data.education?.degree ? {
          degree: data.education.degree,
          university: data.education.university || "",
          dateOfPassing: data.education.dateOfPassing || "",
        } : undefined,
        certifications: data.certificationsInput ? data.certificationsInput.split(",").map(c => c.trim()).filter(Boolean) : [],
      };

      await createEmployee(employeeData as any).unwrap();
      const displayName = [data.firstName, data.middleName, data.lastName].filter(Boolean).join(' ');
      toast.success("Employee added successfully!", {
        description: `${displayName} has been added to your team.`,
      });
      onSuccess?.();
    } catch (error) {
      console.error("Failed to create employee:", error);
      let errorMessage = "Failed to add employee. Please try again.";
      const err = error as { data?: { message?: string } | string; message?: string };
      if (err?.data && typeof err.data === 'object' && err.data.message) {
        errorMessage = err.data.message;
      } else if (err?.message) {
        errorMessage = err.message;
      }
      setSubmitError(errorMessage);
      toast.error("Failed to Add Employee", { description: errorMessage });
    }
  };

  // Function to handle section change with validation
  const handleSectionChange = async (sectionId: string) => {
    // If clicking the same section to close it, validate before closing
    if (expandedSection === sectionId) {
      let fieldsToValidate: (keyof CreateEmployeeFormInput)[] = [];

      // Determine which fields to validate based on current section
      if (sectionId === "personal") {
        fieldsToValidate = ["firstName", "lastName", "email", "phone", "gender"];
      } else if (sectionId === "employment") {
        fieldsToValidate = ["employeeId", "position", "department", "hireDate", "joinDate", "employmentStatus", "employmentType", "role"];
      } else if (sectionId === "address") {
        fieldsToValidate = ["address"];
      }

      // Only validate required sections
      if (fieldsToValidate.length > 0) {
        const isValid = await trigger(fieldsToValidate);

        // If validation fails, prevent closing and show toast
        if (!isValid) {
          toast.error("Validation Error", {
            description: "Please fix all errors before closing this section"
          });
          return;
        }
      }
    }

    // Toggle section
    setExpandedSection(expandedSection === sectionId ? "" : sectionId);
  };

  // Check for errors in each section
  const hasPersonalErrors = !!(errors.firstName || errors.lastName || errors.email || errors.phone || errors.gender);
  const hasEmploymentErrors = !!(errors.position || errors.department || errors.hireDate || errors.joinDate || errors.employmentStatus || errors.employmentType || errors.role);
  const hasAddressErrors = !!(errors.address?.street || errors.address?.city || errors.address?.state || errors.address?.pinCode || errors.address?.country);

  // Check if sections are completed (all required fields filled and no errors)
  const isPersonalCompleted = !hasPersonalErrors &&
    !!formData.firstName &&
    !!formData.lastName &&
    !!formData.email &&
    !!formData.phone &&
    !!formData.gender;

  const isEmploymentCompleted = !hasEmploymentErrors &&
    !!formData.employeeId &&
    !!formData.position &&
    !!formData.department &&
    !!formData.hireDate &&
    !!formData.joinDate &&
    !!formData.employmentStatus &&
    !!formData.employmentType &&
    !!formData.role;

  const isAddressCompleted = !hasAddressErrors &&
    !!formData.address.street &&
    !!formData.address.city &&
    !!formData.address.state &&
    !!formData.address.pinCode &&
    !!formData.address.country;

  const SectionHeader = ({
    id,
    icon: Icon,
    title,
    subtitle,
    status,
    isActive,
    hasErrors,
    isCompleted
  }: {
    id: string;
    icon: React.ElementType;
    title: string;
    subtitle: string;
    status: string;
    isActive: boolean;
    hasErrors?: boolean;
    isCompleted?: boolean;
  }) => (
    <div
      className={cn(
        "flex items-center justify-between p-4 cursor-pointer transition-all border rounded-xl",
        hasErrors
          ? "bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-900/50"
          : isActive
          ? "bg-white/70 dark:bg-white/5 border-orange-500/20 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_0_20px_rgba(0,0,0,0.3)]"
          : "border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5"
      )}
      onClick={() => handleSectionChange(id)}
    >
      <div className="flex items-center gap-4">
        <div className={cn(
          "p-2.5 rounded-xl border transition-all",
          hasErrors
            ? "bg-red-500/10 dark:bg-red-500/20 border-red-500/30 text-red-600 dark:text-red-400"
            : isActive
            ? "bg-orange-500/10 dark:bg-orange-500/20 border-orange-500/30 text-orange-600 dark:text-orange-400"
            : "bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/10 text-muted-foreground"
        )}>
          {hasErrors ? <AlertCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
        </div>
        <div>
          <h3 className="font-semibold text-foreground text-sm tracking-tight">{title}</h3>
          <p className={cn(
            "text-xs",
            hasErrors ? "text-red-600 dark:text-red-400" : "text-muted-foreground"
          )}>{hasErrors ? "Please fix errors" : subtitle}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          {hasErrors ? (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
              <AlertCircle className="w-3 h-3 text-red-600 dark:text-red-400" />
              Error
            </div>
          ) : isActive ? (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-[10px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
              <span className="w-1 h-1 rounded-full bg-orange-500 dark:bg-orange-400 animate-pulse" />
              In Progress
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              {isCompleted ? "Completed" : status}
            </div>
          )}
        </div>
        {isActive ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Header Area */}
      <div className="relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br from-orange-50/50 to-pink-50/50 dark:from-white/5 dark:to-white/10 border border-orange-100/50 dark:border-white/10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-500/10 to-pink-500/10 dark:from-orange-400/10 dark:to-pink-400/10 blur-3xl -mr-16 -mt-16 rounded-full pointer-events-none"></div>

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-orange-500 to-pink-600 shadow-lg shadow-orange-500/20">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">New Team Member</h2>
              <p className="text-sm text-gray-500 dark:text-muted-foreground font-medium">Employee Onboarding</p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {submitError && (
          <Alert variant="destructive" className="bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Submission Error</AlertTitle>
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-3 bg-white dark:bg-black/40 p-4 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm dark:shadow-none">

          {/* Section 1: Personal Identity */}
          <div className="space-y-3">
            <SectionHeader
              id="personal"
              icon={User}
              title="Personal Identity"
              subtitle="Basic details and contact information"
              status="Required"
              isActive={expandedSection === "personal"}
              hasErrors={hasPersonalErrors}
              isCompleted={isPersonalCompleted}
            />
            {expandedSection === "personal" && (
              <div className="p-4 pt-2 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground">First Name *</Label>
                    <Input {...register("firstName")} placeholder="e.g. John" className="h-10" maxLength={50} />
                    {errors.firstName && <p className="text-[10px] text-red-500">{errors.firstName.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground">Middle Name</Label>
                    <Input {...register("middleName")} placeholder="e.g. Michael" className="h-10" maxLength={50} />
                    {errors.middleName && <p className="text-[10px] text-red-500">{errors.middleName.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground">Last Name *</Label>
                    <Input {...register("lastName")} placeholder="e.g. Doe" className="h-10" maxLength={50} />
                    {errors.lastName && <p className="text-[10px] text-red-500">{errors.lastName.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground">Email Address *</Label>
                    <Input type="email" {...register("email")} placeholder="john.doe@company.com" className="h-10" />
                    {errors.email && <p className="text-[10px] text-red-500">{errors.email.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground">Phone Number *</Label>
                    <Input {...register("phone")} placeholder="+91 98765 43210" className="h-10" />
                    {errors.phone && <p className="text-[10px] text-red-500">{errors.phone.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground">Gender *</Label>
                    <Select value={formData.gender} onValueChange={(value) => setValue("gender", value as any)}>
                      <SelectTrigger className="h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.gender && <p className="text-[10px] text-red-500">{errors.gender.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground">Date of Birth</Label>
                    <DatePicker
                      date={formData.dateOfBirth ? new Date(formData.dateOfBirth) : undefined}
                      onDateChange={(date) => {
                        setValue("dateOfBirth", date ? date.toISOString().split('T')[0] : "");
                      }}
                      placeholder="Select date of birth"
                      fromYear={1950}
                      toYear={new Date().getFullYear()}
                    />
                  </div>
                </div>

                {/* Employee Photo Upload */}
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground">Photo</Label>
                  {!imagePreview ? (
                    <div className="relative">
                      <input
                        id="employeePhoto"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="employeePhoto"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-lg cursor-pointer bg-gray-50/50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-300 group"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <ImageIcon className="h-8 w-8 text-muted-foreground mb-2 group-hover:text-orange-500 transition-colors" />
                          <p className="text-xs text-muted-foreground">
                            <span className="font-semibold">Click to upload</span> or drag and drop
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
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors shadow-lg z-10"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <Separator className="bg-gray-100 dark:bg-white/5" />

          {/* Section 2: Employment Details */}
          <div className="space-y-3">
            <SectionHeader
              id="employment"
              icon={Briefcase}
              title="Employment Details"
              subtitle="Role, department, and work information"
              status="Required"
              isActive={expandedSection === "employment"}
              hasErrors={hasEmploymentErrors}
              isCompleted={isEmploymentCompleted}
            />
            {expandedSection === "employment" && (
              <div className="p-4 pt-2 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground">Employee ID *</Label>
                    <Input {...register("employeeId")} placeholder="EMP-XXXX" className="h-10" readOnly />
                    {errors.employeeId && <p className="text-[10px] text-red-500">{errors.employeeId.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground">Position *</Label>
                    <Input {...register("position")} placeholder="e.g. Senior Architect" className="h-10" />
                    {errors.position && <p className="text-[10px] text-red-500">{errors.position.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground">Department *</Label>
                    <Select value={formData.department} onValueChange={(val) => setValue("department", val as any)}>
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
                    {errors.department && <p className="text-[10px] text-red-500">{errors.department.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground">Role *</Label>
                    <Select value={formData.role} onValueChange={(val) => setValue("role", val as any)}>
                      <SelectTrigger className="h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="employee">Employee</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="super_admin">Super Admin</SelectItem>
                        <SelectItem value="accountant">Accountant</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.role && <p className="text-[10px] text-red-500">{errors.role.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground">Manager</Label>
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
                      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
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
                                      formData.managerId === manager.id ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  <div className="flex flex-col">
                                    <span className="text-sm font-medium">{manager.name}</span>
                                    <span className="text-xs text-muted-foreground capitalize">{manager.role?.replace('_', ' ')} • {manager.position}</span>
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
                    <Label className="text-xs font-medium text-muted-foreground">Salary</Label>
                    <Input type="number" {...register("salary")} placeholder="0" className="h-10" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground">Hire Date *</Label>
                    <DatePicker
                      date={formData.hireDate ? new Date(formData.hireDate) : undefined}
                      onDateChange={(date) => {
                        setValue("hireDate", date ? date.toISOString().split('T')[0] : "");
                      }}
                      placeholder="Select hire date"
                    />
                    {errors.hireDate && <p className="text-[10px] text-red-500">{errors.hireDate.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground">Join Date *</Label>
                    <DatePicker
                      date={formData.joinDate ? new Date(formData.joinDate) : undefined}
                      onDateChange={(date) => {
                        setValue("joinDate", date ? date.toISOString().split('T')[0] : "");
                      }}
                      placeholder="Select join date"
                    />
                    {errors.joinDate && <p className="text-[10px] text-red-500">{errors.joinDate.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground">Status *</Label>
                    <Select value={formData.employmentStatus} onValueChange={(val) => setValue("employmentStatus", val as any)}>
                      <SelectTrigger className="h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.employmentStatus && <p className="text-[10px] text-red-500">{errors.employmentStatus.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground">Type *</Label>
                    <Select value={formData.employmentType} onValueChange={(val) => setValue("employmentType", val as any)}>
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
                    {errors.employmentType && <p className="text-[10px] text-red-500">{errors.employmentType.message}</p>}
                  </div>
                </div>
              </div>
            )}
          </div>

          <Separator className="bg-gray-100 dark:bg-white/5" />

          {/* Section 3: Address & Location */}
          <div className="space-y-3">
            <SectionHeader
              id="address"
              icon={MapPin}
              title="Address & Location"
              subtitle="Home address and location details"
              status="Required"
              isActive={expandedSection === "address"}
              hasErrors={hasAddressErrors}
              isCompleted={isAddressCompleted}
            />
            {expandedSection === "address" && (
              <div className="p-4 pt-2 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground">Street Address *</Label>
                  <Input {...register("address.street")} placeholder="e.g. 123 Main St" className="h-10" />
                  {errors.address?.street && <p className="text-[10px] text-red-500">{errors.address.street.message}</p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground">City *</Label>
                    <Input {...register("address.city")} placeholder="Mananthavady" className="h-10" />
                    {errors.address?.city && <p className="text-[10px] text-red-500">{errors.address.city.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground">State *</Label>
                    <Input {...register("address.state")} placeholder="Kerala" className="h-10" />
                    {errors.address?.state && <p className="text-[10px] text-red-500">{errors.address.state.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground">Pin Code *</Label>
                    <Input {...register("address.pinCode")} placeholder="670731" className="h-10" />
                    {errors.address?.pinCode && <p className="text-[10px] text-red-500">{errors.address.pinCode.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground">Country *</Label>
                    <Input {...register("address.country")} placeholder="India" className="h-10" />
                    {errors.address?.country && <p className="text-[10px] text-red-500">{errors.address.country.message}</p>}
                  </div>
                </div>
              </div>
            )}
          </div>

          <Separator className="bg-gray-100 dark:bg-white/5" />

          {/* Section 4: Emergency Contact */}
          <div className="space-y-3">
            <SectionHeader
              id="emergency"
              icon={Phone}
              title="Emergency Contact"
              subtitle="Who to call in an emergency"
              status="Optional"
              isActive={expandedSection === "emergency"}
            />
            {expandedSection === "emergency" && (
              <div className="p-4 pt-2 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground">Name</Label>
                    <Input {...register("emergencyContact.name")} placeholder="Contact Name" className="h-10" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground">Relationship</Label>
                    <Input {...register("emergencyContact.relationship")} placeholder="e.g. Spouse" className="h-10" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground">Phone</Label>
                    <Input {...register("emergencyContact.phone")} placeholder="+91 98765 43210" className="h-10" />
                  </div>
                </div>
              </div>
            )}
          </div>

          <Separator className="bg-gray-100 dark:bg-white/5" />

          {/* Section 5: Professional Profile */}
          <div className="space-y-3">
            <SectionHeader
              id="professional"
              icon={Building2}
              title="Professional Profile"
              subtitle="Skills, experience, and education"
              status="Optional"
              isActive={expandedSection === "professional"}
            />
            {expandedSection === "professional" && (
              <div className="p-4 pt-2 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground">Years of Experience</Label>
                    <Input type="number" {...register("experience")} placeholder="0" className="h-10" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground">Degree</Label>
                    <Input {...register("education.degree")} placeholder="e.g. Bachelor of Architecture" className="h-10" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground">University</Label>
                    <Input {...register("education.university")} placeholder="e.g. MIT" className="h-10" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground">Date of Passing</Label>
                    <DatePicker
                      date={formData.education?.dateOfPassing ? new Date(formData.education.dateOfPassing) : undefined}
                      onDateChange={(date) => {
                        setValue("education.dateOfPassing", date ? date.toISOString().split('T')[0] : "");
                      }}
                      placeholder="Select date of passing"
                      fromYear={1970}
                      toYear={new Date().getFullYear() + 5}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground">Skills (comma-separated)</Label>
                  <Textarea {...register("skillsInput")} placeholder="AutoCAD, Revit, Project Management" className="min-h-[80px]" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground">Certifications (comma-separated)</Label>
                  <Textarea {...register("certificationsInput")} placeholder="LEED AP, PMP" className="min-h-[80px]" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Employee"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
