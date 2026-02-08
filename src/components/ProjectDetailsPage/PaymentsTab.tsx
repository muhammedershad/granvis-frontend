import {
  CheckCircle,
  Clock,
  CreditCard,
  DollarSign,
  FileText,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { Button } from "../ui/button";
import type { Project } from "@/types/project";

interface PaymentsTabProps {
  project: Project;
  onNavigateToInvoices?: () => void;
}

const formatCurrency = (amount: number | undefined) => {
  if (!amount) {
    return "₹0";
  }
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)}Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)}L`;
  }
  return `₹${amount.toLocaleString("en-IN")}`;
};

export function PaymentsTab({
  project,
  onNavigateToInvoices,
}: PaymentsTabProps) {
  const totalBudget = project.totalBudget || 0;
  const spentAmount = project.spentAmount || 0;
  const remainingBudget = project.remainingBudget || 0;
  const utilization = totalBudget > 0 ? (spentAmount / totalBudget) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header with Generate Invoice Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            Project Payments
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage budget, payments, and generate invoices
          </p>
        </div>
        <Button
          onClick={onNavigateToInvoices}
          className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white shadow-lg shadow-green-500/25"
        >
          <FileText className="w-4 h-4 mr-2" />
          Create Invoice
        </Button>
      </div>
      {/* Budget Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.02] to-purple-500/[0.02] dark:from-blue-400/[0.05] dark:to-purple-400/[0.05]"></div>
          <CardContent className="relative p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <Wallet className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="text-xl text-foreground font-medium">
                  {formatCurrency(totalBudget)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.02] to-green-500/[0.02] dark:from-emerald-400/[0.05] dark:to-green-400/[0.05]"></div>
          <CardContent className="relative p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Paid Amount</p>
                <p className="text-xl text-foreground font-medium">
                  {formatCurrency(spentAmount)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/[0.02] to-orange-500/[0.02] dark:from-yellow-400/[0.05] dark:to-orange-400/[0.05]"></div>
          <CardContent className="relative p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Remaining</p>
                <p className="text-xl text-foreground font-medium">
                  {formatCurrency(remainingBudget)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.02] to-indigo-500/[0.02] dark:from-purple-400/[0.05] dark:to-indigo-400/[0.05]"></div>
          <CardContent className="relative p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Utilization</p>
                <p className="text-xl text-foreground font-medium">
                  {utilization.toFixed(1)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Information Placeholder */}
      <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.02] to-indigo-500/[0.02] dark:from-purple-400/[0.05] dark:to-indigo-400/[0.05]"></div>
        <CardHeader className="relative">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <DollarSign className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <CardTitle className="text-foreground">Payment History</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="relative">
          <div className="text-center py-8">
            <DollarSign className="mx-auto h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-foreground font-medium mb-2">
              No Payment Records
            </h3>
            <p className="text-muted-foreground text-sm">
              Payment records will appear here once transactions are recorded.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
