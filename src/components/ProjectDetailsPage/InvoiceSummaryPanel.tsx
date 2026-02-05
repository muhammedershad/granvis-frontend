import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Calculator, Percent, DollarSign } from "lucide-react";

interface InvoiceSummaryPanelProps {
  subtotal: number;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  discountAmount: number;
  netTotal: number;
  paidAmount: number;
  balance: number;
  onSetDiscount: (type: 'percentage' | 'flat', value: number) => void;
  onSetPaidAmount: (amount: number) => void;
}

const formatCurrency = (amount: number): string => {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)}Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)}L`;
  }
  return `₹${amount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
};

export function InvoiceSummaryPanel({
  subtotal,
  discountType,
  discountValue,
  discountAmount,
  netTotal,
  paidAmount,
  balance,
  onSetDiscount,
  onSetPaidAmount,
}: InvoiceSummaryPanelProps) {
  return (
    <div className="sticky top-4">
      <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.02] to-blue-500/[0.02] dark:from-purple-400/[0.05] dark:to-blue-400/[0.05]"></div>
        <CardHeader className="relative">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <Calculator className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <CardTitle className="text-foreground">Invoice Summary</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="relative space-y-4">
          {/* Subtotal */}
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <span className="text-sm font-medium text-foreground">Subtotal</span>
            <span className="text-lg font-semibold text-foreground">
              {formatCurrency(subtotal)}
            </span>
          </div>

          {/* Discount Section */}
          <div className="space-y-3 p-3 bg-muted/30 rounded-lg">
            <Label className="text-sm font-medium text-foreground">Discount</Label>

            {/* Discount Type Toggle */}
            <div className="flex gap-2">
              <Button
                type="button"
                variant={discountType === 'percentage' ? 'default' : 'outline'}
                size="sm"
                className="flex-1"
                onClick={() => onSetDiscount('percentage', discountValue)}
              >
                <Percent className="h-3 w-3 mr-1" />
                %
              </Button>
              <Button
                type="button"
                variant={discountType === 'flat' ? 'default' : 'outline'}
                size="sm"
                className="flex-1"
                onClick={() => onSetDiscount('flat', discountValue)}
              >
                <DollarSign className="h-3 w-3 mr-1" />
                Flat
              </Button>
            </div>

            {/* Discount Value Input */}
            <div className="space-y-1">
              <Input
                type="number"
                min="0"
                max={discountType === 'percentage' ? 100 : undefined}
                step={discountType === 'percentage' ? 1 : 0.01}
                value={discountValue}
                onChange={(e) => onSetDiscount(discountType, parseFloat(e.target.value) || 0)}
                placeholder={discountType === 'percentage' ? 'Percentage' : 'Amount'}
                className="text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Discount: {formatCurrency(discountAmount)}
              </p>
            </div>
          </div>

          {/* Net Total */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg border-2 border-blue-200 dark:border-blue-800">
            <span className="text-sm font-semibold text-foreground">Net Total</span>
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {formatCurrency(netTotal)}
            </span>
          </div>

          {/* Paid Amount */}
          <div className="space-y-2">
            <Label htmlFor="paidAmount" className="text-sm font-medium text-foreground">
              Paid Amount
            </Label>
            <Input
              id="paidAmount"
              type="number"
              min="0"
              max={netTotal}
              step="0.01"
              value={paidAmount}
              onChange={(e) => onSetPaidAmount(parseFloat(e.target.value) || 0)}
              placeholder="Enter paid amount"
              className="text-sm"
            />
          </div>

          {/* Balance */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 rounded-lg border-2 border-orange-200 dark:border-orange-800">
            <span className="text-sm font-semibold text-foreground">Balance</span>
            <span className={`text-2xl font-bold ${
              balance > 0
                ? 'text-orange-600 dark:text-orange-400'
                : 'text-green-600 dark:text-green-400'
            }`}>
              {formatCurrency(balance)}
            </span>
          </div>

          {/* Info Note */}
          <div className="text-xs text-muted-foreground bg-muted/20 p-2 rounded">
            <p className="font-medium mb-1">Note:</p>
            <ul className="list-disc list-inside space-y-0.5">
              <li>Subtotal is auto-calculated from selected milestones</li>
              <li>Balance = Net Total - Paid Amount</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
