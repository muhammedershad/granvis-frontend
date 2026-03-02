// ─── Query Params ───────────────────────────────────────────────────

export interface DashboardQueryParams {
  startDate?: string;
  endDate?: string;
}

// ─── Admin / Super Admin Dashboard ──────────────────────────────────

export interface AdminDashboardData {
  employees: {
    total: number;
    active: number;
    inactive: number;
    onLeave: number;
    terminated: number;
    byDepartment: Record<string, number>;
    byRole: Record<string, number>;
    byEmploymentType: Record<string, number>;
  };
  projects: {
    total: number;
    byStatus: Array<{ _id: string; count: number }>;
    byType: Array<{ _id: string; count: number }>;
    budget: {
      totalBudget: number;
      totalSpent: number;
      averageBudget: number;
    };
  };
  clients: {
    total: number;
    active: number;
    potential: number;
    vip: number;
    totalValue: number;
    byIndustry: Record<string, number>;
    byStatus: Record<string, number>;
  };
  invoices: {
    totalInvoices: number;
    paidCount: number;
    overdueCount: number;
    totalAmount: number;
    paidAmount: number;
    pendingAmount: number;
    overdueAmount: number;
    percentageCompleted: number;
    paidThisMonth: number;
  };
  tasks: {
    total: number;
    byStatus: Record<string, number>;
    overdue: number;
  };
  notifications: {
    total: number;
    unread: number;
    urgent: number;
  };
  recentProjects: Array<{
    id: string;
    name: string;
    status: string;
    type: string;
    progressPercentage: number;
    totalBudget: number;
    client: string;
  }>;
}

// ─── Manager Dashboard ──────────────────────────────────────────────

export interface ManagerDashboardData {
  projects: {
    total: number;
    byStatus: Array<{ _id: string; count: number }>;
    byType: Array<{ _id: string; count: number }>;
    budget: {
      totalBudget: number;
      totalSpent: number;
    };
  };
  clients: {
    total: number;
    active: number;
    totalValue: number;
  };
  tasks: {
    total: number;
    byStatus: Record<string, number>;
    overdue: number;
  };
  recentProjects: Array<{
    id: string;
    name: string;
    status: string;
    type: string;
    progressPercentage: number;
    totalBudget: number;
    spentAmount: number;
    client: string;
    startDate: string;
    endDate?: string;
    teamMemberCount: number;
  }>;
  teamMembers: Array<{
    id: string;
    firstName: string;
    lastName: string;
    role: string;
    department?: string;
    avatar?: string;
  }>;
  notifications: {
    total: number;
    unread: number;
  };
}

// ─── Accountant Dashboard ───────────────────────────────────────────

export interface AccountantDashboardData {
  invoices: {
    totalInvoices: number;
    paidCount: number;
    partiallyPaidCount: number;
    overdueCount: number;
    totalAmount: number;
    paidAmount: number;
    pendingAmount: number;
    overdueAmount: number;
    percentageCompleted: number;
    paidThisMonth: number;
  };
  projects: {
    total: number;
    budget: {
      totalBudget: number;
      totalSpent: number;
    };
  };
  recentPayments: Array<{
    id: string;
    amount: number;
    status: string;
    method?: string;
    invoiceDate: string;
    paidDate?: string;
    projectName?: string;
    clientName?: string;
  }>;
  monthlyPayments: Array<{
    month: string;
    totalAmount: number;
    paidAmount: number;
    pendingAmount: number;
    count: number;
  }>;
  paymentMethodDistribution: Array<{
    method: string;
    count: number;
    totalAmount: number;
  }>;
  paymentTargets: {
    active: number;
    completed: number;
    totalTarget: number;
    totalCurrent: number;
  };
}

// ─── Employee Dashboard ─────────────────────────────────────────────

export interface EmployeeDashboardData {
  myProjects: Array<{
    id: string;
    name: string;
    status: string;
    type: string;
    progressPercentage: number;
    client: string;
    startDate: string;
    endDate?: string;
    role: string;
  }>;
  projectSummary: {
    total: number;
    byStatus: Array<{ _id: string; count: number }>;
  };
  tasks: {
    total: number;
    byStatus: Record<string, number>;
    overdue: number;
    upcoming: number;
  };
  notifications: {
    total: number;
    unread: number;
    urgent: number;
  };
}
