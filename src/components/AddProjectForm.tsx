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
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Search, Users, Building2, Calendar, DollarSign, MapPin, Tag, FileText, Plus, Check, Phone, UserPlus, Image, X, AlertCircle, Loader2 } from "lucide-react";
import { Project } from "../types/project";
import { Client } from "../types/client";
import { AddClientForm } from "./AddClientForm";
import { useGetPresignedUrlMutation, uploadToS3WithPresignedUrl } from "@/lib/api/uploadApi";
import { toast } from "sonner";

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

// Zod validation schemas for each tab
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

// Helper component for error messages
const ErrorMessage = ({ message }: { message?: string }) => {
  if (!message) return null;
  return (
    <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
      <AlertCircle className="h-3 w-3" />
      <span>{message}</span>
    </div>
  );
};

export function AddProjectForm({ onSubmit, onCancel }: AddProjectFormProps) {
  const [currentTab, setCurrentTab] = useState("basic");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientSearchTerm, setClientSearchTerm] = useState("");
  const [showAddClientDialog, setShowAddClientDialog] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const [completedTabs, setCompletedTabs] = useState<string[]>([]);

  // Presigned URL mutation
  const [getPresignedUrl] = useGetPresignedUrlMutation();

  // Initialize react-hook-form with Zod validation
  const {
    register,
    handleSubmit: handleFormSubmit,
    watch,
    setValue,
    formState: { errors },
    trigger,
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

  const handleClientCreated = () => {
    setShowAddClientDialog(false);
    // In a real app, you'd refresh the clients list here
    // and potentially auto-select the newly created client
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
    setUploadedImageUrl(null);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'Potential': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'Inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 border-gray-200 dark:border-gray-800';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 border-gray-200 dark:border-gray-800';
    }
  };

  // Validate current tab before moving to next
  const validateCurrentTab = async (tab: string): Promise<boolean> => {
    let fields: (keyof ProjectFormData)[] = [];

    switch (tab) {
      case "basic":
        fields = ["name", "description", "type", "category", "priority", "status"];
        break;
      case "client":
        fields = ["client", "clientEmail", "clientPhone"];
        break;
      case "details":
        fields = ["requirements", "projectManager", "teamMembers", "currentPhase", "progressPercentage"];
        break;
      case "timeline":
        fields = ["startDate", "endDate", "deadline", "estimatedDuration", "totalBudget", "spentAmount"];
        break;
      case "additional":
        fields = ["address", "city", "state", "country", "tags"];
        break;
    }

    const result = await trigger(fields);
    if (result) {
      setCompletedTabs(prev => [...new Set([...prev, tab])]);
    }
    return result;
  };

  // Handle tab change with validation
  const handleTabChange = async (newTab: string) => {
    const tabs = ['basic', 'client', 'details', 'timeline', 'additional'];
    const currentIndex = tabs.indexOf(currentTab);
    const newIndex = tabs.indexOf(newTab);

    // If moving forward, validate current tab
    if (newIndex > currentIndex) {
      const isValid = await validateCurrentTab(currentTab);
      if (!isValid) {
        return; // Don't change tab if validation fails
      }
    }

    setCurrentTab(newTab);
  };

  // Handle next button click
  const handleNext = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();

    const isValid = await validateCurrentTab(currentTab);
    if (isValid) {
      const tabs = ['basic', 'client', 'details', 'timeline', 'additional'];
      const currentIndex = tabs.indexOf(currentTab);
      if (currentIndex < tabs.length - 1) {
        setCurrentTab(tabs[currentIndex + 1]);
      }
    }
  };

  const handleSubmit = handleFormSubmit(async (data: ProjectFormData) => {
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
        setUploadedImageUrl(presignedData.cloudFrontUrl);
      } catch (error) {
        console.error('Failed to upload image:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to upload image. Please try again.';
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
      // case "Commercial":
      //   return ["Office Building", "Retail Complex", "Mixed-use Development", "Industrial Facility"];
      // case "Interior":
      //   return ["Residential Interior", "Commercial Interior", "Hospitality Design", "Office Design"];
      // case "Landscape":
      //   return ["Residential Landscape", "Commercial Landscape", "Urban Planning", "Educational Campus"];
      default:
        return [];
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8" onKeyDown={(e) => {
        // Prevent form submission on Enter key press
        if (e.key === 'Enter' && e.target instanceof HTMLInputElement && e.target.type !== 'submit') {
          e.preventDefault();
        }
      }}>
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-200/50 dark:border-blue-800/50">
              <Building2 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-foreground">Create New Project</h1>
              <p className="text-muted-foreground">Set up a comprehensive project with client information, requirements, and specifications</p>
            </div>
          </div>
        </div>

        <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-muted/30 p-1 rounded-xl">
            <TabsTrigger value="basic" className="flex items-center gap-2 data-[state=active]:bg-background relative">
              {completedTabs.includes("basic") && <Check className="h-3 w-3 absolute top-1 right-1 text-green-600" />}
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Basic Info</span>
            </TabsTrigger>
            <TabsTrigger value="client" className="flex items-center gap-2 data-[state=active]:bg-background relative">
              {completedTabs.includes("client") && <Check className="h-3 w-3 absolute top-1 right-1 text-green-600" />}
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Client</span>
            </TabsTrigger>
            <TabsTrigger value="details" className="flex items-center gap-2 data-[state=active]:bg-background relative">
              {completedTabs.includes("details") && <Check className="h-3 w-3 absolute top-1 right-1 text-green-600" />}
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Details</span>
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex items-center gap-2 data-[state=active]:bg-background relative">
              {completedTabs.includes("timeline") && <Check className="h-3 w-3 absolute top-1 right-1 text-green-600" />}
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Timeline</span>
            </TabsTrigger>
            <TabsTrigger value="additional" className="flex items-center gap-2 data-[state=active]:bg-background relative">
              {completedTabs.includes("additional") && <Check className="h-3 w-3 absolute top-1 right-1 text-green-600" />}
              <MapPin className="h-4 w-4" />
              <span className="hidden sm:inline">Additional</span>
            </TabsTrigger>
          </TabsList>

          {/* Basic Information Tab */}
          <TabsContent value="basic" className="space-y-6">
            <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.02] via-purple-500/[0.02] to-indigo-500/[0.02] dark:from-blue-400/[0.05] dark:via-purple-400/[0.05] dark:to-indigo-400/[0.05]"></div>
              <CardHeader className="relative">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-200/50 dark:border-blue-800/50">
                    <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-foreground">Project Information</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">Basic project details and overview</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="name" className="text-foreground">Project Name *</Label>
                    <Input
                      id="name"
                      {...register("name")}
                      placeholder="Enter project name"
                      className="bg-background/50 border-border/50 focus:bg-background transition-colors"
                    />
                    <ErrorMessage message={errors.name?.message} />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="type" className="text-foreground">Project Type *</Label>
                    <Select value={formData.type} onValueChange={(value) => setValue("type", value as "Villa" | "Commercial" | "Interior" | "Landscape")}>
                      <SelectTrigger className="bg-background/50 border-border/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Villa">Villa</SelectItem>
                        <SelectItem value="Commercial">Commercial</SelectItem>
                        <SelectItem value="Interior">Interior</SelectItem>
                        <SelectItem value="Landscape">Landscape</SelectItem>
                      </SelectContent>
                    </Select>
                    <ErrorMessage message={errors.type?.message} />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="description" className="text-foreground">Project Description *</Label>
                  <Textarea
                    id="description"
                    {...register("description")}
                    placeholder="Describe the project goals, scope, and vision in detail..."
                    className="bg-background/50 border-border/50 focus:bg-background transition-colors min-h-[120px] resize-none"
                  />
                  <ErrorMessage message={errors.description?.message} />
                </div>

                {/* Project Image Upload */}
                <div className="space-y-3">
                  <Label htmlFor="projectImage" className="text-foreground">Project Picture</Label>
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
                          className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border/50 rounded-lg cursor-pointer bg-background/30 hover:bg-background/50 transition-all duration-300 group"
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Image className="h-10 w-10 text-muted-foreground mb-3 group-hover:text-blue-500 transition-colors" aria-label="Upload image" />
                            <p className="mb-2 text-sm text-muted-foreground">
                              <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-muted-foreground">PNG, JPG, GIF, WebP up to 10MB</p>
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
                          className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors shadow-lg z-10"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="category" className="text-foreground">Category</Label>
                    <Select value={formData.category} onValueChange={(value) => setValue("category", value)}>
                      <SelectTrigger className="bg-background/50 border-border/50">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {getCategoryOptions().map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <ErrorMessage message={errors.category?.message} />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="priority" className="text-foreground">Priority</Label>
                    <Select value={formData.priority} onValueChange={(value) => setValue("priority", value as "Low" | "Medium" | "High" | "Critical")}>
                      <SelectTrigger className="bg-background/50 border-border/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                    <ErrorMessage message={errors.priority?.message} />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="status" className="text-foreground">Status</Label>
                    <Select value={formData.status} onValueChange={(value) => setValue("status", value as "Planning" | "In Progress" | "On Hold" | "Completed" | "Cancelled")}>
                      <SelectTrigger className="bg-background/50 border-border/50">
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
                    <ErrorMessage message={errors.status?.message} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Client Selection Tab */}
          <TabsContent value="client" className="space-y-6">
            <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.02] via-blue-500/[0.02] to-indigo-500/[0.02] dark:from-purple-400/[0.05] dark:via-blue-400/[0.05] dark:to-indigo-400/[0.05]"></div>
              <CardHeader className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-lg border border-purple-200/50 dark:border-purple-800/50">
                      <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <CardTitle className="text-foreground">Client Selection</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">Select an existing client for this project</p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="default"
                    onClick={() => setShowAddClientDialog(true)}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add New Client
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="relative space-y-6">
                <div className="space-y-6">
                  {/* Client Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search clients by name, company, or email..."
                      value={clientSearchTerm}
                      onChange={(e) => setClientSearchTerm(e.target.value)}
                      className="pl-9 bg-background/50 border-border/50 focus:bg-background transition-colors"
                    />
                  </div>

                  {/* Client Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                      {filteredClients.map((client) => (
                        <Card 
                          key={client.id} 
                          className={`relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg group ${
                            selectedClient?.id === client.id 
                              ? 'ring-2 ring-blue-500 border-blue-500/50 bg-blue-50/50 dark:bg-blue-950/20' 
                              : 'bg-card/30 hover:bg-card/50 border-border/30 hover:border-border/60'
                          }`}
                          onClick={() => handleClientSelect(client)}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.01] to-purple-500/[0.01] group-hover:from-blue-500/[0.02] group-hover:to-purple-500/[0.02] transition-all duration-300"></div>
                          <CardContent className="relative p-4">
                            <div className="flex items-start space-y-3">
                              <div className="flex-shrink-0">
                                <Avatar className="h-12 w-12 border-2 border-border/50">
                                  <AvatarImage src={`https://avatar.vercel.sh/${client.name}`} alt={client.name} />
                                  <AvatarFallback className="bg-gradient-to-br from-blue-500/10 to-purple-500/10">
                                    {client.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                              </div>
                              <div className="flex-1 min-w-0 ml-3">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="text-foreground truncate">{client.name}</h4>
                                  {selectedClient?.id === client.id && (
                                    <div className="p-1 bg-blue-500 rounded-full">
                                      <Check className="h-3 w-3 text-white" />
                                    </div>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground truncate mb-2">{client.companyName}</p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                                  <Phone className="h-3 w-3" />
                                  <span className="truncate">{client.phone}</span>
                                </div>
                                <div className="flex items-center gap-2 mb-3">
                                  <Badge variant="outline" className={`text-xs ${getPriorityColor(client.priority)}`}>
                                    {client.priority}
                                  </Badge>
                                  <Badge variant="outline" className={`text-xs ${getStatusColor(client.status)}`}>
                                    {client.status}
                                  </Badge>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  <div>Projects: {client.projectsCount}</div>
                                  <div>Value: ${client.totalProjectValue.toLocaleString()}</div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                  {filteredClients.length === 0 && (
                    <div className="text-center py-8">
                      <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-foreground mb-2">No clients found</h3>
                      <p className="text-muted-foreground">Try adjusting your search criteria or create a new client</p>
                    </div>
                  )}
                </div>

                {/* Selected Client Summary */}
                {selectedClient && (
                  <div className="mt-6 p-4 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-800/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border-2 border-blue-200/50 dark:border-blue-800/50">
                        <AvatarImage src={`https://avatar.vercel.sh/${selectedClient.name}`} alt={selectedClient.name} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500/10 to-purple-500/10">
                          {selectedClient.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="text-foreground">{selectedClient.name}</h4>
                        <p className="text-sm text-muted-foreground">{selectedClient.companyName}</p>
                        <p className="text-sm text-muted-foreground">{selectedClient.phone}</p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedClient(null);
                          setValue("client", "");
                          setValue("clientEmail", "");
                          setValue("clientPhone", "");
                        }}
                        className="ml-auto text-muted-foreground hover:text-foreground"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Details Tab */}
          <TabsContent value="details" className="space-y-6">
            <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.02] via-green-500/[0.02] to-emerald-600/[0.02] dark:from-emerald-400/[0.05] dark:via-green-400/[0.05] dark:to-emerald-500/[0.05]"></div>
              <CardHeader className="relative">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-lg border border-emerald-200/50 dark:border-emerald-800/50">
                    <FileText className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <CardTitle className="text-foreground">Project Requirements & Details</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">Detailed specifications and client requirements</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="requirements" className="text-foreground">Client Requirements & Specifications *</Label>
                  <Textarea
                    id="requirements"
                    {...register("requirements")}
                    placeholder="Detail the client's specific requirements, preferences, constraints, and any special considerations. Include architectural style preferences, space requirements, technical specifications, accessibility needs, sustainability goals, and any other important project requirements..."
                    className="bg-background/50 border-border/50 focus:bg-background transition-colors min-h-[200px] resize-none"
                  />
                  <ErrorMessage message={errors.requirements?.message} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="currentPhase" className="text-foreground">Current Phase</Label>
                    <Input
                      id="currentPhase"
                      {...register("currentPhase")}
                      placeholder="e.g., Conceptual Design, Design Development, Documentation"
                      className="bg-background/50 border-border/50 focus:bg-background transition-colors"
                    />
                    <ErrorMessage message={errors.currentPhase?.message} />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="progressPercentage" className="text-foreground">Progress (%)</Label>
                    <Input
                      id="progressPercentage"
                      type="number"
                      min="0"
                      max="100"
                      {...register("progressPercentage")}
                      className="bg-background/50 border-border/50 focus:bg-background transition-colors"
                    />
                    <ErrorMessage message={errors.progressPercentage?.message} />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="projectManager" className="text-foreground">Project Manager *</Label>
                    <Input
                      id="projectManager"
                      {...register("projectManager")}
                      placeholder="Assigned project manager"
                      className="bg-background/50 border-border/50 focus:bg-background transition-colors"
                    />
                    <ErrorMessage message={errors.projectManager?.message} />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="teamMembers" className="text-foreground">Team Members</Label>
                    <Input
                      id="teamMembers"
                      {...register("teamMembers")}
                      placeholder="Team member names (comma-separated)"
                      className="bg-background/50 border-border/50 focus:bg-background transition-colors"
                    />
                    <ErrorMessage message={errors.teamMembers?.message} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Timeline & Budget Tab */}
          <TabsContent value="timeline" className="space-y-6">
            <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/[0.02] via-orange-500/[0.02] to-amber-600/[0.02] dark:from-amber-400/[0.05] dark:via-orange-400/[0.05] dark:to-amber-500/[0.05]"></div>
              <CardHeader className="relative">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-lg border border-amber-200/50 dark:border-amber-800/50">
                    <Calendar className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <CardTitle className="text-foreground">Timeline & Budget</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">Project schedule and financial planning</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative space-y-6">
                {/* Timeline Section */}
                <div className="space-y-4">
                  <h3 className="text-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Project Timeline
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="startDate" className="text-foreground">Start Date *</Label>
                      <Input
                        id="startDate"
                        type="date"
                        {...register("startDate")}
                        className="bg-background/50 border-border/50 focus:bg-background transition-colors"
                      />
                      <ErrorMessage message={errors.startDate?.message} />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="endDate" className="text-foreground">End Date</Label>
                      <Input
                        id="endDate"
                        type="date"
                        {...register("endDate")}
                        className="bg-background/50 border-border/50 focus:bg-background transition-colors"
                      />
                      <ErrorMessage message={errors.endDate?.message} />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="deadline" className="text-foreground">Deadline</Label>
                      <Input
                        id="deadline"
                        type="date"
                        {...register("deadline")}
                        className="bg-background/50 border-border/50 focus:bg-background transition-colors"
                      />
                      <ErrorMessage message={errors.deadline?.message} />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="estimatedDuration" className="text-foreground">Duration (days)</Label>
                      <Input
                        id="estimatedDuration"
                        type="number"
                        {...register("estimatedDuration")}
                        placeholder="365"
                        className="bg-background/50 border-border/50 focus:bg-background transition-colors"
                      />
                      <ErrorMessage message={errors.estimatedDuration?.message} />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Budget Section */}
                <div className="space-y-4">
                  <h3 className="text-foreground flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Project Budget
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="totalBudget" className="text-foreground">Total Budget ($) *</Label>
                      <Input
                        id="totalBudget"
                        type="number"
                        {...register("totalBudget")}
                        placeholder="1000000"
                        className="bg-background/50 border-border/50 focus:bg-background transition-colors"
                      />
                      <ErrorMessage message={errors.totalBudget?.message} />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="spentAmount" className="text-foreground">Amount Spent ($)</Label>
                      <Input
                        id="spentAmount"
                        type="number"
                        {...register("spentAmount")}
                        placeholder="0"
                        className="bg-background/50 border-border/50 focus:bg-background transition-colors"
                      />
                      <ErrorMessage message={errors.spentAmount?.message} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Additional Information Tab */}
          <TabsContent value="additional" className="space-y-6">
            <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.02] via-indigo-500/[0.02] to-purple-600/[0.02] dark:from-purple-400/[0.05] dark:via-indigo-400/[0.05] dark:to-purple-500/[0.05]"></div>
              <CardHeader className="relative">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 rounded-lg border border-purple-200/50 dark:border-purple-800/50">
                    <MapPin className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <CardTitle className="text-foreground">Location & Additional Info</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">Project location and supplementary details</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative space-y-6">
                {/* Location Section */}
                <div className="space-y-4">
                  <h3 className="text-foreground flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Project Location
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="address" className="text-foreground">Street Address</Label>
                      <Input
                        id="address"
                        {...register("address")}
                        placeholder="Street address"
                        className="bg-background/50 border-border/50 focus:bg-background transition-colors"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="city" className="text-foreground">City</Label>
                      <Input
                        id="city"
                        {...register("city")}
                        placeholder="City"
                        className="bg-background/50 border-border/50 focus:bg-background transition-colors"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="state" className="text-foreground">State</Label>
                      <Input
                        id="state"
                        {...register("state")}
                        placeholder="State"
                        className="bg-background/50 border-border/50 focus:bg-background transition-colors"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="country" className="text-foreground">Country</Label>
                      <Input
                        id="country"
                        {...register("country")}
                        className="bg-background/50 border-border/50 focus:bg-background transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Tags Section */}
                <div className="space-y-4">
                  <h3 className="text-foreground flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Project Tags
                  </h3>
                  <div className="space-y-3">
                    <Label htmlFor="tags" className="text-foreground">Tags</Label>
                    <Input
                      id="tags"
                      {...register("tags")}
                      placeholder="Luxury, Sustainable, Modern, Commercial (comma-separated)"
                      className="bg-background/50 border-border/50 focus:bg-background transition-colors"
                    />
                    <p className="text-sm text-muted-foreground">Add tags to help categorize and filter projects</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Form Actions */}
        <div className="flex justify-between items-center pt-6 border-t border-border/50">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Step {['basic', 'client', 'details', 'timeline', 'additional'].indexOf(currentTab) + 1} of 5</span>
          </div>
          
          <div className="flex gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              className="border-border/50 hover:bg-muted/50"
            >
              Cancel
            </Button>
            
            {currentTab !== 'additional' ? (
              <Button
                type="button"
                onClick={handleNext}
                className="bg-gradient-to-r from-blue-600 via-blue-600 to-purple-600 hover:from-blue-700 hover:via-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 border-0"
              >
                Next Step
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isUploading}
                className="bg-gradient-to-r from-emerald-600 via-emerald-600 to-green-600 hover:from-emerald-700 hover:via-emerald-700 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 border-0 disabled:opacity-50 disabled:cursor-not-allowed min-w-[160px]"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading {uploadProgress}%
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Project
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </form>

      {/* Add Client Dialog */}
      <Dialog open={showAddClientDialog} onOpenChange={setShowAddClientDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Add New Client</DialogTitle>
            <DialogDescription>
              Create a new client to associate with this project
            </DialogDescription>
          </DialogHeader>
          <AddClientForm
            onSuccess={handleClientCreated}
            onCancel={() => setShowAddClientDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}