"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  Building2,
  Calendar,
  FileText,
  MapPin,
  Users,
} from "lucide-react";
import { Separator } from "../ui/separator";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Project } from "../../types/project";
import { Client } from "../../types/client";
import { Employee } from "../../types/employee";
import {
  uploadToS3WithPresignedUrl,
  useGetPresignedUrlMutation,
} from "@/lib/api/uploadApi";
import { useGetClientsQuery } from "@/lib/api/clientsApi";
import { getCloudFrontUrl } from "@/lib/utils/cloudfront";
import { useImageCrop } from "@/hooks/useImageCrop";
import { useDebounce } from "@/hooks/useDebounce";
import { ImageCropDialog } from "../ui/ImageCropDialog";
import { ProjectFormData, projectFormSchema } from "./schemas";
import { FormHeader } from "./FormHeader";
import { SectionHeader } from "./SectionHeader";
import { IdentitySection } from "./IdentitySection";
import { ClientSection } from "./ClientSection";
import { ScopeSection } from "./ScopeSection";
import { FinancialsSection } from "./FinancialsSection";
import { LocationSection } from "./LocationSection";
import { FormActions } from "./FormActions";
import {
  checkClientSectionCompletion,
  checkFinancialsSectionCompletion,
  checkIdentitySectionCompletion,
  checkLocationSectionCompletion,
  checkScopeSectionCompletion,
} from "./completionChecks";

interface AddProjectFormProps {
  onSubmit: (
    project: Omit<Project, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function AddProjectForm({
  onSubmit,
  onCancel,
  isSubmitting = false,
}: AddProjectFormProps) {
  const router = useRouter();
  const [expandedSection, setExpandedSection] = useState<string>("identity");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientSearchTerm, setClientSearchTerm] = useState("");
  const [imageBlobToUpload, setImageBlobToUpload] = useState<Blob | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [selectedManager, setSelectedManager] = useState<Employee | null>(null);
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<Employee[]>(
    []
  );

  const [getPresignedUrl] = useGetPresignedUrlMutation();

  // Debounce client search term for API calls (1 second delay)
  const debouncedSearchTerm = useDebounce(clientSearchTerm, 1000);

  // Fetch clients from API with debounced search
  const {
    data: clientsData,
    isLoading: isLoadingClients,
    isFetching: isFetchingClients,
  } = useGetClientsQuery({
    search: debouncedSearchTerm || undefined,
    limit: 20,
    status: "Active",
  });

  const clients = clientsData?.data || [];

  // Navigate to new client page
  const handleAddClientClick = () => {
    router.push("/admin/clients/new");
  };

  // Use image crop hook for cover image
  const {
    originalImage,
    croppedImage,
    croppedBlob,
    imageFile,
    isDialogOpen,
    error: imageError,
    handleInputChange: handleImageInputChange,
    handleCropComplete,
    setIsDialogOpen,
    removeCroppedImage,
    openCropDialog,
  } = useImageCrop({
    maxSizeInMB: 1,
    allowedFormats: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
    onError: (error) => {
      console.error("Image validation error:", error);
    },
  });

  // Handle crop complete - store blob for upload
  const handleCropCompleteWrapper = (blob: Blob, url: string) => {
    handleCropComplete(blob, url);
    setImageBlobToUpload(blob);
  };

  // Handle remove image
  const handleRemoveImage = () => {
    removeCroppedImage();
    setImageBlobToUpload(null);
  };

  const {
    register,
    handleSubmit: handleFormSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectFormSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
      client: "",
      clientId: "",
      clientEmail: "",
      clientPhone: "",
      type: "Villa",
      category: "",
      status: "Planning",
      priority: "Medium",
      startDate: "",
      endDate: "",
      totalBudget: "",
      progressPercentage: "0",
      currentPhase: "",
      projectManager: "",
      managerId: "",
      teamMembers: "",
      teamMemberIds: [],
      address: "",
      city: "",
      state: "",
      country: "India",
      requirements: "",
      createdBy: "current-user",
    },
  });

  const formData = watch();

  const handleClientSelect = (client: Client) => {
    setSelectedClient(client);
    setValue("client", client.name);
    setValue("clientId", client.id);
    setValue("clientEmail", client.email || "");
    setValue("clientPhone", client.phone || "");
  };

  // Helper to convert date to UTC ISO string
  const toUTCDateString = (dateStr: string | undefined): string | undefined => {
    if (!dateStr) {
      return undefined;
    }
    const date = new Date(dateStr);
    return date.toISOString();
  };

  // eslint-disable-next-line complexity
  const buildProjectFromFormData = (
    data: ProjectFormData,
    imageUrls: string[]
  ): Omit<Project, "id" | "createdAt" | "updatedAt"> => {
    const totalBudget = data.totalBudget ? parseFloat(data.totalBudget) : 0;

    return {
      name: data.name.trim(),
      description: `${data.description.trim()}${data.requirements ? `\n\nClient Requirements:\n${data.requirements.trim()}` : ""}`,
      client: data.client,
      clientId: data.clientId,
      clientEmail: data.clientEmail || undefined,
      clientPhone: data.clientPhone || undefined,
      type: data.type,
      category: data.category || undefined,
      status: data.status,
      priority: data.priority,
      startDate: toUTCDateString(data.startDate) || data.startDate,
      endDate: toUTCDateString(data.endDate) || undefined,
      totalBudget,
      remainingBudget: totalBudget,
      progressPercentage: data.progressPercentage
        ? parseInt(data.progressPercentage)
        : undefined,
      currentPhase: data.currentPhase || undefined,
      milestones: [],
      projectManager: data.projectManager,
      managerId: data.managerId,
      teamMembers: data.teamMembers
        ? data.teamMembers
            .split(",")
            .map((member) => member.trim())
            .filter(Boolean)
        : [],
      teamMemberIds: data.teamMemberIds || [],
      location: {
        address: data.address,
        city: data.city,
        state: data.state,
        country: data.country || "India",
      },
      documents: [],
      images: imageUrls,
      coverImage: imageUrls[0] || undefined,
      createdBy: data.createdBy,
    };
  };

  const uploadImage = async (): Promise<string[] | null> => {
    // Use blob if available (cropped image), otherwise no image to upload
    if (!imageBlobToUpload || !imageFile) {
      return [];
    }

    setIsUploading(true);
    setUploadProgress(10);

    try {
      const presignedData = await getPresignedUrl({
        fileName: imageFile.name,
        contentType: imageBlobToUpload.type || "image/jpeg",
      }).unwrap();

      setUploadProgress(30);

      await uploadToS3WithPresignedUrl(
        presignedData.uploadUrl,
        imageBlobToUpload,
        (progress: number) => {
          setUploadProgress(30 + progress * 0.6);
        }
      );

      setUploadProgress(100);
      const cloudFrontUrl = getCloudFrontUrl(presignedData.objectKey);
      return cloudFrontUrl ? [cloudFrontUrl] : [];
    } catch (error) {
      console.error("Failed to upload image:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to upload image. Please try again.";
      setSubmitError(errorMessage);
      toast.error("Upload failed", { description: errorMessage });
      setIsUploading(false);
      setUploadProgress(0);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = handleFormSubmit(async (data) => {
    setSubmitError(null);

    // Step 1: Upload image if present
    const imageUrls = await uploadImage();
    if (imageUrls === null) {
      return;
    }

    // Step 2: Build project data and call API
    const project = buildProjectFromFormData(data, imageUrls);
    await onSubmit(project);
  });

  // Error checks for each section
  const hasIdentityErrors = !!(
    errors.name ||
    errors.description ||
    errors.type ||
    errors.status ||
    errors.priority
  );
  const hasClientErrors = !!(
    errors.client ||
    errors.clientId ||
    errors.clientEmail ||
    errors.clientPhone
  );
  const hasScopeErrors = !!(
    errors.requirements ||
    errors.projectManager ||
    errors.managerId
  );
  const hasFinancialsErrors = !!(errors.startDate || errors.totalBudget);
  const hasLocationErrors = !!(
    errors.address ||
    errors.city ||
    errors.state
  );

  // Completion checks for each section
  const isIdentityCompleted = checkIdentitySectionCompletion(
    hasIdentityErrors,
    formData
  );
  const isClientCompleted = checkClientSectionCompletion(
    hasClientErrors,
    formData
  );
  const isScopeCompleted = checkScopeSectionCompletion(
    hasScopeErrors,
    formData
  );
  const isFinancialsCompleted = checkFinancialsSectionCompletion(
    hasFinancialsErrors,
    formData
  );
  const isLocationCompleted = checkLocationSectionCompletion(
    hasLocationErrors,
    formData
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Image Crop Dialog */}
      {originalImage && (
        <ImageCropDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          imageSrc={originalImage}
          onCropComplete={handleCropCompleteWrapper}
          aspectRatio={16 / 9}
          circularCrop={false}
          title="Crop Cover Image"
          description="Adjust the crop area and zoom to get the perfect cover image"
        />
      )}

      <FormHeader />

      <form onSubmit={handleSubmit} className="space-y-4">
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
          {/* Section 1: Project Identity */}
          <div className="space-y-3">
            <SectionHeader
              id="identity"
              icon={Building2}
              title="Project Identity"
              subtitle="Define the core details"
              status="Required"
              isActive={expandedSection === "identity"}
              hasErrors={hasIdentityErrors}
              isCompleted={isIdentityCompleted}
              onClick={setExpandedSection}
            />
            {expandedSection === "identity" && (
              <IdentitySection
                register={register}
                errors={errors}
                setValue={setValue}
                watch={watch}
                croppedImage={croppedImage}
                croppedBlob={croppedBlob}
                imageError={imageError}
                onImageInputChange={handleImageInputChange}
                onRemoveImage={handleRemoveImage}
                onOpenCropDialog={openCropDialog}
              />
            )}
          </div>

          <Separator className="bg-gray-100 dark:bg-white/5" />

          {/* Section 2: Client & Stakeholders */}
          <div className="space-y-3">
            <SectionHeader
              id="stakeholders"
              icon={Users}
              title="Client & Stakeholders"
              subtitle="Select or add client details"
              status="Required"
              isActive={expandedSection === "stakeholders"}
              hasErrors={hasClientErrors}
              isCompleted={isClientCompleted}
              onClick={setExpandedSection}
            />
            {expandedSection === "stakeholders" && (
              <ClientSection
                register={register}
                errors={errors}
                setValue={setValue}
                clients={clients}
                selectedClient={selectedClient}
                searchTerm={clientSearchTerm}
                onSearchChange={setClientSearchTerm}
                onClientSelect={handleClientSelect}
                onAddClientClick={handleAddClientClick}
                isLoading={isLoadingClients}
                isFetching={isFetchingClients}
              />
            )}
          </div>

          <Separator className="bg-gray-100 dark:bg-white/5" />

          {/* Section 3: Scope & Resources */}
          <div className="space-y-3">
            <SectionHeader
              id="scope"
              icon={FileText}
              title="Scope & Resources"
              subtitle="Requirements and team allocation"
              status="Required"
              isActive={expandedSection === "scope"}
              hasErrors={hasScopeErrors}
              isCompleted={isScopeCompleted}
              onClick={setExpandedSection}
            />
            {expandedSection === "scope" && (
              <ScopeSection
                register={register}
                errors={errors}
                setValue={setValue}
                selectedManager={selectedManager}
                onManagerSelect={setSelectedManager}
                selectedTeamMembers={selectedTeamMembers}
                onTeamMembersChange={setSelectedTeamMembers}
              />
            )}
          </div>

          <Separator className="bg-gray-100 dark:bg-white/5" />

          {/* Section 4: Timeline & Financials */}
          <div className="space-y-3">
            <SectionHeader
              id="financials"
              icon={Calendar}
              title="Timeline & Financials"
              subtitle="Schedule and budget details"
              status="Required"
              isActive={expandedSection === "financials"}
              hasErrors={hasFinancialsErrors}
              isCompleted={isFinancialsCompleted}
              onClick={setExpandedSection}
            />
            {expandedSection === "financials" && (
              <FinancialsSection
                errors={errors}
                setValue={setValue}
                startDate={formData.startDate}
                endDate={formData.endDate}
              />
            )}
          </div>

          <Separator className="bg-gray-100 dark:bg-white/5" />

          {/* Section 5: Location */}
          <div className="space-y-3">
            <SectionHeader
              id="location"
              icon={MapPin}
              title="Location"
              subtitle="Site address details"
              status="Required"
              isActive={expandedSection === "location"}
              hasErrors={hasLocationErrors}
              isCompleted={isLocationCompleted}
              onClick={setExpandedSection}
            />
            {expandedSection === "location" && (
              <LocationSection
                register={register}
                errors={errors}
              />
            )}
          </div>
        </div>

        <FormActions
          isLoading={isUploading || isSubmitting}
          uploadProgress={isUploading ? uploadProgress : undefined}
          onCancel={onCancel}
        />
      </form>
    </div>
  );
}

export default AddProjectForm;
