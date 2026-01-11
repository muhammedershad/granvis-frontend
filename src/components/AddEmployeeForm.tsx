'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Employee } from "../types/employee";
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
  Loader2
} from "lucide-react";

interface AddEmployeeFormProps {
  onSubmit: (employee: Omit<Employee, "id" | "createdAt" | "updatedAt">) => void;
  onCancel: () => void;
}

// Zod validation schemas
const personalInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  dateOfBirth: z.string().optional(),
});

const employmentInfoSchema = z.object({
  employeeId: z.string().min(1, "Employee ID is required"),
  position: z.string().min(1, "Position is required"),
  department: z.string().min(1, "Department is required"),
  team: z.string().optional(),
  manager: z.string().optional(),
  hireDate: z.string().min(1, "Hire date is required"),
  employmentStatus: z.enum(["Active", "Inactive", "On Leave", "Terminated"]),
  employmentType: z.enum(["Full-time", "Part-time", "Contract", "Intern"]),
  salary: z.string().optional(),
});

const addressSchema = z.object({
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
});

const emergencyContactSchema = z.object({
  emergencyContactName: z.string().optional(),
  emergencyContactRelationship: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
});

const professionalSchema = z.object({
  skills: z.string().optional(),
  experience: z.string().optional(),
  education: z.string().optional(),
  certifications: z.string().optional(),
});

const employeeFormSchema = personalInfoSchema
  .merge(employmentInfoSchema)
  .merge(addressSchema)
  .merge(emergencyContactSchema)
  .merge(professionalSchema);

type EmployeeFormData = z.infer<typeof employeeFormSchema>;

export function AddEmployeeForm({ onSubmit, onCancel }: AddEmployeeFormProps) {
  const [expandedSection, setExpandedSection] = useState<string>("personal");

  const {
    register,
    handleSubmit: handleFormSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      employeeId: "",
      position: "",
      department: "",
      team: "",
      manager: "",
      hireDate: "",
      employmentStatus: "Active",
      employmentType: "Full-time",
      salary: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "USA",
      emergencyContactName: "",
      emergencyContactRelationship: "",
      emergencyContactPhone: "",
      skills: "",
      experience: "",
      education: "",
      certifications: "",
    },
  });

  const formData = watch();

  const handleSubmit = (data: EmployeeFormData) => {
    const employee: Omit<Employee, "id" | "createdAt" | "updatedAt"> = {
      firstName: data.firstName,
      lastName: data.lastName,
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      phone: data.phone,
      employeeId: data.employeeId,
      position: data.position,
      department: data.department,
      team: data.team || "",
      manager: data.manager || "",
      hireDate: data.hireDate,
      joinDate: data.hireDate,
      employmentStatus: data.employmentStatus,
      status: data.employmentStatus,
      employmentType: data.employmentType,
      salary: parseFloat(data.salary || "0"),
      dateOfBirth: data.dateOfBirth || "",
      address: {
        street: data.street || "",
        city: data.city || "",
        state: data.state || "",
        zipCode: data.zipCode || "",
        country: data.country || "",
      },
      emergencyContact: {
        name: data.emergencyContactName || "",
        relationship: data.emergencyContactRelationship || "",
        phone: data.emergencyContactPhone || "",
      },
      skills: data.skills ? data.skills.split(",").map(s => s.trim()).filter(Boolean) : [],
      experience: parseInt(data.experience || "0"),
      education: data.education || "",
      certifications: data.certifications ? data.certifications.split(",").map(c => c.trim()).filter(Boolean) : [],
    };

    onSubmit(employee);
  };

  const hasPersonalErrors = !!(errors.firstName || errors.lastName || errors.email || errors.phone);
  const hasEmploymentErrors = !!(errors.employeeId || errors.position || errors.department || errors.hireDate);
  
  const SectionHeader = ({
    id,
    icon: Icon,
    title,
    subtitle,
    status,
    isActive,
    hasErrors
  }: {
    id: string;
    icon: React.ElementType;
    title: string;
    subtitle: string;
    status: string;
    isActive: boolean;
    hasErrors?: boolean;
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
      onClick={() => setExpandedSection(expandedSection === id ? "" : id)}
    >
      <div className="flex items-center gap-4">
        <div className={cn(
          "p-2.5 rounded-lg transition-colors duration-300",
          hasErrors 
            ? "bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400"
            : isActive
            ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30"
            : "bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 group-hover:bg-white dark:group-hover:bg-white/10"
        )}>
          {hasErrors ? <AlertCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
        </div>
        <div className="flex flex-col">
          <span className={cn(
            "font-semibold text-base transition-colors",
            hasErrors ? "text-red-700 dark:text-red-400" : "text-foreground"
          )}>
            {title}
          </span>
          <span className="text-sm text-muted-foreground">{subtitle}</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {!isActive && !hasErrors && (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
             <span className="text-xs font-medium text-muted-foreground">{status}</span>
             {status === "Completed" && <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />}
          </div>
        )}
        {isActive ? (
          <ChevronDown className={cn("w-5 h-5 transition-colors", hasErrors ? "text-red-400" : "text-orange-500")} />
        ) : (
          <ChevronRight className="w-5 h-5 text-gray-400" />
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      {/* Header Area */}
      <div className="relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br from-orange-50/50 to-pink-50/50 dark:from-white/5 dark:to-white/10 border border-orange-100/50 dark:border-white/10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-500/10 to-pink-500/10 dark:from-orange-400/10 dark:to-pink-400/10 blur-3xl -mr-16 -mt-16 rounded-full pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
              <Sparkles className="w-5 h-5" />
              <span className="font-semibold tracking-wide uppercase text-sm">New Team Member</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">
              Add Employee
            </h1>
            <p className="text-muted-foreground max-w-xl text-lg">
              Onboard a new team member.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleFormSubmit(handleSubmit)} className="space-y-4">
        <div className="space-y-3 bg-white dark:bg-black/40 p-4 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm dark:shadow-none">
          
          {/* Section 1: Personal Identity */}
          <div className="space-y-3">
            <SectionHeader
              id="personal"
              icon={User}
              title="Personal Identity"
              subtitle="Basic details and contact info"
              status={hasPersonalErrors ? "Error" : "Required"}
              isActive={expandedSection === "personal"}
              hasErrors={hasPersonalErrors}
            />
            {expandedSection === "personal" && (
              <div className="p-4 pt-2 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground/80">First Name <span className="text-red-500">*</span></Label>
                    <Input {...register("firstName")} placeholder="e.g. John" className="bg-gray-50/50 dark:bg-white/5 border-gray-200 dark:border-white/10 h-11 focus:ring-2 focus:ring-orange-500/20" />
                    {errors.firstName && <span className="text-xs text-red-500">{errors.firstName.message}</span>}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground/80">Last Name <span className="text-red-500">*</span></Label>
                    <Input {...register("lastName")} placeholder="e.g. Doe" className="bg-gray-50/50 dark:bg-white/5 border-gray-200 dark:border-white/10 h-11 focus:ring-2 focus:ring-orange-500/20" />
                    {errors.lastName && <span className="text-xs text-red-500">{errors.lastName.message}</span>}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground/80">Email <span className="text-red-500">*</span></Label>
                    <Input {...register("email")} type="email" placeholder="john.doe@company.com" className="bg-gray-50/50 dark:bg-white/5 border-gray-200 dark:border-white/10 h-11 focus:ring-2 focus:ring-orange-500/20" />
                    {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground/80">Phone <span className="text-red-500">*</span></Label>
                    <Input {...register("phone")} placeholder="+1 (555) 000-0000" className="bg-gray-50/50 dark:bg-white/5 border-gray-200 dark:border-white/10 h-11 focus:ring-2 focus:ring-orange-500/20" />
                    {errors.phone && <span className="text-xs text-red-500">{errors.phone.message}</span>}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground/80">Date of Birth</Label>
                    <Input {...register("dateOfBirth")} type="date" className="bg-gray-50/50 dark:bg-white/5 border-gray-200 dark:border-white/10 h-11 focus:ring-2 focus:ring-orange-500/20" />
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* Section 2: Employment Details */}
          <div className="space-y-3">
             <SectionHeader
              id="employment"
              icon={Briefcase}
              title="Employment Details"
              subtitle="Role, department and status"
              status={hasEmploymentErrors ? "Error" : "Required"}
              isActive={expandedSection === "employment"}
              hasErrors={hasEmploymentErrors}
            />
            {expandedSection === "employment" && (
              <div className="p-4 pt-2 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground/80">Employee ID <span className="text-red-500">*</span></Label>
                    <Input {...register("employeeId")} placeholder="EMP-001" className="bg-gray-50/50 dark:bg-white/5 border-gray-200 dark:border-white/10 h-11 focus:ring-2 focus:ring-orange-500/20" />
                    {errors.employeeId && <span className="text-xs text-red-500">{errors.employeeId.message}</span>}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground/80">Position <span className="text-red-500">*</span></Label>
                    <Input {...register("position")} placeholder="e.g. Senior Architect" className="bg-gray-50/50 dark:bg-white/5 border-gray-200 dark:border-white/10 h-11 focus:ring-2 focus:ring-orange-500/20" />
                    {errors.position && <span className="text-xs text-red-500">{errors.position.message}</span>}
                  </div>
                   <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground/80">Department <span className="text-red-500">*</span></Label>
                    <Select onValueChange={(val) => setValue("department", val)} defaultValue={formData.department}>
                      <SelectTrigger className="bg-gray-50/50 dark:bg-white/5 border-gray-200 dark:border-white/10 h-11">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Design">Design</SelectItem>
                        <SelectItem value="Interior Design">Interior Design</SelectItem>
                        <SelectItem value="Landscape">Landscape</SelectItem>
                        <SelectItem value="Engineering">Engineering</SelectItem>
                        <SelectItem value="Project Management">Project Management</SelectItem>
                        <SelectItem value="Administration">Administration</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.department && <span className="text-xs text-red-500">{errors.department.message}</span>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground/80">Team</Label>
                    <Input {...register("team")} placeholder="e.g. Residential Projects" className="bg-gray-50/50 dark:bg-white/5 border-gray-200 dark:border-white/10 h-11 focus:ring-2 focus:ring-orange-500/20" />
                  </div>
                   <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground/80">Manager</Label>
                    <Input {...register("manager")} placeholder="Manager's Name" className="bg-gray-50/50 dark:bg-white/5 border-gray-200 dark:border-white/10 h-11 focus:ring-2 focus:ring-orange-500/20" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground/80">Hire Date <span className="text-red-500">*</span></Label>
                    <Input {...register("hireDate")} type="date" className="bg-gray-50/50 dark:bg-white/5 border-gray-200 dark:border-white/10 h-11 focus:ring-2 focus:ring-orange-500/20" />
                    {errors.hireDate && <span className="text-xs text-red-500">{errors.hireDate.message}</span>}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground/80">Status</Label>
                    <Select onValueChange={(val) => setValue("employmentStatus", val as "Active" | "Inactive" | "On Leave" | "Terminated")} defaultValue={formData.employmentStatus}>
                      <SelectTrigger className="bg-gray-50/50 dark:bg-white/5 border-gray-200 dark:border-white/10 h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                        <SelectItem value="On Leave">On Leave</SelectItem>
                        <SelectItem value="Terminated">Terminated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground/80">Type</Label>
                    <Select onValueChange={(val) => setValue("employmentType", val as "Full-time" | "Part-time" | "Contract" | "Intern")} defaultValue={formData.employmentType}>
                       <SelectTrigger className="bg-gray-50/50 dark:bg-white/5 border-gray-200 dark:border-white/10 h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Full-time">Full-time</SelectItem>
                        <SelectItem value="Part-time">Part-time</SelectItem>
                        <SelectItem value="Contract">Contract</SelectItem>
                        <SelectItem value="Intern">Intern</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                 <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground/80">Annual Salary</Label>
                  <Input {...register("salary")} type="number" placeholder="0" className="bg-gray-50/50 dark:bg-white/5 border-gray-200 dark:border-white/10 h-11 focus:ring-2 focus:ring-orange-500/20" />
                </div>
                

              </div>
            )}
          </div>

          {/* Section 3: Address & Contact */}
          <div className="space-y-3">
             <SectionHeader
              id="address"
              icon={MapPin}
              title="Address & Location"
              subtitle="Home address and location details"
              status="Optional"
              isActive={expandedSection === "address"}
            />
            {expandedSection === "address" && (
              <div className="p-4 pt-2 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground/80">Street Address</Label>
                  <Input {...register("street")} placeholder="e.g. 123 Main St" className="bg-gray-50/50 dark:bg-white/5 border-gray-200 dark:border-white/10 h-11" />
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                   <div className="space-y-2 col-span-2">
                    <Label className="text-sm font-medium text-foreground/80">City</Label>
                    <Input {...register("city")} className="bg-gray-50/50 dark:bg-white/5 border-gray-200 dark:border-white/10 h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground/80">State</Label>
                    <Input {...register("state")} className="bg-gray-50/50 dark:bg-white/5 border-gray-200 dark:border-white/10 h-11" />
                  </div>
                   <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground/80">ZIP Code</Label>
                    <Input {...register("zipCode")} className="bg-gray-50/50 dark:bg-white/5 border-gray-200 dark:border-white/10 h-11" />
                  </div>
                </div>
                <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground/80">Country</Label>
                    <Input {...register("country")} className="bg-gray-50/50 dark:bg-white/5 border-gray-200 dark:border-white/10 h-11" />
                  </div>


              </div>
            )}
          </div>

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
              <div className="p-4 pt-2 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground/80">Name</Label>
                    <Input {...register("emergencyContactName")} className="bg-gray-50/50 dark:bg-white/5 border-gray-200 dark:border-white/10 h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground/80">Relationship</Label>
                    <Input {...register("emergencyContactRelationship")} className="bg-gray-50/50 dark:bg-white/5 border-gray-200 dark:border-white/10 h-11" />
                  </div>
                   <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground/80">Phone</Label>
                    <Input {...register("emergencyContactPhone")} className="bg-gray-50/50 dark:bg-white/5 border-gray-200 dark:border-white/10 h-11" />
                  </div>
                </div>

              </div>
             )}
          </div>
          
          {/* Section 5: Professional Profile */}
           <div className="space-y-3">
             <SectionHeader
              id="professional"
              icon={Building2}
              title="Professional Profile"
              subtitle="Skills, experience and education"
              status="Optional"
              isActive={expandedSection === "professional"}
            />
             {expandedSection === "professional" && (
              <div className="p-4 pt-2 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground/80">Years of Experience</Label>
                    <Input {...register("experience")} type="number" placeholder="0" className="bg-gray-50/50 dark:bg-white/5 border-gray-200 dark:border-white/10 h-11" />
                  </div>
                   <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground/80">Education</Label>
                    <Input {...register("education")} placeholder="Degree & University" className="bg-gray-50/50 dark:bg-white/5 border-gray-200 dark:border-white/10 h-11" />
                  </div>
                 </div>
                 
                 <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground/80">Skills (comma-separated)</Label>
                    <Textarea {...register("skills")} placeholder="AutoCAD, Revit, Project Management" className="bg-gray-50/50 dark:bg-white/5 border-gray-200 dark:border-white/10" />
                 </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground/80">Certifications (comma-separated)</Label>
                     <Textarea {...register("certifications")} placeholder="LEED AP, PMP" className="bg-gray-50/50 dark:bg-white/5 border-gray-200 dark:border-white/10" />
                 </div>
              </div>
             )}
           </div>

        </div>
        
        <div className="flex items-center justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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