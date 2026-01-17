"use client";

import {
  Calculator,
  CreditCard,
  DollarSign,
  Receipt,
  TrendingUp,
  Wallet,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BudgetChart } from "@/components/BudgetChart";
import { PaymentReports } from "@/components/PaymentReports";
import { CalendarWidget } from "@/components/CalendarWidget";

export const AccountantDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Accountant Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage finances and transactions
          </p>
        </div>
        <Calculator className="w-12 h-12 text-green-500" />
      </div>

      {/* Key Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$89,240</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+15%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Expenses
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,120</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-500">+8%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$44,120</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+22%</span> margin
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Invoices
            </CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">16</div>
            <p className="text-xs text-muted-foreground">$12,450 outstanding</p>
          </CardContent>
        </Card>
      </div>

      {/* Budget Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <BudgetChart />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Latest financial activities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Payment Received</p>
                <p className="text-xs text-muted-foreground">
                  Client ABC - Invoice #1234
                </p>
              </div>
              <span className="text-sm font-semibold text-green-500">
                +$5,200
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-red-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Expense Payment</p>
                <p className="text-xs text-muted-foreground">Office supplies</p>
              </div>
              <span className="text-sm font-semibold text-red-500">-$850</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Payment Received</p>
                <p className="text-xs text-muted-foreground">
                  Client XYZ - Invoice #1235
                </p>
              </div>
              <span className="text-sm font-semibold text-green-500">
                +$3,100
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-red-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Salary Payment</p>
                <p className="text-xs text-muted-foreground">Monthly payroll</p>
              </div>
              <span className="text-sm font-semibold text-red-500">
                -$28,500
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Reports & Calendar */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <PaymentReports />
        <CalendarWidget />
      </div>
    </div>
  );
};
