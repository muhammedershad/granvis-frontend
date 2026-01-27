import { CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getPaymentStatusColor, mockPaymentHistory } from "./utils";

export function PaymentsTabContent() {
  return (
    <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.02] to-green-500/[0.02] dark:from-emerald-400/[0.05] dark:to-green-400/[0.05]"></div>
      <CardHeader className="relative">
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          Payment History
        </CardTitle>
      </CardHeader>
      <CardContent className="relative">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Paid Date</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockPaymentHistory.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="font-medium">
                  {payment.projectName}
                </TableCell>
                <TableCell>${payment.amount.toLocaleString()}</TableCell>
                <TableCell>
                  {new Date(payment.dueDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {payment.paidDate
                    ? new Date(payment.paidDate).toLocaleDateString()
                    : "-"}
                </TableCell>
                <TableCell>{payment.method}</TableCell>
                <TableCell>
                  <Badge className={getPaymentStatusColor(payment.status)}>
                    {payment.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
