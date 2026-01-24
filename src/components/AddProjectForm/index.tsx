"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  AlertCircle,
  Building2,
  Calendar,
  FileText,
  Loader2,
  MapPin,
  Users,
  X,
} from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Project } from "../../types/project";
import { Client } from "../../types/client";
import { AddClientForm } from "../AddClientForm";
import {
  uploadToS3WithPresignedUrl,
  useGetPresignedUrlMutation,
} from "@/lib/api/uploadApi";
import { ProjectFormData, projectFormSchema } from "./schemas";
import { SectionHeader } from "./SectionHeader";
import { IdentitySection } from "./IdentitySection";
import { ClientSection } from "./ClientSection";
import { ScopeSection } from "./ScopeSection";
import { FinancialsSection } from "./FinancialsSection";
import { LocationSection } from "./LocationSection";

interface AddProjectFormProps {
  onSubmit: (project: Omit<Project, "id" | "createdAt" | "updatedAt">) => void;
  onCancel: () => void;
}

// Mock clients - simplified
const mockClients: Client[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+1 (555) 123-4567",
    companyName: "Smith Enterprises",
    companyType: "Small Business",
    industry: "Technology",
    status: "Active",
    priority: "High",
  } as Client,
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.johnson@greentech.com",
    phone: "+1 (555) 987-6543",
    companyName: "GreenTech Solutions",
    companyType: "Corporation",
    industry: "Environmental",
    status: "Active",
    priority: "Medium",
  } as Client,
];

export function AddProjectForm({ onSubmit, onCancel }: AddProjectFormProps) {
  const [expandedSection, setExpandedSection] = useState<string>("identity");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientSearchTerm, setClientSearchTerm] = useState("");
  const [showAddClientDialog, setShowAddClientDialog] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [tagsList, setTagsList] = useState<string[]>([]);
  const [teamList, setTeamList] = useState<string[]>([]);

  const [getPresignedUrl] = useGetPresignedUrlMutation();

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
      clientEmail: "",
      clientPhone: "",
      type: "Villa",
      category: "",
      status: "Planning",
      priority: "Medium",
      startDate: "",
      endDate: "",
      deadline: "",
      estimatedDuration: "",
      totalBudget: "",
      spentAmount: "0",
      progressPercentage: "0",
      currentPhase: "",
      projectManager: "",
      teamMembers: "",
      address: "",
      city: "",
      state: "",
      country: "USA",
      tags: "",
      requirements: "",
      createdBy: "current-user",
    },
  });

  const _formData = watch();

  const handleClientSelect = (client: Client) => {
    setSelectedClient(client);
    setValue("client", client.name);
    setValue("clientEmail", client.email || "");
    setValue("clientPhone", client.phone || "");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageFile(null);
  };

  // eslint-disable-next-line complexity
  const buildProjectFromFormData = (
    data: ProjectFormData,
    imageUrls: string[]
  ): Omit<Project, "id" | "createdAt" | "updatedAt"> => {
    return {
      name: data.name,
      description: `${data.description}${data.requirements ? `\n\nClient Requirements:\n${data.requirements}` : ""}`,
      client: data.client,
      clientEmail: data.clientEmail || undefined,
      clientPhone: data.clientPhone || undefined,
      type: data.type,
      category: data.category || undefined,
      status: data.status,
      priority: data.priority,
      startDate: data.startDate,
      endDate: data.endDate || undefined,
      deadline: data.deadline || undefined,
      estimatedDuration: data.estimatedDuration
        ? parseInt(data.estimatedDuration)
        : undefined,
      totalBudget: parseFloat(data.totalBudget) || 0,
      spentAmount: data.spentAmount ? parseFloat(data.spentAmount) : undefined,
      remainingBudget:
        (parseFloat(data.totalBudget) || 0) -
        (parseFloat(data.spentAmount || "0") || 0),
      progressPercentage: data.progressPercentage
        ? parseInt(data.progressPercentage)
        : undefined,
      currentPhase: data.currentPhase || undefined,
      milestones: [],
      projectManager: data.projectManager,
      teamMembers: data.teamMembers
        ? data.teamMembers
            .split(",")
            .map((member) => member.trim())
            .filter(Boolean)
        : [],
      location: {
        address: data.address || undefined,
        city: data.city || undefined,
        state: data.state || undefined,
        country: data.country || "USA",
      },
      tags: data.tags
        ? data.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
        : [],
      documents: [],
      images: imageUrls,
      coverImage: imageUrls[0] || undefined,
      createdBy: data.createdBy,
    };
  };

  const uploadImage = async (): Promise<string[] | null> => {
    if (!imageFile) {
      return [];
    }

    setIsUploading(true);
    setUploadProgress(10);

    try {
      const presignedData = await getPresignedUrl({
        fileName: imageFile.name,
        contentType: imageFile.type,
      }).unwrap();

      setUploadProgress(30);

      await uploadToS3WithPresignedUrl(
        presignedData.uploadUrl,
        imageFile,
        (progress: number) => {
          setUploadProgress(30 + progress * 0.6);
        }
      );

      setUploadProgress(100);
      return [presignedData.cloudFrontUrl];
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

    const imageUrls = await uploadImage();
    if (imageUrls === null) {
      return;
    }

    const project = buildProjectFromFormData(data, imageUrls);
    onSubmit(project);
  });

  const hasIdentityErrors = !!(
    errors.name ||
    errors.description ||
    errors.type ||
    errors.status ||
    errors.priority
  );
  const hasClientErrors = !!(
    errors.client ||
    errors.clientEmail ||
    errors.clientPhone
  );
  const hasScopeErrors = !!(errors.requirements || errors.projectManager);
  const hasFinancialsErrors = !!(errors.startDate || errors.totalBudget);
  const hasLocationErrors = !!(
    errors.address ||
    errors.city ||
    errors.state ||
    errors.country
  );

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">
            Create New Project
          </h2>
          <p className="text-sm text-muted-foreground">
            Set up a new architectural or design project with comprehensive
            details.
          </p>
        </div>

        {submitError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div className="space-y-3">
            <SectionHeader
              id="identity"
              icon={Building2}
              title="Project Identity"
              subtitle="Define the core details"
              status="Required"
              isActive={expandedSection === "identity"}
              hasErrors={hasIdentityErrors}
              onClick={setExpandedSection}
            />
            {expandedSection === "identity" && (
              <IdentitySection
                register={register}
                errors={errors}
                setValue={setValue}
                watch={watch}
                imagePreview={imagePreview}
                onImageSelect={handleImageChange}
                onRemoveImage={handleRemoveImage}
              />
            )}
          </div>

          <Separator className="bg-gray-100 dark:bg-white/5" />

          <div className="space-y-3">
            <SectionHeader
              id="stakeholders"
              icon={Users}
              title="Client & Stakeholders"
              subtitle="Select or add client details"
              status="Required"
              isActive={expandedSection === "stakeholders"}
              hasErrors={hasClientErrors}
              onClick={setExpandedSection}
            />
            {expandedSection === "stakeholders" && (
              <ClientSection
                register={register}
                errors={errors}
                setValue={setValue}
                clients={mockClients}
                selectedClient={selectedClient}
                searchTerm={clientSearchTerm}
                onSearchChange={setClientSearchTerm}
                onClientSelect={handleClientSelect}
                onAddClientClick={() => setShowAddClientDialog(true)}
              />
            )}
          </div>

          <Separator className="bg-gray-100 dark:bg-white/5" />

          <div className="space-y-3">
            <SectionHeader
              id="scope"
              icon={FileText}
              title="Scope & Resources"
              subtitle="Requirements and team allocation"
              status="Required"
              isActive={expandedSection === "scope"}
              hasErrors={hasScopeErrors}
              onClick={setExpandedSection}
            />
            {expandedSection === "scope" && (
              <ScopeSection
                register={register}
                errors={errors}
                setValue={setValue}
                teamList={teamList}
                setTeamList={setTeamList}
              />
            )}
          </div>

          <Separator className="bg-gray-100 dark:bg-white/5" />

          <div className="space-y-3">
            <SectionHeader
              id="financials"
              icon={Calendar}
              title="Timeline & Financials"
              subtitle="Schedule and budget details"
              status="Required"
              isActive={expandedSection === "financials"}
              hasErrors={hasFinancialsErrors}
              onClick={setExpandedSection}
            />
            {expandedSection === "financials" && (
              <FinancialsSection register={register} errors={errors} />
            )}
          </div>

          <Separator className="bg-gray-100 dark:bg-white/5" />

          <div className="space-y-3">
            <SectionHeader
              id="location"
              icon={MapPin}
              title="Location & Meta"
              subtitle="Site address and categorization"
              status="Optional"
              isActive={expandedSection === "location"}
              hasErrors={hasLocationErrors}
              onClick={setExpandedSection}
            />
            {expandedSection === "location" && (
              <LocationSection
                register={register}
                errors={errors}
                setValue={setValue}
                tagsList={tagsList}
                setTagsList={setTagsList}
              />
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isUploading}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading... {uploadProgress}%
              </>
            ) : (
              "Create Project"
            )}
          </Button>
        </div>
      </form>

      {showAddClientDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-4xl bg-background rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4 z-10"
              onClick={() => setShowAddClientDialog(false)}
            >
              <X className="h-4 w-4" />
            </Button>
            <div className="p-6">
              <AddClientForm
                onCancel={() => setShowAddClientDialog(false)}
                onSuccess={() => {
                  setShowAddClientDialog(false);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddProjectForm;
