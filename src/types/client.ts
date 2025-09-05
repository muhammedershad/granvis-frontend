export interface Client {
  id: string;
  
  // Basic Information
  name: string;
  email: string;
  phone: string;
  website?: string;
  
  // Company Information
  companyName: string;
  companyType: 'Individual' | 'Small Business' | 'Corporation' | 'Non-Profit' | 'Government';
  industry: string;
  
  // Address
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  
  // Contact Details
  primaryContact: {
    name: string;
    title: string;
    email: string;
    phone: string;
  };
  secondaryContact?: {
    name: string;
    title: string;
    email: string;
    phone: string;
  };
  
  // Business Information
  status: 'Active' | 'Inactive' | 'Potential' | 'Former';
  source: 'Referral' | 'Website' | 'Social Media' | 'Advertisement' | 'Cold Call' | 'Other';
  priority: 'Low' | 'Medium' | 'High' | 'VIP';
  
  // Financial
  totalProjectValue: number;
  projectsCount: number;
  
  // Notes and Tags
  notes: string;
  tags: string[];
  
  // Project Relationships
  projectIds: string[];
  activeProjects: number;
  completedProjects: number;
  
  // System fields
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastContactDate?: string;
}

export interface ClientFilters {
  search: string;
  companyType: string;
  status: string;
  priority: string;
  industry: string;
  source: string;
}

export interface ClientSort {
  field: keyof Client;
  direction: 'asc' | 'desc';
}

export type ClientViewType = 'cards' | 'table';