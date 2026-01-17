/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "./ui/separator";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import {
  type CreateEmployeeFormInput,
  createEmployeeFormSchema,
} from "@/lib/validations/employee";
import {
  useCreateEmployeeMutation,
  useGetManagersQuery,
} from "@/lib/api/employeesApi";
import { toast } from "sonner";
import {
  AlertCircle,
  Briefcase,
  Building2,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import { AddEmployeeFormHeader } from "./AddEmployeeFormHeader";
import { AddEmployeeFormSectionHeader } from "./AddEmployeeFormSectionHeader";
import { AddEmployeePersonalSection } from "./AddEmployeePersonalSection";
import { AddEmployeeEmploymentSection } from "./AddEmployeeEmploymentSection";
import { AddEmployeeAddressSection } from "./AddEmployeeAddressSection";
import { AddEmployeeEmergencySection } from "./AddEmployeeEmergencySection";
import { AddEmployeeProfessionalSection } from "./AddEmployeeProfessionalSection";
import { AddEmployeeFormActions } from "./AddEmployeeFormActions";
import {
  checkAddressSectionErrors,
  checkEmploymentSectionErrors,
  checkPersonalSectionErrors,
  getFieldsToValidate,
  transformEmployeeFormData,
} from "./AddEmployeeForm/utils";
import {
  checkAddressSectionCompletion,
  checkEmploymentSectionCompletion,
  checkPersonalSectionCompletion,
} from "./AddEmployeeForm/completionChecks";

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
    trigger,
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
      joinDate: new Date().toISOString().split("T")[0],
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
      const employeeData = transformEmployeeFormData(data, managers);
      await createEmployee(employeeData as any).unwrap();
      const displayName = [data.firstName, data.middleName, data.lastName]
        .filter(Boolean)
        .join(" ");
      toast.success("Employee added successfully!", {
        description: `${displayName} has been added to your team.`,
      });
      onSuccess?.();
    } catch (error) {
      console.error("Failed to create employee:", error);
      let errorMessage = "Failed to add employee. Please try again.";
      const err = error as {
        data?: { message?: string } | string;
        message?: string;
      };
      if (err?.data && typeof err.data === "object" && err.data.message) {
        errorMessage = err.data.message;
      } else if (err?.message) {
        errorMessage = err.message;
      }
      setSubmitError(errorMessage);
      toast.error("Failed to Add Employee", { description: errorMessage });
    }
  };

  const handleSectionChange = async (sectionId: string) => {
    if (expandedSection === sectionId) {
      const fieldsToValidate = getFieldsToValidate(sectionId);

      if (fieldsToValidate.length > 0) {
        const isValid = await trigger(fieldsToValidate);
        if (!isValid) {
          toast.error("Validation Error", {
            description: "Please fix all errors before closing this section",
          });
          return;
        }
      }
    }
    setExpandedSection(expandedSection === sectionId ? "" : sectionId);
  };

  const hasPersonalErrors = checkPersonalSectionErrors(errors);
  const hasEmploymentErrors = checkEmploymentSectionErrors(errors);
  const hasAddressErrors = checkAddressSectionErrors(errors);

  const isPersonalCompleted = checkPersonalSectionCompletion(
    hasPersonalErrors,
    formData
  );
  const isEmploymentCompleted = checkEmploymentSectionCompletion(
    hasEmploymentErrors,
    formData
  );
  const isAddressCompleted = checkAddressSectionCompletion(
    hasAddressErrors,
    formData
  );

  return (
    <div className="flex flex-col gap-6">
      <AddEmployeeFormHeader />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {submitError && (
          <Alert
            variant="destructive"
            className="bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400"
          >
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Submission Error</AlertTitle>
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-3 bg-white dark:bg-black/40 p-4 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm dark:shadow-none">
          {/* Section 1: Personal Identity */}
          <div className="space-y-3">
            <AddEmployeeFormSectionHeader
              id="personal"
              icon={User}
              title="Personal Identity"
              subtitle="Basic details and contact information"
              status="Required"
              isActive={expandedSection === "personal"}
              hasErrors={hasPersonalErrors}
              isCompleted={isPersonalCompleted}
              onClick={handleSectionChange}
            />
            {expandedSection === "personal" && (
              <AddEmployeePersonalSection
                register={register}
                setValue={setValue}
                errors={errors}
                formData={formData}
                imagePreview={imagePreview}
                onImageChange={handleImageChange}
                onRemoveImage={handleRemoveImage}
              />
            )}
          </div>

          <Separator className="bg-gray-100 dark:bg-white/5" />

          {/* Section 2: Employment Details */}
          <div className="space-y-3">
            <AddEmployeeFormSectionHeader
              id="employment"
              icon={Briefcase}
              title="Employment Details"
              subtitle="Role, department, and work information"
              status="Required"
              isActive={expandedSection === "employment"}
              hasErrors={hasEmploymentErrors}
              isCompleted={isEmploymentCompleted}
              onClick={handleSectionChange}
            />
            {expandedSection === "employment" && (
              <AddEmployeeEmploymentSection
                register={register}
                setValue={setValue}
                errors={errors}
                formData={formData}
                managers={managers}
                managerOpen={managerOpen}
                setManagerOpen={setManagerOpen}
              />
            )}
          </div>

          <Separator className="bg-gray-100 dark:bg-white/5" />

          {/* Section 3: Address & Location */}
          <div className="space-y-3">
            <AddEmployeeFormSectionHeader
              id="address"
              icon={MapPin}
              title="Address & Location"
              subtitle="Home address and location details"
              status="Required"
              isActive={expandedSection === "address"}
              hasErrors={hasAddressErrors}
              isCompleted={isAddressCompleted}
              onClick={handleSectionChange}
            />
            {expandedSection === "address" && (
              <AddEmployeeAddressSection register={register} errors={errors} />
            )}
          </div>

          <Separator className="bg-gray-100 dark:bg-white/5" />

          {/* Section 4: Emergency Contact */}
          <div className="space-y-3">
            <AddEmployeeFormSectionHeader
              id="emergency"
              icon={Phone}
              title="Emergency Contact"
              subtitle="Who to call in an emergency"
              status="Optional"
              isActive={expandedSection === "emergency"}
              onClick={handleSectionChange}
            />
            {expandedSection === "emergency" && (
              <AddEmployeeEmergencySection register={register} />
            )}
          </div>

          <Separator className="bg-gray-100 dark:bg-white/5" />

          {/* Section 5: Professional Profile */}
          <div className="space-y-3">
            <AddEmployeeFormSectionHeader
              id="professional"
              icon={Building2}
              title="Professional Profile"
              subtitle="Skills, experience, and education"
              status="Optional"
              isActive={expandedSection === "professional"}
              onClick={handleSectionChange}
            />
            {expandedSection === "professional" && (
              <AddEmployeeProfessionalSection
                register={register}
                setValue={setValue}
                formData={formData}
              />
            )}
          </div>
        </div>

        <AddEmployeeFormActions isLoading={isLoading} onCancel={onCancel} />
      </form>
    </div>
  );
}
