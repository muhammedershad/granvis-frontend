// Firm Settings Interface
export interface FirmSettings {
  id: string;
  name: string;
  logo?: string;
  logoKey?: string;
  address: string;
  city: string;
  state: string;
  country: string;
  phone: string;
  alternatePhone?: string;
  email: string;
  website?: string;
  gstin?: string;
  pan?: string;

  // Invoice settings
  invoicePrefix: string;
  invoiceStartNumber: number;

  // Default notes for payment slips
  defaultNotes: string[];

  // Bank details
  bankName?: string;
  bankAccountNumber?: string;
  bankIfsc?: string;
  bankBranch?: string;
  upiId?: string;

  // Status flags
  isDefault: boolean;
  isActive: boolean;

  // System fields
  createdAt: string;
  updatedAt: string;
}

// DTOs for API calls
export interface CreateFirmSettingsDto {
  name: string;
  logo?: string;
  logoKey?: string;
  address: string;
  city: string;
  state: string;
  country?: string;
  phone: string;
  alternatePhone?: string;
  email: string;
  website?: string;
  gstin?: string;
  pan?: string;
  invoicePrefix?: string;
  invoiceStartNumber?: number;
  defaultNotes?: string[];
  bankName?: string;
  bankAccountNumber?: string;
  bankIfsc?: string;
  bankBranch?: string;
  upiId?: string;
  isDefault?: boolean;
}

export type UpdateFirmSettingsDto = Partial<CreateFirmSettingsDto>;
