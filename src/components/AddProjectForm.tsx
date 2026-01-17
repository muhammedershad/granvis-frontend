'use client';
 
import { useState } from "react";
import NextImage from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import {
  Search,
  Users,
  Building2,
  Calendar,
  DollarSign,
  MapPin,

  FileText,
  Check,
  UserPlus,
  Image as ImageIcon,
  X,
  AlertCircle,
  Loader2,
  Sparkles,
  ChevronDown,
  ChevronRight,
  CheckCircle2
} from "lucide-react";
import { Project } from "../types/project";
import { Client } from "../types/client";
import { AddClientForm } from "./AddClientForm";
import { useGetPresignedUrlMutation, uploadToS3WithPresignedUrl } from "@/lib/api/uploadApi";
import { toast } from "sonner";
import { cn } from "./ui/utils";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

interface AddProjectFormProps {
  onSubmit: (project: Omit<Project, "id" | "createdAt" | "updatedAt">) => void;
  onCancel: () => void;
}

// Mock client data - in a real app, this would come from your database
const mockClients: Client[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+1 (555) 123-4567",
    website: "https://johnsmith.com",
    companyName: "Smith Enterprises",
    companyType: "Small Business",
    industry: "Technology",
    address: {
      street: "123 Business Ave",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA"
    },
    primaryContact: {
      name: "John Smith",
      title: "CEO",
      email: "john.smith@example.com",
      phone: "+1 (555) 123-4567"
    },
    status: "Active",
    source: "Website",
    priority: "High",
    totalProjectValue: 2500000,
    projectsCount: 3,
    notes: "Premium client with multiple ongoing projects",
    tags: ["VIP", "Tech"],
    projectIds: [],
    activeProjects: 2,
    completedProjects: 1,
    createdAt: "2024-01-15",
    updatedAt: "2024-02-20",
    createdBy: "admin",
    lastContactDate: "2024-02-18"
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.johnson@greentech.com",
    phone: "+1 (555) 987-6543",
    website: "https://greentech.com",
    companyName: "GreenTech Solutions",
    companyType: "Corporation",
    industry: "Environmental",
    address: {
      street: "456 Eco Drive",
      city: "San Francisco",
      state: "CA",
      zipCode: "94102",
      country: "USA"
    },
    primaryContact: {
      name: "Sarah Johnson",
      title: "Head of Operations",
      email: "sarah.johnson@greentech.com",
      phone: "+1 (555) 987-6543"
    },
    status: "Active",
    source: "Referral",
    priority: "Medium",
    totalProjectValue: 1800000,
    projectsCount: 2,
    notes: "Sustainable building focus",
    tags: ["Sustainable", "Corporate"],
    projectIds: [],
    activeProjects: 1,
    completedProjects: 1,
    createdAt: "2024-01-20",
    updatedAt: "2024-02-15",
    createdBy: "admin",
    lastContactDate: "2024-02-10"
  },
  {
    id: "3",
    name: "Michael Rodriguez",
    email: "m.rodriguez@luxuryestate.com",
    phone: "+1 (555) 456-7890",
    companyName: "Luxury Estate Group",
    companyType: "Corporation",
    industry: "Real Estate",
    address: {
      street: "789 Elite Boulevard",
      city: "Miami",
      state: "FL",
      zipCode: "33101",
      country: "USA"
    },
    primaryContact: {
      name: "Michael Rodriguez",
      title: "Development Director",
      email: "m.rodriguez@luxuryestate.com",
      phone: "+1 (555) 456-7890"
    },
    status: "Active",
    source: "Advertisement",
    priority: "VIP",
    totalProjectValue: 5200000,
    projectsCount: 5,
    notes: "High-end residential and commercial projects",
    tags: ["Luxury", "High-Value"],
    projectIds: [],
    activeProjects: 3,
    completedProjects: 2,
    createdAt: "2023-12-10",
    updatedAt: "2024-02-22",
    createdBy: "admin",
    lastContactDate: "2024-02-22"
  }
];

// Zod validation schemas for each section
const basicInfoSchema = z.object({
  name: z.string().min(1, "Project name is required").min(3, "Project name must be at least 3 characters"),
  description: z.string().min(1, "Description is required").min(10, "Description must be at least 10 characters"),
  type: z.enum(["Villa", "Commercial", "Interior", "Landscape"]),
  category: z.string().optional(),
  priority: z.enum(["Low", "Medium", "High", "Critical"]),
  status: z.enum(["Planning", "In Progress", "On Hold", "Completed", "Cancelled"]),
});

const clientInfoSchema = z.object({
  client: z.string().min(1, "Client selection is required"),
  clientEmail: z.string().email("Invalid email address").optional().or(z.literal("")),
  clientPhone: z.string().optional(),
});

const detailsSchema = z.object({
  requirements: z.string().min(1, "Client requirements are required").min(20, "Requirements must be at least 20 characters"),
  currentPhase: z.string().optional(),
  progressPercentage: z.string().optional(),
  projectManager: z.string().min(1, "Project manager is required"),
  teamMembers: z.string().optional(),
});

const timelineSchema = z.object({
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  deadline: z.string().optional(),
  estimatedDuration: z.string().optional(),
  totalBudget: z.string().min(1, "Total budget is required").refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Budget must be a positive number",
  }),
  spentAmount: z.string().optional(),
});

const additionalSchema = z.object({
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  tags: z.string().optional(),
});

// Combined schema for the entire form
const projectFormSchema = basicInfoSchema
  .merge(clientInfoSchema)
  .merge(detailsSchema)
  .merge(timelineSchema)
  .merge(additionalSchema)
  .extend({
    createdBy: z.string(),
  });

type ProjectFormData = z.infer<typeof projectFormSchema>;

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

  // Presigned URL mutation
  const [getPresignedUrl] = useGetPresignedUrlMutation();

  // Initialize react-hook-form with Zod validation
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
      createdBy: "Current User",
    },
  });

  // Watch form values
  const formData = watch();

  const filteredClients = mockClients.filter(client =>
    client.name.toLowerCase().includes(clientSearchTerm.toLowerCase()) ||
    client.companyName.toLowerCase().includes(clientSearchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(clientSearchTerm.toLowerCase())
  );

  const handleClientSelect = (client: Client) => {
    setSelectedClient(client);
    setValue("client", client.name);
    setValue("clientEmail", client.email);
    setValue("clientPhone", client.phone);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Invalid file type', {
          description: 'Please select a valid image file (PNG, JPG, GIF, or WebP)',
        });
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File too large', {
          description: 'Image size should be less than 10MB',
        });
        return;
      }

      // Store the file for later upload
      setImageFile(file);

      // Create preview
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'VIP': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      case 'High': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 border-gray-200 dark:border-gray-800';
    }
  };

  const handleSubmit = handleFormSubmit(async (data: ProjectFormData) => {
    setSubmitError(null);
    let imageUrls: string[] = [];

    // Upload image using presigned URL if one is selected
    if (imageFile) {
      setIsUploading(true);
      setUploadProgress(0);

      try {
        // Step 1: Get presigned URL from backend
        const presignedData = await getPresignedUrl({
          fileName: imageFile.name,
          contentType: imageFile.type,
          folder: 'projects',
        }).unwrap();

        // Step 2: Upload directly to S3 using presigned URL
        await uploadToS3WithPresignedUrl(
          presignedData.uploadUrl,
          imageFile,
          (progress) => setUploadProgress(progress)
        );

        // Step 3: Use the CloudFront URL for the project
        imageUrls = [presignedData.cloudFrontUrl];
      } catch (error) {
        console.error('Failed to upload image:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to upload image. Please try again.';
        setSubmitError(errorMessage);
        toast.error('Upload failed', {
          description: errorMessage,
        });
        setIsUploading(false);
        setUploadProgress(0);
        return;
      } finally {
        setIsUploading(false);
      }
    }

    const project: Omit<Project, "id" | "createdAt" | "updatedAt"> = {
      name: data.name,
      description: `${data.description}${data.requirements ? '\n\nClient Requirements:\n' + data.requirements : ''}`,
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
      estimatedDuration: data.estimatedDuration ? parseInt(data.estimatedDuration) : undefined,
      totalBudget: parseFloat(data.totalBudget) || 0,
      spentAmount: data.spentAmount ? parseFloat(data.spentAmount) : undefined,
      remainingBudget: (parseFloat(data.totalBudget) || 0) - (parseFloat(data.spentAmount || "0") || 0),
      progressPercentage: data.progressPercentage ? parseInt(data.progressPercentage) : undefined,
      currentPhase: data.currentPhase || undefined,
      milestones: [],
      projectManager: data.projectManager,
      teamMembers: data.teamMembers ? data.teamMembers.split(",").map(member => member.trim()).filter(Boolean) : [],
      location: {
        address: data.address || undefined,
        city: data.city || undefined,
        state: data.state || undefined,
        country: data.country || "USA"
      },
      tags: data.tags ? data.tags.split(",").map(tag => tag.trim()).filter(Boolean) : [],
      documents: [],
      images: imageUrls,
      coverImage: imageUrls[0] || undefined,
      createdBy: data.createdBy
    };

    onSubmit(project);
  });

  const getCategoryOptions = () => {
    switch (formData.type) {
      case "Villa":
        return ["Luxury Residential", "Family Home", "Vacation Villa", "Sustainable Housing"];
      case "Commercial":
        return ["Office Building", "Retail Complex", "Mixed-use Development", "Industrial Facility"];
      case "Interior":
        return ["Residential Interior", "Commercial Interior", "Hospitality Design", "Office Design"];
      case "Landscape":
        return ["Residential Landscape", "Commercial Landscape", "Urban Planning", "Educational Campus"];
      default:
        return [];
    }
  };

  // Check for errors in each section
  const hasIdentityErrors = !!(errors.name || errors.description || errors.type || errors.status || errors.priority);
  const hasClientErrors = !!(errors.client || errors.clientEmail || errors.clientPhone);
  const hasScopeErrors = !!(errors.requirements || errors.projectManager);
  const hasFinancialsErrors = !!(errors.startDate || errors.totalBudget);
  const hasLocationErrors = !!(errors.address || errors.city || errors.state || errors.country);

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
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
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
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Create New Project</h2>
              <p className="text-sm text-gray-500 dark:text-muted-foreground font-medium">Set up a comprehensive project with client information</p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" onKeyDown={(e) => {
        // Prevent form submission on Enter key press
        if (e.key === 'Enter' && e.target instanceof HTMLInputElement && e.target.type !== 'submit') {
          e.preventDefault();
        }
      }}>
        {submitError && (
          <Alert variant="destructive" className="bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Submission Error</AlertTitle>
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        )}

        {/* Roadmap Style Sections */}
        <div className="space-y-3 bg-white dark:bg-black/40 p-4 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm dark:shadow-none">
          
          {/* Section 1: Project Identity */}
          <div className="space-y-3">
             <SectionHeader
              id="identity"
              icon={Building2}
              title="Project Identity"
              subtitle="Basic project details and classification"
              status="Required"
              isActive={expandedSection === "identity"}
              hasErrors={hasIdentityErrors}
            />
            {expandedSection === "identity" && (
              <div className="p-4 pt-2 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="name" className="text-xs font-medium text-muted-foreground">Project Name *</Label>
                    <Input
                      id="name"
                      {...register("name")}
                      placeholder="e.g. Modern Villa Landscape"
                      className="bg-background"
                    />
                    {errors.name && <p className="text-[10px] text-red-500">{errors.name.message}</p>}
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="type" className="text-xs font-medium text-muted-foreground">Project Type *</Label>
                    <Select value={formData.type} onValueChange={(value) => setValue("type", value as "Villa" | "Commercial" | "Interior" | "Landscape")}>
                      <SelectTrigger className="bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Villa">Villa</SelectItem>
                        <SelectItem value="Commercial">Commercial</SelectItem>
                        <SelectItem value="Interior">Interior</SelectItem>
                        <SelectItem value="Landscape">Landscape</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.type && <p className="text-[10px] text-red-500">{errors.type.message}</p>}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="description" className="text-xs font-medium text-muted-foreground">Project Description *</Label>
                  <Textarea
                    id="description"
                    {...register("description")}
                    placeholder="Describe the project goals, scope, and vision in detail..."
                    className="bg-background min-h-[120px] resize-none"
                  />
                  {errors.description && <p className="text-[10px] text-red-500">{errors.description.message}</p>}
                </div>

                 {/* Project Image Upload */}
                 <div className="space-y-3">
                  <Label htmlFor="projectImage" className="text-xs font-medium text-muted-foreground">Project Picture</Label>
                  <div className="space-y-4">
                    {!imagePreview ? (
                      <div className="relative">
                        <input
                          id="projectImage"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                        <label
                          htmlFor="projectImage"
                          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border/50 rounded-lg cursor-pointer bg-background/30 hover:bg-background/50 transition-all duration-300 group"
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <ImageIcon className="h-8 w-8 text-muted-foreground mb-3 group-hover:text-blue-500 transition-colors" aria-label="Upload image" />
                            <p className="text-xs text-muted-foreground">
                              <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                          </div>
                        </label>
                      </div>
                    ) : (
                      <div className="relative w-full h-48 border-2 border-border/50 rounded-lg overflow-hidden bg-background/30">
                        <NextImage
                          src={imagePreview}
                          alt="Project preview"
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

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="category" className="text-xs font-medium text-muted-foreground">Category</Label>
                    <Select value={formData.category} onValueChange={(value) => setValue("category", value)}>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {getCategoryOptions().map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="priority" className="text-xs font-medium text-muted-foreground">Priority</Label>
                    <Select value={formData.priority} onValueChange={(value) => setValue("priority", value as "Low" | "Medium" | "High" | "Critical")}>
                      <SelectTrigger className="bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="status" className="text-xs font-medium text-muted-foreground">Status</Label>
                    <Select value={formData.status} onValueChange={(value) => setValue("status", value as "Planning" | "In Progress" | "On Hold" | "Completed" | "Cancelled")}>
                      <SelectTrigger className="bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Planning">Planning</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="On Hold">On Hold</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
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
            />
            {expandedSection === "stakeholders" && (
              <div className="p-4 pt-2 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex justify-between items-center">
                  <Label className="text-xs font-medium text-muted-foreground">Lead Client</Label>
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    className="text-blue-600 h-auto p-0"
                    onClick={() => setShowAddClientDialog(true)}
                  >
                    <UserPlus className="mr-1 h-3 w-3" />
                    New Client
                  </Button>
                </div>
                
                 {/* Client Search */}
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search clients by name, company, or email..."
                      value={clientSearchTerm}
                      onChange={(e) => setClientSearchTerm(e.target.value)}
                      className="pl-9 bg-background"
                    />
                  </div>

                  {/* Client Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-80 overflow-y-auto">
                      {filteredClients.map((client) => (
                        <div
                          key={client.id}
                          className={cn(
                            "relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-md border rounded-xl p-3 flex items-start gap-3",
                            selectedClient?.id === client.id
                              ? "ring-2 ring-blue-500 border-blue-500/50 bg-blue-50/50 dark:bg-blue-950/20"
                              : "bg-background border-border hover:border-border/60"
                          )}
                          onClick={() => handleClientSelect(client)}
                        >
                            <Avatar className="h-10 w-10 border border-border/50">
                              <AvatarImage src={`https://avatar.vercel.sh/${client.name}`} alt={client.name} />
                              <AvatarFallback className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 text-xs">
                                {client.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <h4 className="text-sm font-medium text-foreground truncate">{client.name}</h4>
                                  {selectedClient?.id === client.id && <Check className="h-3 w-3 text-blue-600" />}
                                </div>
                                <p className="text-xs text-muted-foreground truncate">{client.companyName}</p>
                                <div className="flex items-center gap-2 mt-1">
                                   <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${getPriorityColor(client.priority)}`}>
                                    {client.priority}
                                  </Badge>
                                </div>
                            </div>
                        </div>
                      ))}
                  </div>
                  {errors.client && <p className="text-[10px] text-red-500">{errors.client.message}</p>}
              </div>
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
            />
            {expandedSection === "scope" && (
                <div className="p-4 pt-2 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="space-y-3">
                    <Label htmlFor="requirements" className="text-xs font-medium text-muted-foreground">Client Requirements *</Label>
                    <Textarea
                      id="requirements"
                      {...register("requirements")}
                      placeholder="List key requirements and deliverables..."
                      className="bg-background min-h-[100px]"
                    />
                    {errors.requirements && <p className="text-[10px] text-red-500">{errors.requirements.message}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-3">
                        <Label htmlFor="projectManager" className="text-xs font-medium text-muted-foreground">Project Manager *</Label>
                        <Input
                          id="projectManager"
                          {...register("projectManager")}
                          placeholder="Lead Architect / Manager"
                          className="bg-background"
                        />
                        {errors.projectManager && <p className="text-[10px] text-red-500">{errors.projectManager.message}</p>}
                     </div>
                     <div className="space-y-3">
                        <Label htmlFor="currentPhase" className="text-xs font-medium text-muted-foreground">Current Phase</Label>
                        <Input
                          id="currentPhase"
                          {...register("currentPhase")}
                          placeholder="e.g. Initial Design"
                          className="bg-background"
                        />
                     </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-xs font-medium text-muted-foreground">Team Members</Label>
                     <Input
                        placeholder="Add member and press Enter"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const input = e.currentTarget;
                            const newMember = input.value.trim();
                            if (newMember && !teamList.includes(newMember)) {
                              const updatedTeam = [...teamList, newMember];
                              setTeamList(updatedTeam);
                              setValue("teamMembers", updatedTeam.join(", "));
                              input.value = "";
                            }
                          }
                        }}
                        className="bg-background"
                      />
                      {teamList.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {teamList.map((member, index) => (
                            <Badge key={index} variant="secondary" className="gap-1">
                              {member}
                              <X
                                className="h-3 w-3 cursor-pointer hover:text-red-500"
                                onClick={() => {
                                  const updatedTeam = teamList.filter(t => t !== member);
                                  setTeamList(updatedTeam);
                                  setValue("teamMembers", updatedTeam.join(", "));
                                }}
                              />
                            </Badge>
                          ))}
                        </div>
                      )}
                       <input type="hidden" {...register("teamMembers")} />
                  </div>
                </div>
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
            />
            {expandedSection === "financials" && (
               <div className="p-4 pt-2 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <Label htmlFor="startDate" className="text-xs font-medium text-muted-foreground">Start Date *</Label>
                      <Input
                        id="startDate"
                        type="date"
                        {...register("startDate")}
                        className="bg-background"
                      />
                      {errors.startDate && <p className="text-[10px] text-red-500">{errors.startDate.message}</p>}
                    </div>
                     <div className="space-y-3">
                      <Label htmlFor="deadline" className="text-xs font-medium text-muted-foreground">Deadline</Label>
                      <Input
                        id="deadline"
                        type="date"
                        {...register("deadline")}
                        className="bg-background"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <Label htmlFor="totalBudget" className="text-xs font-medium text-muted-foreground">Total Budget *</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="totalBudget"
                          type="number"
                          {...register("totalBudget")}
                          className="pl-9 bg-background"
                          placeholder="0.00"
                        />
                      </div>
                      {errors.totalBudget && <p className="text-[10px] text-red-500">{errors.totalBudget.message}</p>}
                    </div>
                     <div className="space-y-3">
                      <Label htmlFor="spentAmount" className="text-xs font-medium text-muted-foreground">Spent Amount</Label>
                       <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="spentAmount"
                          type="number"
                          {...register("spentAmount")}
                          className="pl-9 bg-background"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  </div>
               </div>
            )}
           </div>

           <Separator className="bg-gray-100 dark:bg-white/5" />

           {/* Section 5: Location & Meta */}
           <div className="space-y-3">
             <SectionHeader
              id="location"
              icon={MapPin}
              title="Location & Meta"
              subtitle="Site address and categorization"
              status="Optional"
              isActive={expandedSection === "location"}
              hasErrors={hasLocationErrors}
            />
            {expandedSection === "location" && (
              <div className="p-4 pt-2 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="space-y-3">
                   <Label htmlFor="address" className="text-xs font-medium text-muted-foreground">Address</Label>
                   <Input
                    id="address"
                    {...register("address")}
                    placeholder="Street address of project site"
                    className="bg-background"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <div className="space-y-3">
                      <Label htmlFor="city" className="text-xs font-medium text-muted-foreground">City</Label>
                      <Input id="city" {...register("city")} className="bg-background" />
                   </div>
                   <div className="space-y-3">
                      <Label htmlFor="state" className="text-xs font-medium text-muted-foreground">State</Label>
                      <Input id="state" {...register("state")} className="bg-background" />
                   </div>
                   <div className="space-y-3">
                      <Label htmlFor="country" className="text-xs font-medium text-muted-foreground">Country</Label>
                      <Input id="country" {...register("country")} className="bg-background" />
                   </div>
                </div>

                <div className="space-y-3">
                   <Label className="text-xs font-medium text-muted-foreground">Tags</Label>
                    <Input
                      placeholder="Add tag and press Enter"
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
                      className="bg-background"
                    />
                     {tagsList.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {tagsList.map((tag, index) => (
                            <Badge key={index} variant="outline" className="gap-1">
                              {tag}
                              <X
                                className="h-3 w-3 cursor-pointer hover:text-red-500"
                                onClick={() => {
                                  const updatedTags = tagsList.filter(t => t !== tag);
                                  setTagsList(updatedTags);
                                  setValue("tags", updatedTags.join(", "));
                                }}
                              />
                            </Badge>
                          ))}
                        </div>
                      )}
                      <input type="hidden" {...register("tags")} />
                </div>
              </div>
            )}
           </div>

        </div>

        {/* Footer Actions */}
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
      
      {/* Client Dialog */}
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
                      // In a real app we'd refresh the list
                    }}
                 />
              </div>
           </div>
        </div>
      )}

    </div>
  );
}