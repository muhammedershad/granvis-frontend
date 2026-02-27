"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  type CreateClientFormData,
  createClientSchema,
} from "@/lib/validations/client";
import { useCreateClientMutation } from "@/lib/api/clientsApi";
import { useGetPresignedUrlMutation } from "@/lib/api/uploadApi";
import { uploadToS3 } from "@/lib/utils/uploadToS3";
import { UPLOAD_PATHS } from "@/lib/constants/uploadPaths";
import { toast } from "sonner";
import {
  Activity,
  AlertCircle,
  Briefcase,
  Loader2,
  MapPin,
  PlusCircle,
  User,
} from "lucide-react";
import { FormHeader } from "./FormHeader";
import { SectionHeader } from "./SectionHeader";
import { PersonalSectionWithCrop } from "./PersonalSectionWithCrop";
import { ProfessionalSection } from "./ProfessionalSection";
import { AddressSection } from "./AddressSection";
import { StatusSection } from "./StatusSection";
import { NotesSection } from "./NotesSection";
import { buildClientData, checkSectionErrors } from "./utils";

interface AddClientFormProps {
  onSuccess?: () => void;
  onCancel: () => void;
}

export function AddClientFormMain({ onSuccess, onCancel }: AddClientFormProps) {
  const [createClient, { isLoading }] = useCreateClientMutation();
  const [getPresignedUrl] = useGetPresignedUrlMutation();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string>("personal");
  const [tagsList, setTagsList] = useState<string[]>([]);
  const [imageBlobToUpload, setImageBlobToUpload] = useState<Blob | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
    setError,
    clearErrors,
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
      avatar: "",
      avatarKey: "",
      createdBy: "Current User",
    },
  });

  const handleImageChange = (
    _file: File | null,
    preview: string | null,
    blob: Blob | null
  ) => {
    setImageBlobToUpload(blob);
    setValue("avatar", preview || "");
  };

  const onSubmit = async (data: CreateClientFormData) => {
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
            folder: UPLOAD_PATHS.CLIENT_AVATARS,
          }).unwrap();

          // Upload blob to S3 using presigned URL
          await uploadToS3(
            presignedResponse.uploadUrl,
            imageBlobToUpload,
            "image/jpeg"
          );

          // Store the object key for the client record
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

      // Step 2: Create client with avatarKey
      const clientData = buildClientData(data, avatarKey);
      await createClient(clientData).unwrap();

      const displayName = [data.firstName, data.middleName, data.lastName]
        .filter(Boolean)
        .join(" ");

      toast.success("Client added successfully!", {
        description: `${displayName} has been added to your clients.`,
      });
      onSuccess?.();
    } catch (error) {
      console.error("Failed to create client:", error);
      let errorMessage = "Failed to add client. Please try again.";
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
      toast.error("Failed to Add Client", { description: errorMessage });
    }
  };

  const statusValue = watch("status");
  const priorityValue = watch("priority");
  const genderValue = watch("gender");
  const architecturalStyleValue = watch("architecturalStyle");

  const hasPersonalErrors = checkSectionErrors(errors, "personal");
  const hasProfessionalErrors = checkSectionErrors(errors, "professional");
  const hasAddressErrors = checkSectionErrors(errors, "address");
  const hasStatusErrors = checkSectionErrors(errors, "status");
  const hasNotesErrors = checkSectionErrors(errors, "notes");

  const toggleSection = (id: string) => {
    setExpandedSection(expandedSection === id ? "" : id);
  };

  return (
    <div className="flex flex-col gap-6">
      <FormHeader />

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
              onClick={() => toggleSection("personal")}
            />
            {expandedSection === "personal" && (
              <PersonalSectionWithCrop
                register={register}
                setValue={setValue}
                trigger={trigger}
                setError={setError}
                clearErrors={clearErrors}
                errors={errors}
                genderValue={genderValue || ""}
                formData={watch()}
                onGenderChange={(value) => setValue("gender", value)}
                onImageChange={handleImageChange}
              />
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
              onClick={() => toggleSection("professional")}
            />
            {expandedSection === "professional" && (
              <ProfessionalSection register={register} errors={errors} />
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
              onClick={() => toggleSection("address")}
            />
            {expandedSection === "address" && (
              <AddressSection register={register} errors={errors} />
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
              onClick={() => toggleSection("status")}
            />
            {expandedSection === "status" && (
              <StatusSection
                register={register}
                errors={errors}
                statusValue={statusValue || ""}
                priorityValue={priorityValue || ""}
                architecturalStyleValue={architecturalStyleValue || ""}
                onStatusChange={(v) =>
                  setValue("status", v as CreateClientFormData["status"])
                }
                onPriorityChange={(v) =>
                  setValue("priority", v as CreateClientFormData["priority"])
                }
                onArchitecturalStyleChange={(v) =>
                  setValue("architecturalStyle", v)
                }
              />
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
              onClick={() => toggleSection("notes")}
            />
            {expandedSection === "notes" && (
              <NotesSection
                register={register}
                errors={errors}
                tagsList={tagsList}
                setValue={setValue}
                onTagsChange={setTagsList}
              />
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading || isUploadingImage}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading || isUploadingImage}>
            {isUploadingImage && (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Uploading Image...
              </>
            )}
            {!isUploadingImage && isLoading && (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating...
              </>
            )}
            {!isUploadingImage && !isLoading && "Create Client"}
          </Button>
        </div>
      </form>
    </div>
  );
}
