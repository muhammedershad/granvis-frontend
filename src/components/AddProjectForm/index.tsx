"use client";

import { useCallback, useEffect, useState } from "react";
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
import { getFormSections } from "./useFormSections";

interface AddProjectFormProps {
  onSubmit: (
    project: Omit<Project, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
  initialData?: Project;
  mode?: "create" | "edit";
  preSelectedClient?: Client;
}

// Helper to parse description for client requirements
const parseDescriptionForEdit = (description: string) => {
  const clientReqMatch = description.match(
    /Client Requirements?:?\s*([\s\S]*)/i
  );
  if (clientReqMatch) {
    const mainDesc = description.slice(0, clientReqMatch.index).trim();
    const clientReq = clientReqMatch[1].trim();
    return { mainDescription: mainDesc, clientRequirements: clientReq };
  }
  return { mainDescription: description, clientRequirements: "" };
};

// Helper to format date for input field (YYYY-MM-DD)
const formatDateForInput = (dateString: string | undefined): string => {
  if (!dateString) {
    return "";
  }
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
};

// Helper to convert date to UTC ISO string
const toUTCDateString = (dateStr: string | undefined): string | undefined => {
  if (!dateStr) {
    return undefined;
  }
  const date = new Date(dateStr);
  return date.toISOString();
};

// Helper to get initial client state for edit mode
const getInitialClient = (
  initialData: Project | undefined,
  isEditMode: boolean
): Client | null => {
  if (!isEditMode || !initialData) {
    return null;
  }
  return {
    id: initialData.clientId,
    name: initialData.client,
    email: initialData.clientEmail,
    phone: initialData.clientPhone,
  } as Client;
};

// Helper to get initial manager state for edit mode
const getInitialManager = (
  initialData: Project | undefined,
  isEditMode: boolean
): Employee | null => {
  if (!isEditMode || !initialData) {
    return null;
  }
  return {
    id: initialData.managerId,
    firstName: initialData.projectManager.split(" ")[0] || "",
    lastName: initialData.projectManager.split(" ").slice(1).join(" ") || "",
  } as Employee;
};

// Helper to get default form values
const getDefaultFormValues = (
  initialData: Project | undefined,
  isEditMode: boolean,
  parsedDescription: { mainDescription: string; clientRequirements: string }
): ProjectFormData => {
  if (isEditMode && initialData) {
    return {
      name: initialData.name,
      description: parsedDescription.mainDescription,
      client: initialData.client,
      clientId: initialData.clientId,
      clientEmail: initialData.clientEmail || "",
      clientPhone: initialData.clientPhone || "",
      type: initialData.type,
      category: initialData.category || "",
      status: initialData.status,
      priority: initialData.priority,
      startDate: formatDateForInput(initialData.startDate),
      endDate: formatDateForInput(initialData.endDate),
      totalBudget: initialData.totalBudget?.toString() || "",
      progressPercentage: initialData.progressPercentage?.toString() || "0",
      currentPhase: initialData.currentPhase || "",
      projectManager: initialData.projectManager,
      managerId: initialData.managerId,
      teamMembers: initialData.teamMembers.join(", "),
      teamMemberIds: initialData.teamMemberIds || [],
      address: initialData.location.address,
      city: initialData.location.city,
      state: initialData.location.state,
      country: initialData.location.country || "India",
      requirements: parsedDescription.clientRequirements,
      createdBy: initialData.createdBy,
    };
  }
  return {
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
  };
};

// Helper to determine final images for project
const getFinalImages = (
  imageUrls: string[],
  existingCoverImage: string | undefined,
  initialData: Project | undefined,
  isEditMode: boolean
): string[] => {
  if (imageUrls.length > 0) {
    return imageUrls;
  }
  if (existingCoverImage) {
    return [existingCoverImage];
  }
  if (isEditMode && initialData) {
    return initialData.images;
  }
  return [];
};

// Helper to get parsed description for edit mode
const getParsedDescription = (
  initialData: Project | undefined,
  isEditMode: boolean
): { mainDescription: string; clientRequirements: string } => {
  if (isEditMode && initialData) {
    return parseDescriptionForEdit(initialData.description);
  }
  return { mainDescription: "", clientRequirements: "" };
};

// Helper to build project from form data
const buildProject = (
  data: ProjectFormData,
  imageUrls: string[],
  existingCoverImage: string | undefined,
  initialData: Project | undefined,
  isEditMode: boolean
): Omit<Project, "id" | "createdAt" | "updatedAt"> => {
  const totalBudget = data.totalBudget ? parseFloat(data.totalBudget) : 0;

  const baseData =
    isEditMode && initialData
      ? {
          spentAmount: initialData.spentAmount,
          milestones: initialData.milestones,
          documents: initialData.documents,
        }
      : {
          milestones: [],
          documents: [],
        };

  const finalImages = getFinalImages(
    imageUrls,
    existingCoverImage,
    initialData,
    isEditMode
  );
  const remainingBudget =
    isEditMode && initialData
      ? totalBudget - (initialData.spentAmount || 0)
      : totalBudget;

  const teamMembers = data.teamMembers
    ? data.teamMembers
        .split(",")
        .map((member) => member.trim())
        .filter(Boolean)
    : [];

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
    remainingBudget,
    spentAmount: baseData.spentAmount,
    progressPercentage: data.progressPercentage
      ? parseInt(data.progressPercentage)
      : undefined,
    currentPhase: data.currentPhase || undefined,
    milestones: baseData.milestones,
    projectManager: data.projectManager,
    managerId: data.managerId,
    teamMembers,
    teamMemberIds: data.teamMemberIds || [],
    location: {
      address: data.address,
      city: data.city,
      state: data.state,
      country: data.country || "India",
    },
    documents: baseData.documents,
    images: finalImages,
    coverImage: finalImages[0] || undefined,
    createdBy: data.createdBy,
  };
};

export function AddProjectForm({
  onSubmit,
  onCancel,
  isSubmitting = false,
  initialData,
  mode = "create",
  preSelectedClient,
}: AddProjectFormProps) {
  const router = useRouter();
  const isEditMode = mode === "edit" && !!initialData;
  const [expandedSection, setExpandedSection] = useState<string>("identity");
  const [selectedClient, setSelectedClient] = useState<Client | null>(() =>
    getInitialClient(initialData, isEditMode)
  );
  const [clientSearchTerm, setClientSearchTerm] = useState("");
  const [imageBlobToUpload, setImageBlobToUpload] = useState<Blob | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [selectedManager, setSelectedManager] = useState<Employee | null>(() =>
    getInitialManager(initialData, isEditMode)
  );
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<Employee[]>(
    []
  );
  const [existingCoverImage, setExistingCoverImage] = useState<
    string | undefined
  >(isEditMode && initialData ? initialData.coverImage : undefined);

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
    setExistingCoverImage(undefined);
  };

  // Parse description for edit mode
  const parsedDescription = getParsedDescription(initialData, isEditMode);

  const {
    register,
    handleSubmit: handleFormSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectFormSchema),
    mode: "onChange",
    defaultValues: getDefaultFormValues(
      initialData,
      isEditMode,
      parsedDescription
    ),
  });

  const formData = watch();

  const handleClientSelect = useCallback(
    (client: Client) => {
      setSelectedClient(client);
      setValue("client", client.name);
      setValue("clientId", client.id);
      setValue("clientEmail", client.email || "");
      setValue("clientPhone", client.phone || "");
    },
    [setValue]
  );

  // Auto-select pre-selected client (when navigating from client page)
  useEffect(() => {
    if (preSelectedClient && !selectedClient) {
      handleClientSelect(preSelectedClient);
      setExpandedSection("stakeholders");
    }
  }, [preSelectedClient, selectedClient, handleClientSelect]);

  const uploadImage = async (): Promise<string[] | null> => {
    // Use blob if available (cropped image), otherwise no image to upload
    if (!imageBlobToUpload || !imageFile) {
      // Return existing image if available (edit mode with no new image)
      return existingCoverImage ? [existingCoverImage] : [];
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
    const project = buildProject(
      data,
      imageUrls,
      existingCoverImage,
      initialData,
      isEditMode
    );
    await onSubmit(project);
  });

  // Get section statuses (errors and completion)
  const sections = getFormSections(errors, formData);

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

      <FormHeader
        mode={mode}
        projectName={isEditMode ? initialData.name : undefined}
      />

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
              hasErrors={sections.identity.hasErrors}
              isCompleted={sections.identity.isCompleted}
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
                existingCoverImage={existingCoverImage}
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
              hasErrors={sections.client.hasErrors}
              isCompleted={sections.client.isCompleted}
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
              hasErrors={sections.scope.hasErrors}
              isCompleted={sections.scope.isCompleted}
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
              hasErrors={sections.financials.hasErrors}
              isCompleted={sections.financials.isCompleted}
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
              hasErrors={sections.location.hasErrors}
              isCompleted={sections.location.isCompleted}
              onClick={setExpandedSection}
            />
            {expandedSection === "location" && (
              <LocationSection register={register} errors={errors} />
            )}
          </div>
        </div>

        <FormActions
          isLoading={isUploading || isSubmitting}
          uploadProgress={isUploading ? uploadProgress : undefined}
          onCancel={onCancel}
          mode={mode}
        />
      </form>
    </div>
  );
}

export default AddProjectForm;
