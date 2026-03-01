import { useState } from "react";
import { ArrowUpDown, ChevronDown, ChevronRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { formatIndianCurrency } from "@/lib/utils/currency";
import type { ProjectAnalysis } from "./types";

function getCollectionRateColor(rate: number): string {
  if (rate >= 90) {
    return "text-green-600 dark:text-green-400";
  }
  if (rate >= 70) {
    return "text-yellow-600 dark:text-yellow-400";
  }
  return "text-red-600 dark:text-red-400";
}

type SortKey =
  | "projectName"
  | "totalAmount"
  | "paidAmount"
  | "pendingAmount"
  | "paymentCount";

interface ProjectPaymentsProps {
  data: ProjectAnalysis[] | undefined;
  isLoading: boolean;
}

export function ProjectPayments({ data, isLoading }: ProjectPaymentsProps) {
  const [sortKey, setSortKey] = useState<SortKey>("totalAmount");
  const [sortDesc, setSortDesc] = useState(true);
  const [expandedProject, setExpandedProject] = useState<string | null>(null);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDesc(!sortDesc);
    } else {
      setSortKey(key);
      setSortDesc(true);
    }
  };

  const sorted = data
    ? [...data].sort((a, b) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];
        if (typeof aVal === "string" && typeof bVal === "string") {
          return sortDesc ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
        }
        return sortDesc
          ? (bVal as number) - (aVal as number)
          : (aVal as number) - (bVal as number);
      })
    : [];

  const SortButton = ({ label, field }: { label: string; field: SortKey }) => (
    <Button
      variant="ghost"
      size="sm"
      className="h-7 text-xs px-2 text-muted-foreground hover:text-foreground"
      onClick={() => handleSort(field)}
    >
      {label}
      <ArrowUpDown className="w-3 h-3 ml-1" />
    </Button>
  );

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">
        Project-wise Payments
      </h2>
      <Card className="backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 shadow-xl shadow-gray-200/50 dark:shadow-black/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50/60 via-transparent to-emerald-50/60 opacity-100 dark:opacity-0 transition-opacity duration-300" />
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-emerald-500/5 opacity-0 dark:opacity-100 transition-opacity duration-300" />
        <CardHeader className="relative">
          <CardTitle className="text-foreground">
            Project Payment Summary
          </CardTitle>
          <CardDescription>
            Payment breakdown by project with drill-down
          </CardDescription>
        </CardHeader>
        <CardContent className="relative">
          {isLoading && (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          )}
          {!isLoading && sorted.length === 0 && (
            <div className="flex items-center justify-center h-40 text-muted-foreground">
              No project data available
            </div>
          )}
          {!isLoading && sorted.length > 0 && (
            <>
              {/* Header */}
              <div className="hidden md:grid grid-cols-12 gap-2 px-3 pb-2 border-b border-white/10">
                <div className="col-span-4">
                  <SortButton label="Project" field="projectName" />
                </div>
                <div className="col-span-2 text-right">
                  <SortButton label="Total" field="totalAmount" />
                </div>
                <div className="col-span-2 text-right">
                  <SortButton label="Paid" field="paidAmount" />
                </div>
                <div className="col-span-2 text-right">
                  <SortButton label="Pending" field="pendingAmount" />
                </div>
                <div className="col-span-2 text-right">
                  <SortButton label="Count" field="paymentCount" />
                </div>
              </div>

              {/* Rows */}
              <div className="divide-y divide-white/5">
                {sorted.map((project) => {
                  const isExpanded = expandedProject === project.projectId;
                  const collectionRate =
                    project.totalAmount > 0
                      ? (
                          (project.paidAmount / project.totalAmount) *
                          100
                        ).toFixed(1)
                      : "0.0";

                  return (
                    <div key={project.projectId}>
                      <button
                        className="w-full grid grid-cols-1 md:grid-cols-12 gap-2 px-3 py-3 hover:bg-muted/10 transition-colors text-left"
                        onClick={() =>
                          setExpandedProject(
                            isExpanded ? null : project.projectId
                          )
                        }
                      >
                        <div className="col-span-4 flex items-center gap-2 min-w-0">
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                          )}
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {project.projectName}
                            </p>
                            {project.type && (
                              <Badge
                                variant="outline"
                                className="text-[10px] mt-0.5"
                              >
                                {project.type}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="col-span-2 text-right text-sm text-foreground">
                          {formatIndianCurrency(project.totalAmount)}
                        </div>
                        <div className="col-span-2 text-right text-sm text-green-600 dark:text-green-400">
                          {formatIndianCurrency(project.paidAmount)}
                        </div>
                        <div className="col-span-2 text-right text-sm text-yellow-600 dark:text-yellow-400">
                          {formatIndianCurrency(project.pendingAmount)}
                        </div>
                        <div className="col-span-2 text-right text-sm text-muted-foreground">
                          {project.paymentCount}
                        </div>
                      </button>

                      {/* Expanded details */}
                      {isExpanded && (
                        <div className="px-10 pb-3 space-y-2">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div className="p-2 rounded-md bg-muted/10">
                              <p className="text-xs text-muted-foreground">
                                Collection Rate
                              </p>
                              <p
                                className={`text-sm font-medium ${getCollectionRateColor(parseFloat(collectionRate))}`}
                              >
                                {collectionRate}%
                              </p>
                            </div>
                            {project.category && (
                              <div className="p-2 rounded-md bg-muted/10">
                                <p className="text-xs text-muted-foreground">
                                  Category
                                </p>
                                <p className="text-sm text-foreground">
                                  {project.category}
                                </p>
                              </div>
                            )}
                            <div className="p-2 rounded-md bg-muted/10">
                              <p className="text-xs text-muted-foreground">
                                Avg Payment
                              </p>
                              <p className="text-sm text-foreground">
                                {formatIndianCurrency(
                                  project.paymentCount > 0
                                    ? project.totalAmount / project.paymentCount
                                    : 0
                                )}
                              </p>
                            </div>
                          </div>
                          {/* Progress bar */}
                          <div className="space-y-1">
                            <div className="w-full bg-muted/20 rounded-full h-2">
                              <div
                                className="h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
                                style={{
                                  width: `${Math.min(parseFloat(collectionRate), 100)}%`,
                                }}
                              />
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {formatIndianCurrency(project.paidAmount)} of{" "}
                              {formatIndianCurrency(project.totalAmount)}{" "}
                              collected
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
