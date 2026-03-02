"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IndianRupee } from "lucide-react";
import { formatINR } from "./StatCard";
import { format } from "date-fns";

const STATUS_STYLES: Record<string, string> = {
  paid: "bg-green-100/80 dark:bg-green-500/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-500/30",
  pending:
    "bg-yellow-100/80 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-500/30",
  overdue:
    "bg-red-100/80 dark:bg-red-500/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-500/30",
  cancelled:
    "bg-gray-100/80 dark:bg-gray-500/20 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-500/30",
};

const METHOD_LABELS: Record<string, string> = {
  cash: "Cash",
  bank_transfer: "Bank Transfer",
  cheque: "Cheque",
  upi: "UPI",
  neft: "NEFT",
  rtgs: "RTGS",
  other: "Other",
};

interface RecentPaymentsListProps {
  data: Array<{
    id: string;
    amount: number;
    status: string;
    method?: string;
    invoiceDate: string;
    paidDate?: string;
    projectName?: string;
    clientName?: string;
  }>;
}

export function RecentPaymentsList({ data }: RecentPaymentsListProps) {
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <Card className="backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 p-6 relative overflow-hidden shadow-xl dark:shadow-2xl shadow-gray-200/50 dark:shadow-black/50">
      <div className="absolute inset-0 bg-gradient-to-br from-green-50/80 via-emerald-50/60 to-teal-50/80 opacity-100 dark:opacity-0 transition-opacity duration-300" />
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-emerald-500/5 opacity-0 dark:opacity-100 transition-opacity duration-300" />
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">
            Recent Payments
          </h3>
          <Badge
            variant="secondary"
            className="bg-green-100/80 dark:bg-green-500/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-500/30"
          >
            {data.length} payments
          </Badge>
        </div>

        <div className="space-y-3">
          {data.map((payment) => (
            <div
              key={payment.id}
              className="flex items-center gap-3 p-3 rounded-lg bg-white/60 dark:bg-white/5 border border-white/40 dark:border-white/10 hover:shadow-md dark:hover:shadow-black/30 transition-all duration-200"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 dark:from-green-500/30 dark:to-emerald-500/30 flex items-center justify-center border border-green-200/50 dark:border-green-500/20">
                <IndianRupee className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground truncate">
                    {payment.projectName || "Payment"}
                  </p>
                  <span className="text-sm font-bold text-foreground ml-2">
                    {formatINR(payment.amount)}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  {payment.clientName && (
                    <span className="text-xs text-muted-foreground truncate">
                      {payment.clientName}
                    </span>
                  )}
                  {payment.method && (
                    <span className="text-xs text-muted-foreground">
                      {METHOD_LABELS[payment.method] || payment.method}
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground ml-auto">
                    {format(new Date(payment.invoiceDate), "MMM d, yyyy")}
                  </span>
                </div>
              </div>
              <Badge
                variant="outline"
                className={`text-[10px] capitalize shrink-0 ${STATUS_STYLES[payment.status] || ""}`}
              >
                {payment.status}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
