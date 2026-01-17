/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Separator } from "./ui/separator";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { createClientSchema, type CreateClientFormData } from "@/lib/validations/client";
import { useCreateClientMutation } from "@/lib/api/clientsApi";
import { toast } from "sonner";
import {
  Loader2,
  AlertCircle,
  User,
  Briefcase,
  MapPin,
  Activity,
  PlusCircle,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Sparkles,
  X as XIcon
} from "lucide-react";
import { cn } from "./ui/utils";

interface AddClientFormProps {
  onSuccess?: () => void;
  onCancel: () => void;
}

export function AddClientForm({ onSuccess, onCancel }: AddClientFormProps) {
  const [createClient, { isLoading }] = useCreateClientMutation();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string>("personal");
  const [tagsList, setTagsList] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<CreateClientFormData>({
    resolver: zodResolver(createClientSchema),
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      phone: "",
      alternatePhone: "",
      dateOfBirth: "",
      gender: "Male",
      occupation: "",
      employer: "",
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      spouseName: "",
      spousePhone: "",
      spouseEmail: "",
      emergencyContactName: "",
      emergencyContactRelationship: "",
      emergencyContactPhone: "",
      status: "Potential Lead",
      source: "Website",
      priority: "Medium",
      preferredContactMethod: "",
      preferredContactTime: "",
      architecturalStyle: "",
      architecturalStyleOther: "",
      budgetRange: "",
      notes: "",
      tags: "",
      createdBy: "Current User"
    }
  });

  const onSubmit = async (data: CreateClientFormData) => {
    setSubmitError(null);
    try {
      const fullName = [data.firstName, data.middleName, data.lastName].filter(Boolean).join(' ');
      const clientData = {
        firstName: data.firstName,
        lastName: data.lastName,
        fullName: fullName,
        name: fullName,
        email: data.email || "",
        phone: data.phone,
        website: undefined,
        companyName: data.employer || fullName,
        companyType: 'Individual' as const,
        industry: data.occupation || 'Other',
        address: {
          street: data.street,
          city: data.city,
          state: data.state,
          zipCode: data.postalCode,
          country: data.country
        },
        primaryContact: {
          name: fullName,
          title: data.occupation || 'Client',
          email: data.email || "",
          phone: data.phone
        },
        secondaryContact: data.spouseName ? {
          name: data.spouseName,
          title: 'Spouse',
          email: data.spouseEmail || "",
          phone: data.spousePhone || ""
        } : undefined,
        status: data.status,
        source: data.source,
        priority: data.priority,
        totalProjectValue: 0,
        projectsCount: 0,
        notes: data.notes || "",
        tags: data.tags ? data.tags.split(",").map(tag => tag.trim()).filter(Boolean) : [],
        projectIds: [],
        activeProjects: 0,
        completedProjects: 0,
        createdBy: data.createdBy
      };

      await createClient(clientData).unwrap();
      const displayName = [data.firstName, data.middleName, data.lastName].filter(Boolean).join(' ');
      toast.success("Client added successfully!", {
        description: `${displayName} has been added to your clients.`,
      });
      onSuccess?.();
    } catch (error) {
      console.error("Failed to create client:", error);
      let errorMessage = "Failed to add client. Please try again.";
      const err = error as { data?: { message?: string } | string; message?: string };
      if (err?.data && typeof err.data === 'object' && err.data.message) {
        errorMessage = err.data.message;
      } else if (err?.message) {
        errorMessage = err.message;
      }
      setSubmitError(errorMessage);
      toast.error("Failed to Add Client", { description: errorMessage });
    }
  };

  const statusValue = watch("status");
  const priorityValue = watch("priority");
  const genderValue = watch("gender");
  const architecturalStyleValue = watch("architecturalStyle");

  // Check for errors in each section
  const hasPersonalErrors = !!(errors.firstName || errors.middleName || errors.lastName || errors.email || errors.phone || errors.dateOfBirth || errors.gender);
  const hasProfessionalErrors = !!(errors.occupation || errors.employer);
  const hasAddressErrors = !!(errors.street || errors.city || errors.state || errors.postalCode || errors.country);
  const hasStatusErrors = !!(errors.status || errors.priority || errors.architecturalStyle || errors.architecturalStyleOther);
  const hasNotesErrors = !!(errors.notes || errors.tags);

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
    icon: any;
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
              {status}
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
      <div className="relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-white/5 dark:to-white/10 border border-indigo-100/50 dark:border-white/10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full -mr-32 -mt-32 blur-[80px]" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 dark:bg-blue-500/10 rounded-full -ml-32 -mb-32 blur-[80px]" />
        
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">New Client Intake</h2>
              <p className="text-sm text-gray-500 dark:text-muted-foreground font-medium">Lead Management</p>
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

        {/* Roadmap Style Sections */}
        <div className="space-y-3 bg-white dark:bg-black/40 p-4 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm dark:shadow-none">
          {/* Section 1: Personal */}
          <div className="space-y-3">
            <SectionHeader
              id="personal"
              icon={User}
              title="Personal Information"
              subtitle="Core identity and primary contact details"
              status="Required"
              isActive={expandedSection === "personal"}
              hasErrors={hasPersonalErrors}
            />
            {expandedSection === "personal" && (
              <div className="p-4 pt-2 grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground">First Name *</Label>
                  <Input {...register("firstName")} placeholder="e.g. Liam" className="h-10" maxLength={50} />
                  {errors.firstName && <p className="text-[10px] text-red-500">{errors.firstName.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground">Middle Name</Label>
                  <Input {...register("middleName")} placeholder="e.g. James" className="h-10" maxLength={50} />
                  {errors.middleName && <p className="text-[10px] text-red-500">{errors.middleName.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground">Last Name *</Label>
                  <Input {...register("lastName")} placeholder="e.g. Chen" className="h-10" maxLength={50} />
                  {errors.lastName && <p className="text-[10px] text-red-500">{errors.lastName.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground">Email Address</Label>
                  <Input type="email" {...register("email")} placeholder="liam.chen@example.com" className="h-10" />
                  {errors.email && <p className="text-[10px] text-red-500">{errors.email.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground">Phone Number *</Label>
                  <Input {...register("phone")} placeholder="+1 (555) 000-0000" className="h-10" />
                  {errors.phone && <p className="text-[10px] text-red-500">{errors.phone.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground">Gender</Label>
                  <Select value={genderValue} onValueChange={(value) => setValue("gender", value)}>
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
                  <Label className="text-xs font-medium text-muted-foreground">Date of Birth</Label>
                  <Input type="date" {...register("dateOfBirth")} className="h-10" />
                </div>
              </div>
            )}
          </div>

          <Separator className="bg-gray-100 dark:bg-white/5" />

          {/* Section 2: Professional */}
          <div className="space-y-3">
            <SectionHeader
              id="professional"
              icon={Briefcase}
              title="Work & Profession"
              subtitle="Industry context and occupational background"
              status="Completed"
              isActive={expandedSection === "professional"}
              hasErrors={hasProfessionalErrors}
            />
            {expandedSection === "professional" && (
              <div className="p-4 pt-2 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground">Occupation</Label>
                  <Input {...register("occupation")} placeholder="e.g. Project Lead" className="h-10" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground">Employer</Label>
                  <Input {...register("employer")} placeholder="e.g. TechCorp" className="h-10" />
                </div>
              </div>
            )}
          </div>

          <Separator className="bg-gray-100 dark:bg-white/5" />

          {/* Section 3: Address */}
          <div className="space-y-3">
            <SectionHeader
              id="address"
              icon={MapPin}
              title="Location Details"
              subtitle="Physical address for project planning"
              status="Required"
              isActive={expandedSection === "address"}
              hasErrors={hasAddressErrors}
            />
            {expandedSection === "address" && (
              <div className="p-4 pt-2 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground">Street Address *</Label>
                  <Input {...register("street")} placeholder="e.g. 123 Main St" className="h-10" />
                  {errors.street && <p className="text-[10px] text-red-500">{errors.street.message}</p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground">City *</Label>
                    <Input {...register("city")} placeholder="Mananthavady" className="h-10" />
                    {errors.city && <p className="text-[10px] text-red-500">{errors.city.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground">State *</Label>
                    <Input {...register("state")} placeholder="Kerala" className="h-10" />
                    {errors.state && <p className="text-[10px] text-red-500">{errors.state.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground">Postal Code *</Label>
                    <Input {...register("postalCode")} placeholder="670731" className="h-10" />
                    {errors.postalCode && <p className="text-[10px] text-red-500">{errors.postalCode.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground">Country *</Label>
                    <Input {...register("country")} placeholder="India" className="h-10" />
                    {errors.country && <p className="text-[10px] text-red-500">{errors.country.message}</p>}
                  </div>
                </div>
              </div>
            )}
          </div>

          <Separator className="bg-gray-100 dark:bg-white/5" />

          {/* Section 4: Status */}
          <div className="space-y-3">
            <SectionHeader
              id="status"
              icon={Activity}
              title="Lifecycle & Status"
              subtitle="Current position in the client journey"
              status="Action Needed"
              isActive={expandedSection === "status"}
              hasErrors={hasStatusErrors}
            />
            {expandedSection === "status" && (
              <div className="p-4 pt-2 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground">Client Status</Label>
                  <Select value={statusValue} onValueChange={(v) => setValue("status", v as any)}>
                    <SelectTrigger className="h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Potential Lead">Potential Lead</SelectItem>
                      <SelectItem value="On Hold">On Hold</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground">Priority Rank</Label>
                  <Select value={priorityValue} onValueChange={(v) => setValue("priority", v as any)}>
                    <SelectTrigger className="h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="VIP">VIP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2 space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground">Architectural Interest</Label>
                  <Select value={architecturalStyleValue} onValueChange={(v) => setValue("architecturalStyle", v)}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Style Profile" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Modern">Modern</SelectItem>
                      <SelectItem value="Contemporary">Contemporary</SelectItem>
                      <SelectItem value="Traditional">Traditional</SelectItem>
                      <SelectItem value="Industrial">Industrial</SelectItem>
                      <SelectItem value="Scandinavian">Scandinavian</SelectItem>
                      <SelectItem value="Minimalist">Minimalist</SelectItem>
                      <SelectItem value="Mediterranean">Mediterranean</SelectItem>
                      <SelectItem value="Sustainable">Sustainable/Green</SelectItem>
                      <SelectItem value="Art Deco">Art Deco</SelectItem>
                      <SelectItem value="Colonial">Colonial</SelectItem>
                      <SelectItem value="Craftsman">Craftsman</SelectItem>
                      <SelectItem value="Victorian">Victorian</SelectItem>
                      <SelectItem value="Mid-Century Modern">Mid-Century Modern</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {architecturalStyleValue === "Other" && (
                  <div className="md:col-span-2 space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground">Please Specify Architectural Style</Label>
                    <Input {...register("architecturalStyleOther")} placeholder="Enter custom architectural style" className="h-10" />
                  </div>
                )}
              </div>
            )}
          </div>

          <Separator className="bg-gray-100 dark:bg-white/5" />

          {/* Section 5: Notes */}
          <div className="space-y-3">
            <SectionHeader
              id="notes"
              icon={PlusCircle}
              title="Additional Context"
              subtitle="Custom notes and internal remarks"
              status="Optional"
              isActive={expandedSection === "notes"}
              hasErrors={hasNotesErrors}
            />
            {expandedSection === "notes" && (
              <div className="p-4 pt-2 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground">Internal Notes</Label>
                  <Textarea
                    {...register("notes")}
                    placeholder="Enter strategic details or client preferences..."
                    className="min-h-[120px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground">Search Tags</Label>
                  <Input
                    placeholder="Type a tag and press Enter"
                    className="h-10"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const input = e.currentTarget;
                        const newTag = input.value.trim();
                        if (newTag && !tagsList.includes(newTag)) {
                          const updatedTags = [...tagsList, newTag];
                          setTagsList(updatedTags);
                          setValue("tags", updatedTags.join(", "));
                          input.value = "";
                        }
                      }
                    }}
                  />
                  {tagsList.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3 p-3 bg-muted/50 rounded-lg border border-border">
                      {tagsList.map((tag, index) => (
                        <div
                          key={index}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-background border border-border rounded-md text-sm font-medium"
                        >
                          <span>{tag}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const updatedTags = tagsList.filter(t => t !== tag);
                              setTagsList(updatedTags);
                              setValue("tags", updatedTags.join(", "));
                            }}
                            className="hover:bg-muted rounded-full p-0.5 transition-colors"
                          >
                            <XIcon className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <input type="hidden" {...register("tags")} />
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
              "Create Client"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
