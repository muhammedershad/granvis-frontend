import { Milestone, RateType } from "@/types/milestone";

// ==================== TYPE DEFINITIONS ====================

export type InvoiceStatus = 'draft' | 'sent' | 'paid';
export type InvoicingStatus = 'not_invoiced' | 'partially_invoiced' | 'fully_invoiced';

export interface MilestoneInvoiceItem {
  id: string;
  milestoneId: string;
  milestoneTitle: string;
  milestoneStageNumber: number;
  rateType: 'per_sqft' | 'per_visit' | 'fixed';
  rate: number;
  quantity: number;
  calculatedAmount: number;
  editableAmount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  notes?: string;
  milestoneItems: MilestoneInvoiceItem[];
  subtotal: number;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  discountAmount: number;
  netTotal: number;
  paidAmount: number;
  balance: number;
  status: InvoiceStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface MilestoneWithInvoicing extends Milestone {
  invoicingStatus: InvoicingStatus;
  totalBilled: number;
  remainingToBill: number;
}

// ==================== STATE MANAGEMENT ====================

export interface InvoiceFormState {
  invoiceDate: string;
  invoiceReference: string;
  notes: string;
  selectedMilestones: Map<string, MilestoneInvoiceItem>;
  subtotal: number;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  discountAmount: number;
  netTotal: number;
  paidAmount: number;
  balance: number;
}

export type InvoiceFormAction =
  | { type: 'SET_INVOICE_DATE'; payload: string }
  | { type: 'SET_INVOICE_REFERENCE'; payload: string }
  | { type: 'SET_NOTES'; payload: string }
  | { type: 'TOGGLE_MILESTONE'; payload: { milestoneId: string; milestone: Milestone } }
  | { type: 'UPDATE_MILESTONE_RATE'; payload: { milestoneId: string; rateType: string; rate: number; quantity: number } }
  | { type: 'UPDATE_MILESTONE_AMOUNT'; payload: { milestoneId: string; amount: number } }
  | { type: 'SET_DISCOUNT'; payload: { type: 'percentage' | 'flat'; value: number } }
  | { type: 'SET_PAID_AMOUNT'; payload: number }
  | { type: 'RESET_FORM' }
  | { type: 'LOAD_DRAFT'; payload: Invoice | unknown };

// ==================== HELPER FUNCTIONS ====================

let invoiceCounter = 3; // Start from 3 since we have 2 mock invoices

export function generateInvoiceNumber(): string {
  const year = new Date().getFullYear();
  const paddedNumber = String(invoiceCounter++).padStart(4, '0');
  return `GRIHA-${year}-${paddedNumber}`;
}

export function calculateSubtotal(selectedMilestones: Map<string, MilestoneInvoiceItem>): number {
  return Array.from(selectedMilestones.values()).reduce(
    (sum, item) => sum + item.editableAmount,
    0
  );
}

export function calculateDiscount(
  subtotal: number,
  discountType: 'percentage' | 'flat',
  discountValue: number
): number {
  if (discountType === 'percentage') {
    return (subtotal * discountValue) / 100;
  }
  return discountValue;
}

export function calculateMilestoneInvoicingStatus(
  milestone: Milestone,
  invoices: Invoice[]
): { status: InvoicingStatus; totalBilled: number; remainingAmount: number } {
  // Filter finalized invoices (exclude drafts)
  const relevantInvoices = invoices.filter(
    inv => inv.status !== 'draft' &&
    inv.milestoneItems.some(item => item.milestoneId === milestone.id)
  );

  // Sum total billed for this milestone
  const totalBilled = relevantInvoices.reduce((sum, invoice) => {
    const item = invoice.milestoneItems.find(i => i.milestoneId === milestone.id);
    return sum + (item?.editableAmount || 0);
  }, 0);

  const milestoneTotal = milestone.totalAmount || 0;
  const remainingAmount = Math.max(0, milestoneTotal - totalBilled);

  let status: InvoicingStatus;
  if (totalBilled === 0) {
    status = 'not_invoiced';
  } else if (totalBilled >= milestoneTotal) {
    status = 'fully_invoiced';
  } else {
    status = 'partially_invoiced';
  }

  return { status, totalBilled, remainingAmount };
}

export function getInvoiceStatusBadgeVariant(status: InvoiceStatus): string {
  switch (status) {
    case 'draft':
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30 dark:bg-gray-500/20 dark:text-gray-400 dark:border-gray-500/30';
    case 'sent':
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/30';
    case 'paid':
      return 'bg-green-500/20 text-green-400 border-green-500/30 dark:bg-green-500/20 dark:text-green-400 dark:border-green-500/30';
    default:
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
}

export function getInvoicingStatusBadgeColor(status: InvoicingStatus): string {
  switch (status) {
    case 'not_invoiced':
      return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-700';
    case 'partially_invoiced':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-700';
    case 'fully_invoiced':
      return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

// ==================== REDUCER ====================

export function invoiceFormReducer(
  state: InvoiceFormState,
  action: InvoiceFormAction
): InvoiceFormState {
  switch (action.type) {
    case 'SET_INVOICE_DATE':
      return {
        ...state,
        invoiceDate: action.payload,
      };

    case 'SET_INVOICE_REFERENCE':
      return {
        ...state,
        invoiceReference: action.payload,
      };

    case 'SET_NOTES':
      return {
        ...state,
        notes: action.payload,
      };

    case 'TOGGLE_MILESTONE': {
      const { milestoneId, milestone } = action.payload;
      const newSelectedMilestones = new Map(state.selectedMilestones);

      if (newSelectedMilestones.has(milestoneId)) {
        // Remove milestone
        newSelectedMilestones.delete(milestoneId);
      } else {
        // Add milestone with pre-populated data
        const primaryScope = milestone.scopeOfWork[0];
        const newItem: MilestoneInvoiceItem = {
          id: `mi-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          milestoneId: milestone.id,
          milestoneTitle: milestone.title,
          milestoneStageNumber: milestone.stageNumber,
          rateType: primaryScope?.rateType || RateType.FIXED,
          rate: primaryScope?.rate || milestone.totalAmount || 0,
          quantity: primaryScope?.quantity || 1,
          calculatedAmount: primaryScope?.amount || milestone.totalAmount || 0,
          editableAmount: primaryScope?.amount || milestone.totalAmount || 0,
        };
        newSelectedMilestones.set(milestoneId, newItem);
      }

      const newSubtotal = calculateSubtotal(newSelectedMilestones);
      const newDiscountAmount = calculateDiscount(newSubtotal, state.discountType, state.discountValue);
      const newNetTotal = Math.max(0, newSubtotal - newDiscountAmount);
      const newBalance = Math.max(0, newNetTotal - state.paidAmount);

      return {
        ...state,
        selectedMilestones: newSelectedMilestones,
        subtotal: newSubtotal,
        discountAmount: newDiscountAmount,
        netTotal: newNetTotal,
        balance: newBalance,
      };
    }

    case 'UPDATE_MILESTONE_RATE': {
      const { milestoneId, rateType, rate, quantity } = action.payload;
      const newSelectedMilestones = new Map(state.selectedMilestones);
      const item = newSelectedMilestones.get(milestoneId);

      if (item) {
        const calculatedAmount = rateType === 'fixed' ? rate : rate * quantity;
        newSelectedMilestones.set(milestoneId, {
          ...item,
          rateType: rateType as 'per_sqft' | 'per_visit' | 'fixed',
          rate,
          quantity,
          calculatedAmount,
          editableAmount: calculatedAmount,
        });

        const newSubtotal = calculateSubtotal(newSelectedMilestones);
        const newDiscountAmount = calculateDiscount(newSubtotal, state.discountType, state.discountValue);
        const newNetTotal = Math.max(0, newSubtotal - newDiscountAmount);
        const newBalance = Math.max(0, newNetTotal - state.paidAmount);

        return {
          ...state,
          selectedMilestones: newSelectedMilestones,
          subtotal: newSubtotal,
          discountAmount: newDiscountAmount,
          netTotal: newNetTotal,
          balance: newBalance,
        };
      }
      return state;
    }

    case 'UPDATE_MILESTONE_AMOUNT': {
      const { milestoneId, amount } = action.payload;
      const newSelectedMilestones = new Map(state.selectedMilestones);
      const item = newSelectedMilestones.get(milestoneId);

      if (item) {
        newSelectedMilestones.set(milestoneId, {
          ...item,
          editableAmount: amount,
        });

        const newSubtotal = calculateSubtotal(newSelectedMilestones);
        const newDiscountAmount = calculateDiscount(newSubtotal, state.discountType, state.discountValue);
        const newNetTotal = Math.max(0, newSubtotal - newDiscountAmount);
        const newBalance = Math.max(0, newNetTotal - state.paidAmount);

        return {
          ...state,
          selectedMilestones: newSelectedMilestones,
          subtotal: newSubtotal,
          discountAmount: newDiscountAmount,
          netTotal: newNetTotal,
          balance: newBalance,
        };
      }
      return state;
    }

    case 'SET_DISCOUNT': {
      const { type, value } = action.payload;
      const newDiscountAmount = calculateDiscount(state.subtotal, type, value);
      const newNetTotal = Math.max(0, state.subtotal - newDiscountAmount);
      const newBalance = Math.max(0, newNetTotal - state.paidAmount);

      return {
        ...state,
        discountType: type,
        discountValue: value,
        discountAmount: newDiscountAmount,
        netTotal: newNetTotal,
        balance: newBalance,
      };
    }

    case 'SET_PAID_AMOUNT': {
      const newBalance = Math.max(0, state.netTotal - action.payload);
      return {
        ...state,
        paidAmount: action.payload,
        balance: newBalance,
      };
    }

    case 'RESET_FORM':
      return {
        ...initialInvoiceFormState,
        invoiceReference: generateInvoiceNumber(),
      };

    case 'LOAD_DRAFT': {
      const invoice = action.payload as Invoice & { milestoneItems?: MilestoneInvoiceItem[] };
      const selectedMilestones = new Map<string, MilestoneInvoiceItem>();

      if (invoice.milestoneItems) {
        invoice.milestoneItems.forEach(item => {
          const milestoneItem: MilestoneInvoiceItem = {
            id: item.id || `mi-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            milestoneId: item.milestoneId,
            milestoneTitle: item.milestoneTitle,
            milestoneStageNumber: item.milestoneStageNumber,
            rateType: item.rateType,
            rate: item.rate,
            quantity: item.quantity,
            calculatedAmount: item.calculatedAmount,
            editableAmount: item.editableAmount,
          };
          selectedMilestones.set(item.milestoneId, milestoneItem);
        });
      }

      return {
        invoiceDate: typeof invoice.invoiceDate === 'string'
          ? invoice.invoiceDate.split('T')[0]
          : new Date(invoice.invoiceDate).toISOString().split('T')[0],
        invoiceReference: invoice.invoiceNumber,
        notes: invoice.notes || '',
        selectedMilestones,
        subtotal: invoice.subtotal,
        discountType: invoice.discountType,
        discountValue: invoice.discountValue,
        discountAmount: invoice.discountAmount,
        netTotal: invoice.netTotal,
        paidAmount: invoice.paidAmount,
        balance: invoice.balance,
      };
    }

    default:
      return state;
  }
}

export const initialInvoiceFormState: InvoiceFormState = {
  invoiceDate: new Date().toISOString().split('T')[0],
  invoiceReference: 'GRIHA-2026-0001',
  notes: '',
  selectedMilestones: new Map(),
  subtotal: 0,
  discountType: 'percentage',
  discountValue: 0,
  discountAmount: 0,
  netTotal: 0,
  paidAmount: 0,
  balance: 0,
};

// ==================== MOCK DATA ====================

export const mockInvoices: Invoice[] = [
  {
    id: 'inv-001',
    invoiceNumber: 'GRIHA-2026-0001',
    invoiceDate: '2026-01-15',
    notes: 'Initial stage payment for site analysis and concept design',
    milestoneItems: [
      {
        id: 'mi-001-1',
        milestoneId: 'milestone-001',
        milestoneTitle: 'Site Analysis & Survey',
        milestoneStageNumber: 1,
        rateType: 'per_sqft',
        rate: 5,
        quantity: 2500,
        calculatedAmount: 14750,
        editableAmount: 14750,
      },
      {
        id: 'mi-001-2',
        milestoneId: 'milestone-002',
        milestoneTitle: 'Concept Design',
        milestoneStageNumber: 2,
        rateType: 'fixed',
        rate: 29500,
        quantity: 1,
        calculatedAmount: 29500,
        editableAmount: 29500,
      },
    ],
    subtotal: 44250,
    discountType: 'percentage',
    discountValue: 5,
    discountAmount: 2212.5,
    netTotal: 42037.5,
    paidAmount: 42037.5,
    balance: 0,
    status: 'paid',
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-01-20T14:30:00Z',
    createdBy: 'Admin User',
  },
  {
    id: 'inv-002',
    invoiceNumber: 'GRIHA-2026-0002',
    invoiceDate: '2026-01-28',
    notes: 'Design development and working drawings phase',
    milestoneItems: [
      {
        id: 'mi-002-1',
        milestoneId: 'milestone-003',
        milestoneTitle: 'Design Development',
        milestoneStageNumber: 3,
        rateType: 'per_visit',
        rate: 4500,
        quantity: 3,
        calculatedAmount: 13500,
        editableAmount: 13500,
      },
    ],
    subtotal: 13500,
    discountType: 'flat',
    discountValue: 500,
    discountAmount: 500,
    netTotal: 13000,
    paidAmount: 6500,
    balance: 6500,
    status: 'sent',
    createdAt: '2026-01-28T14:30:00Z',
    updatedAt: '2026-01-28T14:30:00Z',
    createdBy: 'Admin User',
  },
];
