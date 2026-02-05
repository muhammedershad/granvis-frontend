import { ChevronDown, ChevronRight, AlertTriangle } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../ui/table";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { InvoiceStatusBadge } from "./InvoiceStatusBadge";
import {
  MilestoneInvoiceItem,
  MilestoneWithInvoicing,
} from "./invoiceMockData";
import { Milestone } from "@/types/milestone";

interface MilestoneSelectionTableProps {
  milestones: MilestoneWithInvoicing[];
  selectedMilestones: Map<string, MilestoneInvoiceItem>;
  onToggleMilestone: (milestoneId: string, milestone: Milestone) => void;
  onUpdateRate: (milestoneId: string, data: { rateType: string; rate: number; quantity: number }) => void;
  onUpdateAmount: (milestoneId: string, amount: number) => void;
  expandedMilestones: Set<string>;
  onToggleExpand: (milestoneId: string) => void;
}

const formatCurrency = (amount: number): string => {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)}Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)}L`;
  }
  return `₹${amount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
};

export function MilestoneSelectionTable({
  milestones,
  selectedMilestones,
  onToggleMilestone,
  onUpdateRate,
  onUpdateAmount,
  expandedMilestones,
  onToggleExpand,
}: MilestoneSelectionTableProps) {
  if (milestones.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No milestones available for this project.</p>
      </div>
    );
  }

  // Calculate summary statistics
  const summary = milestones.reduce(
    (acc, milestone) => {
      if (milestone.invoicingStatus === 'not_invoiced') acc.notInvoiced++;
      if (milestone.invoicingStatus === 'partially_invoiced') acc.partiallyInvoiced++;
      if (milestone.invoicingStatus === 'fully_invoiced') acc.fullyInvoiced++;
      return acc;
    },
    { notInvoiced: 0, partiallyInvoiced: 0, fullyInvoiced: 0 }
  );

  return (
    <div className="space-y-3">
      {/* Summary Info */}
      {(summary.partiallyInvoiced > 0 || summary.fullyInvoiced > 0) && (
        <div className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg text-sm">
          <span className="font-medium text-foreground">Invoicing Status:</span>
          <div className="flex items-center gap-4">
            {summary.notInvoiced > 0 && (
              <span className="text-muted-foreground">
                {summary.notInvoiced} Not Invoiced
              </span>
            )}
            {summary.partiallyInvoiced > 0 && (
              <span className="text-yellow-600 dark:text-yellow-400">
                {summary.partiallyInvoiced} Partially Invoiced
              </span>
            )}
            {summary.fullyInvoiced > 0 && (
              <span className="text-green-600 dark:text-green-400">
                {summary.fullyInvoiced} Fully Invoiced
              </span>
            )}
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12"></TableHead>
            <TableHead className="w-12"></TableHead>
            <TableHead>Phase</TableHead>
            <TableHead>Scope of Work</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Previously Billed</TableHead>
            <TableHead className="text-right">Remaining</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {milestones.map((milestone) => {
            const isSelected = selectedMilestones.has(milestone.id);
            const isExpanded = expandedMilestones.has(milestone.id);
            const milestoneItem = selectedMilestones.get(milestone.id);

            return (
              <>
                {/* Main Row */}
                <TableRow
                  key={milestone.id}
                  className={isSelected ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''}
                >
                  <TableCell>
                    <button
                      type="button"
                      onClick={() => isSelected && onToggleExpand(milestone.id)}
                      className={`${
                        isSelected
                          ? 'text-foreground hover:text-foreground/80'
                          : 'text-transparent'
                      } transition-colors`}
                      disabled={!isSelected}
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => onToggleMilestone(milestone.id, milestone)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    Stage {milestone.stageNumber}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">{milestone.title}</p>
                      {milestone.description && (
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {milestone.description}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <InvoiceStatusBadge
                      status={milestone.invoicingStatus}
                      type="milestone"
                    />
                  </TableCell>
                  <TableCell className="text-right font-medium text-muted-foreground">
                    {formatCurrency(milestone.totalBilled)}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {milestone.remainingToBill > 0 ? (
                      <span className="text-orange-600 dark:text-orange-400">
                        {formatCurrency(milestone.remainingToBill)}
                      </span>
                    ) : (
                      <span className="text-green-600 dark:text-green-400">-</span>
                    )}
                  </TableCell>
                </TableRow>

                {/* Expanded Rate Entry Row */}
                {isSelected && isExpanded && milestoneItem && (
                  <TableRow className="bg-blue-50/30 dark:bg-blue-950/10">
                    <TableCell colSpan={7}>
                      <div className="p-4 space-y-4 border-l-4 border-blue-500">
                        <h4 className="font-semibold text-sm text-foreground">
                          Rate & Amount Configuration
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          {/* Rate Type */}
                          <div className="space-y-2">
                            <Label htmlFor={`rateType-${milestone.id}`} className="text-sm">
                              Rate Type
                            </Label>
                            <Select
                              value={milestoneItem.rateType}
                              onValueChange={(value) => {
                                onUpdateRate(milestone.id, {
                                  rateType: value,
                                  rate: milestoneItem.rate,
                                  quantity: milestoneItem.quantity,
                                });
                              }}
                            >
                              <SelectTrigger id={`rateType-${milestone.id}`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="per_sqft">Per SQFT</SelectItem>
                                <SelectItem value="per_visit">Per Visit</SelectItem>
                                <SelectItem value="fixed">Fixed</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Rate */}
                          <div className="space-y-2">
                            <Label htmlFor={`rate-${milestone.id}`} className="text-sm">
                              Rate (₹)
                            </Label>
                            <Input
                              id={`rate-${milestone.id}`}
                              type="number"
                              min="0"
                              step="0.01"
                              value={milestoneItem.rate}
                              onChange={(e) => {
                                onUpdateRate(milestone.id, {
                                  rateType: milestoneItem.rateType,
                                  rate: parseFloat(e.target.value) || 0,
                                  quantity: milestoneItem.quantity,
                                });
                              }}
                              className="text-sm"
                            />
                          </div>

                          {/* Quantity (hidden for Fixed) */}
                          {milestoneItem.rateType !== 'fixed' && (
                            <div className="space-y-2">
                              <Label htmlFor={`quantity-${milestone.id}`} className="text-sm">
                                Quantity
                              </Label>
                              <Input
                                id={`quantity-${milestone.id}`}
                                type="number"
                                min="1"
                                step="1"
                                value={milestoneItem.quantity}
                                onChange={(e) => {
                                  onUpdateRate(milestone.id, {
                                    rateType: milestoneItem.rateType,
                                    rate: milestoneItem.rate,
                                    quantity: parseFloat(e.target.value) || 1,
                                  });
                                }}
                                className="text-sm"
                              />
                            </div>
                          )}

                          {/* Calculated Amount (read-only) */}
                          <div className="space-y-2">
                            <Label className="text-sm">Calculated Amount</Label>
                            <div className="flex items-center h-9 px-3 bg-muted rounded-md border">
                              <span className="text-sm font-medium text-muted-foreground">
                                {formatCurrency(milestoneItem.calculatedAmount)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Editable Amount (Override) */}
                        <div className="max-w-xs space-y-2">
                          <Label htmlFor={`editableAmount-${milestone.id}`} className="text-sm font-medium">
                            Invoice Amount (Override if needed)
                          </Label>
                          <Input
                            id={`editableAmount-${milestone.id}`}
                            type="number"
                            min="0"
                            step="0.01"
                            value={milestoneItem.editableAmount}
                            onChange={(e) => {
                              onUpdateAmount(milestone.id, parseFloat(e.target.value) || 0);
                            }}
                            className="text-sm font-medium"
                          />
                          <p className="text-xs text-muted-foreground">
                            This amount will be used in the invoice. You can override the calculated amount.
                          </p>
                        </div>

                        {/* Warning for Fully Invoiced Milestones */}
                        {milestone.invoicingStatus === 'fully_invoiced' && (
                          <div className="flex items-start gap-2 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
                            <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                            <div className="text-sm text-orange-800 dark:text-orange-200">
                              <p className="font-semibold">Already Fully Invoiced</p>
                              <p className="text-xs mt-1">
                                This milestone has been fully invoiced ({formatCurrency(milestone.totalBilled)}).
                                Creating another invoice may result in overbilling.
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Info for Partially Invoiced Milestones */}
                        {milestone.invoicingStatus === 'partially_invoiced' && (
                          <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                            <AlertTriangle className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                            <div className="text-sm text-blue-800 dark:text-blue-200">
                              <p className="font-semibold">Partially Invoiced</p>
                              <p className="text-xs mt-1">
                                Previously billed: {formatCurrency(milestone.totalBilled)} |
                                Remaining: {formatCurrency(milestone.remainingToBill)}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </>
            );
          })}
        </TableBody>
      </Table>
      </div>
    </div>
  );
}
