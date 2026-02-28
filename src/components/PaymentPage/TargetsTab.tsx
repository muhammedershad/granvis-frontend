import { Target } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Progress } from "../ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

interface PaymentTarget {
  id: string;
  title: string;
  target: number;
  current: number;
  deadline: string;
  category: "quarterly" | "monthly" | "annual" | "receivables";
}

const paymentTargets: PaymentTarget[] = [
  {
    id: "1",
    title: "Q4 2024 Revenue",
    target: 2500000,
    current: 2150000,
    deadline: "2024-12-31",
    category: "quarterly",
  },
  {
    id: "2",
    title: "December Collections",
    target: 850000,
    current: 650000,
    deadline: "2024-12-31",
    category: "monthly",
  },
  {
    id: "3",
    title: "Annual Goal 2024",
    target: 8500000,
    current: 7800000,
    deadline: "2024-12-31",
    category: "annual",
  },
  {
    id: "4",
    title: "Outstanding Receivables",
    target: 150000,
    current: 185000,
    deadline: "2024-12-31",
    category: "receivables",
  },
];

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

const getTargetProgress = (target: PaymentTarget) => {
  if (target.category === "receivables") {
    return Math.min(100, (target.current / target.target) * 100);
  }
  return (target.current / target.target) * 100;
};

const getTargetStatus = (target: PaymentTarget) => {
  const progress = getTargetProgress(target);
  if (target.category === "receivables") {
    return progress > 100 ? "warning" : "good";
  }
  if (progress >= 90) {
    return "good";
  }
  if (progress >= 70) {
    return "warning";
  }
  return "poor";
};

const getStatusBadgeClass = (status: string) => {
  if (status === "good") {
    return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800";
  }
  if (status === "warning") {
    return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800";
  }
  return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800";
};

export function TargetsTab() {
  return (
    <>
      {/* Target Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {paymentTargets.map((target) => {
          const progress = getTargetProgress(target);
          const status = getTargetStatus(target);

          return (
            <Card
              key={target.id}
              className="backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 relative overflow-hidden shadow-xl shadow-gray-200/50 dark:shadow-black/50"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 via-indigo-50/40 to-purple-50/60 opacity-100 dark:opacity-0 transition-opacity duration-300"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 dark:opacity-100 transition-opacity duration-300"></div>
              <CardContent className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-foreground">
                    {target.title}
                  </h3>
                  <Badge className={getStatusBadgeClass(status)}>
                    {status}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Current</span>
                    <span className="text-foreground">
                      {formatCurrency(target.current)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Target</span>
                    <span className="text-foreground">
                      {formatCurrency(target.target)}
                    </span>
                  </div>
                  <Progress
                    value={Math.min(100, progress)}
                    className={`h-2 ${target.category === "receivables" && progress > 100 ? "bg-red-500/20" : ""}`}
                  />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="text-foreground">
                      {progress.toFixed(1)}%
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Due: {target.deadline}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Create New Target */}
      <Card className="backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 relative overflow-hidden shadow-xl shadow-gray-200/50 dark:shadow-black/50">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/60 via-indigo-50/40 to-blue-50/60 opacity-100 dark:opacity-0 transition-opacity duration-300"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 dark:opacity-100 transition-opacity duration-300"></div>
        <CardHeader className="relative">
          <CardTitle className="text-foreground">Set New Target</CardTitle>
          <CardDescription>
            Create financial goals and track performance
          </CardDescription>
        </CardHeader>
        <CardContent className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="targetTitle">Target Title</Label>
              <Input id="targetTitle" placeholder="e.g., Q1 2025 Revenue" />
            </div>
            <div>
              <Label htmlFor="targetAmount">Target Amount</Label>
              <Input id="targetAmount" type="number" placeholder="0.00" />
            </div>
            <div>
              <Label htmlFor="targetDeadline">Deadline</Label>
              <Input id="targetDeadline" type="date" />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg">
              <Target className="w-4 h-4 mr-2" />
              Create Target
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
