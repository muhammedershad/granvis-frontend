import {
  AlertCircle,
  CheckCircle2,
  Circle,
  Clock,
  CreditCard,
  Eye,
  Loader2,
  XCircle,
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { type Payment, PaymentStatus } from "@/types/payment";

const formatCurrency = (amount: number | undefined) => {
  if (!amount && amount !== 0) {
    return "\u20B90";
  }
  if (amount >= 10000000) {
    return `\u20B9${(amount / 10000000).toFixed(2)}Cr`;
  }
  if (amount >= 100000) {
    return `\u20B9${(amount / 100000).toFixed(2)}L`;
  }
  return `\u20B9${amount.toLocaleString("en-IN")}`;
};

const getPaymentStatusColor = (status: string) => {
  switch (status) {
    case PaymentStatus.PAID:
      return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800";
    case PaymentStatus.PENDING:
      return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800";
    case PaymentStatus.OVERDUE:
      return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-800";
  }
};

const getPaymentStatusIcon = (status: string) => {
  switch (status) {
    case PaymentStatus.PAID:
      return (
        <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
      );
    case PaymentStatus.PENDING:
      return <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />;
    case PaymentStatus.OVERDUE:
      return <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />;
    default:
      return <Circle className="w-4 h-4 text-gray-600 dark:text-gray-400" />;
  }
};

const getPaymentStatusLabel = (status: string) => {
  switch (status) {
    case PaymentStatus.PAID:
      return "Paid";
    case PaymentStatus.PENDING:
      return "Pending";
    case PaymentStatus.OVERDUE:
      return "Overdue";
    case PaymentStatus.CANCELLED:
      return "Cancelled";
    default:
      return status;
  }
};

const formatDate = (dateStr?: string) => {
  if (!dateStr) {
    return "";
  }
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
};

interface RecentPaymentsListProps {
  payments: Payment[];
  isLoading: boolean;
  isError: boolean;
  onViewAll: () => void;
}

export function RecentPaymentsList({
  payments,
  isLoading,
  isError,
  onViewAll,
}: RecentPaymentsListProps) {
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      );
    }

    if (isError) {
      return (
        <div className="text-center py-8 space-y-2">
          <div className="w-12 h-12 mx-auto bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30 rounded-full flex items-center justify-center">
            <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <p className="text-sm text-muted-foreground">
            Failed to load recent payments
          </p>
        </div>
      );
    }

    if (payments.length === 0) {
      return (
        <div className="text-center py-8 space-y-2">
          <div className="w-12 h-12 mx-auto bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-full flex items-center justify-center">
            <CreditCard className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <p className="text-sm text-muted-foreground">No payments found</p>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {payments.map((payment) => (
          <div
            key={payment.id}
            className="flex items-center justify-between p-3 rounded-xl bg-white/50 dark:bg-white/5 border border-white/30 dark:border-white/10 hover:bg-white/70 dark:hover:bg-white/10 transition-all duration-300"
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/20">
                {getPaymentStatusIcon(payment.status)}
              </div>
              <div>
                <h4 className="text-sm text-foreground font-medium">
                  {payment.client?.name ||
                    payment.client?.companyName ||
                    "Unknown Client"}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {payment.project?.name
                    ? `${payment.project.name} \u00B7 `
                    : ""}
                  {payment.invoiceNumber || formatDate(payment.invoiceDate)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-foreground font-medium">
                {formatCurrency(payment.amount)}
              </p>
              <Badge className={getPaymentStatusColor(payment.status)}>
                {getPaymentStatusLabel(payment.status)}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 relative overflow-hidden shadow-xl shadow-gray-200/50 dark:shadow-black/50">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 via-indigo-50/40 to-purple-50/60 opacity-100 dark:opacity-0 transition-opacity duration-300"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 dark:opacity-100 transition-opacity duration-300"></div>
      <CardHeader className="relative pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground">Recent Payments</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={onViewAll}
            className="bg-background/50 hover:bg-muted/50"
          >
            <Eye className="w-4 h-4 mr-2" />
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="relative">{renderContent()}</CardContent>
    </Card>
  );
}
