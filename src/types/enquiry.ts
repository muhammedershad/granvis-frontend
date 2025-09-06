export interface Enquiry {
  id: string;
  name: string;
  email?: string;
  phone: string;
  careOf: {
    type: 'existing' | 'new';
    clientId?: string;
    clientName?: string;
    name?: string;
    address?: string;
  };
  projectDetails: string;
  customFields: { [key: string]: string };
  status: 'new' | 'follow-up' | 'converted' | 'dead-lead';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  source: 'website' | 'referral' | 'social-media' | 'advertisement' | 'walk-in' | 'other';
  estimatedBudget?: string;
  estimatedTimeline?: string;
  dateCreated: string;
  lastUpdated: string;
  assignedTo?: string;
  notes: string[];
  followUpDate?: string;
  convertedToClientId?: string;
}

export interface EnquiryFormData {
  name: string;
  email: string;
  phone: string;
  careOf: {
    type: 'existing' | 'new';
    clientId?: string;
    clientName?: string;
    name?: string;
    address?: string;
  };
  projectDetails: string;
  customFields: { [key: string]: string };
  priority: 'low' | 'medium' | 'high' | 'urgent';
  source: 'website' | 'referral' | 'social-media' | 'advertisement' | 'walk-in' | 'other';
  estimatedBudget?: string;
  estimatedTimeline?: string;
  assignedTo?: string;
}

export interface FollowUp {
  id: string;
  enquiryId: string;
  date: string;
  method: 'call' | 'email' | 'meeting' | 'site-visit';
  notes: string;
  nextFollowUpDate?: string;
  outcome: 'interested' | 'not-interested' | 'needs-more-info' | 'converted' | 'postponed';
  createdBy: string;
}