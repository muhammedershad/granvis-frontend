export interface Project {
  id: string;

  // Basic Information
  name: string;
  description: string;
  client: string;
  clientId: string;
  clientEmail?: string;
  clientPhone?: string;

  // Project Details
  type: "Villa" | "Commercial" | "Interior" | "Landscape";
  category?: string; // subcategory like "Residential Villa", "Office Complex", etc.
  status: "Planning" | "In Progress" | "On Hold" | "Completed" | "Cancelled";
  priority: "Low" | "Medium" | "High" | "Critical";

  // Timeline
  startDate: string;
  endDate?: string;

  // Built-up Area (in square feet)
  builtUpArea?: number;

  // Budget (optional)
  totalBudget?: number;
  spentAmount?: number;
  remainingBudget?: number;

  // Progress
  progressPercentage?: number;
  currentPhase?: string;
  milestones: ProjectMilestone[];

  // Team
  projectManager: string;
  managerId: string;
  teamMembers: string[];
  teamMemberIds?: string[];

  // Location (required)
  location: {
    address: string;
    city: string;
    state: string;
    country?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };

  // Additional Details
  documents: ProjectDocument[];
  images: string[];
  coverImage?: string;

  // System fields
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface ProjectMilestone {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  completedDate?: string;
}

export interface ProjectDocument {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface ProjectFilters {
  search: string;
  type: string;
  status: string;
  priority: string;
  client: string;
  projectManager: string;
}

export interface ProjectSort {
  field: keyof Project;
  direction: "asc" | "desc";
}

export type ProjectViewType = "cards" | "table";
