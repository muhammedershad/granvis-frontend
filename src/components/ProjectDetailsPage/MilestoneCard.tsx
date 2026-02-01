"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import {
  GripVertical,
  Pencil,
  Trash2,
  TrendingUp,
  DollarSign,
  Calendar,
  CheckCircle2,
  Clock,
  Circle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { Separator } from "../ui/separator";
import { getAuthDetails, IAuthRoles } from "@/store/slices/authSlice";
import { Milestone, MilestoneStatus, MilestonePaymentStatus } from "@/types/milestone";
import { formatDate } from "./utils";

interface MilestoneCardProps {
  milestone: Milestone;
  onEdit: (milestone: Milestone) => void;
  onDelete: (milestone: Milestone) => void;
  onUpdateProgress: (milestone: Milestone) => void;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent, milestoneId: string) => void;
  onDragOver?: (e: React.DragEvent, milestoneId: string) => void;
  onDrop?: (e: React.DragEvent, milestoneId: string) => void;
  isDragging?: boolean;
  isDragOver?: boolean;
}

const formatCurrency = (amount: number): string => {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)}Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)}L`;
  }
  return `₹${amount.toLocaleString("en-IN")}`;
};

const getStatusColor = (status: MilestoneStatus) => {
  switch (status) {
    case MilestoneStatus.COMPLETED:
      return "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800";
    case MilestoneStatus.IN_PROGRESS:
      return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800";
    case MilestoneStatus.NOT_STARTED:
      return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-800";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-800";
  }
};

const getPaymentStatusColor = (status: MilestonePaymentStatus) => {
  switch (status) {
    case MilestonePaymentStatus.PAID:
      return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800";
    case MilestonePaymentStatus.PARTIALLY_PAID:
      return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800";
    case MilestonePaymentStatus.UNPAID:
      return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-800";
  }
};

const getStatusIcon = (status: MilestoneStatus) => {
  switch (status) {
    case MilestoneStatus.COMPLETED:
      return <CheckCircle2 className="h-3.5 w-3.5" />;
    case MilestoneStatus.IN_PROGRESS:
      return <Clock className="h-3.5 w-3.5" />;
    case MilestoneStatus.NOT_STARTED:
      return <Circle className="h-3.5 w-3.5" />;
    default:
      return <Circle className="h-3.5 w-3.5" />;
  }
};

const formatStatus = (status: MilestoneStatus) => {
  switch (status) {
    case MilestoneStatus.NOT_STARTED:
      return "Not Started";
    case MilestoneStatus.IN_PROGRESS:
      return "In Progress";
    case MilestoneStatus.COMPLETED:
      return "Completed";
    default:
      return status;
  }
};

const formatPaymentStatus = (status: MilestonePaymentStatus) => {
  switch (status) {
    case MilestonePaymentStatus.UNPAID:
      return "Unpaid";
    case MilestonePaymentStatus.PARTIALLY_PAID:
      return "Partially Paid";
    case MilestonePaymentStatus.PAID:
      return "Paid";
    default:
      return status;
  }
};

export function MilestoneCard({
  milestone,
  onEdit,
  onDelete,
  onUpdateProgress,
  draggable = false,
  onDragStart,
  onDragOver,
  onDrop,
  isDragging = false,
  isDragOver = false,
}: MilestoneCardProps) {
  const { user } = useSelector(getAuthDetails);
  const [showScopeOfWork, setShowScopeOfWork] = useState(false);

  const canEdit = user?.role && [
    IAuthRoles.SUPER_ADMIN,
    IAuthRoles.ADMIN,
    IAuthRoles.MANAGER,
  ].includes(user.role);

  const canDelete = user?.role && [
    IAuthRoles.SUPER_ADMIN,
    IAuthRoles.ADMIN,
  ].includes(user.role);

  return (
    <Card
      className={`relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50 transition-all duration-200 ${
        isDragging ? "opacity-50" : ""
      } ${
        isDragOver ? "border-purple-500 border-2" : ""
      } hover:shadow-md`}
      draggable={draggable && canEdit}
      onDragStart={(e) => onDragStart?.(e, milestone.id)}
      onDragOver={(e) => onDragOver?.(e, milestone.id)}
      onDrop={(e) => onDrop?.(e, milestone.id)}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.02] to-purple-500/[0.02] dark:from-blue-400/[0.05] dark:to-purple-400/[0.05]"></div>

      <CardHeader className="relative pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {draggable && canEdit && (
              <div className="cursor-grab active:cursor-grabbing mt-1 text-muted-foreground hover:text-foreground transition-colors">
                <GripVertical className="h-5 w-5" />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <Badge
                  variant="outline"
                  className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border-purple-300/50 text-purple-700 dark:text-purple-300 font-semibold"
                >
                  Stage {milestone.stageNumber}
                </Badge>

                <Badge variant="outline" className={getStatusColor(milestone.status)}>
                  <span className="flex items-center gap-1">
                    {getStatusIcon(milestone.status)}
                    {formatStatus(milestone.status)}
                  </span>
                </Badge>

                <Badge variant="outline" className={getPaymentStatusColor(milestone.paymentStatus)}>
                  <DollarSign className="h-3 w-3 mr-1" />
                  {formatPaymentStatus(milestone.paymentStatus)}
                </Badge>
              </div>

              <CardTitle className="text-lg font-semibold mb-1">
                {milestone.title}
              </CardTitle>

              {milestone.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {milestone.description}
                </p>
              )}
            </div>
          </div>

          {canEdit && (
            <div className="flex items-center gap-1 flex-shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onEdit(milestone)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              {canDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                  onClick={() => onDelete(milestone)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="relative space-y-4">
        {/* Progress Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span>Progress</span>
            </div>
            <span className="font-semibold text-foreground">
              {milestone.progressPercentage}%
            </span>
          </div>
          <Progress value={milestone.progressPercentage} className="h-2" />
          {canEdit && (
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs"
              onClick={() => onUpdateProgress(milestone)}
            >
              Update Progress
            </Button>
          )}
        </div>

        <Separator />

        {/* Financial Summary */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Total Amount</p>
            <p className="text-sm font-semibold text-foreground">
              {formatCurrency(milestone.totalAmount)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Paid Amount</p>
            <p className="text-sm font-semibold text-green-600 dark:text-green-400">
              {formatCurrency(milestone.paidAmount)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Pending Amount</p>
            <p className="text-sm font-semibold text-amber-600 dark:text-amber-400">
              {formatCurrency(milestone.pendingAmount)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Scope Amount</p>
            <p className="text-sm font-semibold text-foreground">
              {formatCurrency(milestone.scopeAmount)}
            </p>
          </div>
        </div>

        {/* Dates Section */}
        {(milestone.startDate || milestone.dueDate || milestone.completedDate) && (
          <>
            <Separator />
            <div className="space-y-2">
              {milestone.startDate && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Start:</span>
                  <span className="font-medium">{formatDate(milestone.startDate)}</span>
                </div>
              )}
              {milestone.dueDate && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Due:</span>
                  <span className="font-medium">{formatDate(milestone.dueDate)}</span>
                </div>
              )}
              {milestone.completedDate && (
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="text-muted-foreground">Completed:</span>
                  <span className="font-medium">{formatDate(milestone.completedDate)}</span>
                </div>
              )}
            </div>
          </>
        )}

        {/* Scope of Work Section */}
        {milestone.scopeOfWork && milestone.scopeOfWork.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-between p-2 h-auto"
                onClick={() => setShowScopeOfWork(!showScopeOfWork)}
              >
                <span className="text-sm font-medium">
                  Scope of Work ({milestone.scopeOfWork.length} items)
                </span>
                {showScopeOfWork ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>

              {showScopeOfWork && (
                <div className="space-y-2 pt-2">
                  {milestone.scopeOfWork.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start justify-between gap-2 p-2 rounded-md bg-muted/30"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {item.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.rateType === "per_sqft" ? "Per Sq.Ft" : "Fixed"} •
                          ₹{item.rate.toLocaleString("en-IN")}
                          {item.rateType === "per_sqft" ? "/sq.ft" : ""}
                          {item.quantity > 1 && ` × ${item.quantity}`}
                        </p>
                      </div>
                      <div className="text-sm font-semibold text-foreground flex-shrink-0">
                        {formatCurrency(item.amount)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Additional Charges */}
        {milestone.additionalCharges && milestone.additionalCharges.length > 0 && (
          <div className="pt-2">
            <p className="text-xs text-muted-foreground mb-2">
              Additional Charges: {formatCurrency(milestone.additionalChargesAmount)}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
