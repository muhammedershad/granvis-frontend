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
import { useGetPresignedUrlMutation } from "@/lib/api/uploadApi";
import { uploadToS3 } from "@/lib/utils/uploadToS3";
import { toast } from "sonner";
import { dateToUTC } from "@/lib/utils/date";
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
import { AddEmployeePersonalSection } from "./AddEmployeePersonalSectionWithCrop";
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
  const [getPresignedUrl] = useGetPresignedUrlMutation();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string>("personal");
  const [shouldFetchManagers, setShouldFetchManagers] = useState(false);
  const [imageBlobToUpload, setImageBlobToUpload] = useState<Blob | null>(null);
  const [managerOpen, setManagerOpen] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Only fetch managers when employment section is opened
  const { data: managers = [] } = useGetManagersQuery(undefined, {
    skip: !shouldFetchManagers,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
    setError,
    clearErrors,
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
      joinDate: dateToUTC(new Date()),
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

  const handleImageChange = (
    file: File | null,
    preview: string | null,
    blob: Blob | null
  ) => {
    setImageBlobToUpload(blob);
    setValue("avatar", preview || "");
  };

  const onSubmit = async (data: CreateEmployeeFormInput) => {
    setSubmitError(null);

    try {
      let avatarKey: string | undefined;

      // Step 1: Upload image to S3 if blob exists
      if (imageBlobToUpload) {
        setIsUploadingImage(true);
        try {
          // Get presigned URL from backend
          const presignedResponse = await getPresignedUrl({
            fileName: `avatar-${Date.now()}.jpg`,
            contentType: "image/jpeg",
            folder: "griha-local/employee-avatars",
          }).unwrap();

          // Upload blob to S3 using presigned URL
          await uploadToS3(
            presignedResponse.uploadUrl,
            imageBlobToUpload,
            "image/jpeg"
          );

          // Store the object key for the employee record
          avatarKey = presignedResponse.objectKey;

          toast.success("Image uploaded successfully!");
        } catch (uploadError) {
          console.error("Failed to upload image:", uploadError);
          const uploadErrorMessage =
            uploadError instanceof Error
              ? uploadError.message
              : "Failed to upload image. Please check your connection and try again.";

          setSubmitError(uploadErrorMessage);
          toast.error("Failed to upload image", {
            description: uploadErrorMessage,
          });

          // Stop submission if image upload fails
          return;
        } finally {
          setIsUploadingImage(false);
        }
      }

      // Step 2: Create employee with avatarKey
      const employeeData = transformEmployeeFormData(data, managers);

      // Add avatarKey to employee data if image was uploaded
      if (avatarKey) {
        employeeData.avatarKey = avatarKey;
      }

      await createEmployee(employeeData).unwrap();

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

    // Fetch managers when employment section is opened for the first time
    if (sectionId === "employment" && !shouldFetchManagers) {
      setShouldFetchManagers(true);
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
                trigger={trigger}
                setError={setError}
                clearErrors={clearErrors}
                errors={errors}
                formData={formData}
                onImageChange={handleImageChange}
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
                trigger={trigger}
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
              <AddEmployeeAddressSection
                register={register}
                trigger={trigger}
                errors={errors}
              />
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

        <AddEmployeeFormActions
          isLoading={isLoading || isUploadingImage}
          onCancel={onCancel}
        />
      </form>
    </div>
  );
}
