import { useState } from "react";
import { Calendar, Download, FileText, Filter, Search, TrendingUp, DollarSign, Users, Target, Clock, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

// Mock report data
const monthlyRevenueData = [
  { month: 'Jan', revenue: 450000, collections: 420000, outstanding: 30000 },
  { month: 'Feb', revenue: 520000, collections: 495000, outstanding: 55000 },
  { month: 'Mar', revenue: 480000, collections: 465000, outstanding: 70000 },
  { month: 'Apr', revenue: 610000, collections: 580000, outstanding: 100000 },
  { month: 'May', revenue: 580000, collections: 545000, outstanding: 135000 },
  { month: 'Jun', revenue: 690000, collections: 650000, outstanding: 175000 },
  { month: 'Jul', revenue: 720000, collections: 685000, outstanding: 210000 },
  { month: 'Aug', revenue: 670000, collections: 640000, outstanding: 240000 },
  { month: 'Sep', revenue: 740000, collections: 710000, outstanding: 270000 },
  { month: 'Oct', revenue: 780000, collections: 745000, outstanding: 305000 },
  { month: 'Nov', revenue: 820000, collections: 785000, outstanding: 340000 },
  { month: 'Dec', revenue: 650000, collections: 620000, outstanding: 370000 }
];

const clientRevenueData = [
  { name: 'Luxury Residential Complex', revenue: 1250000, payments: 8, avgPaymentTime: 15 },
  { name: 'Commercial Office Tower', revenue: 980000, payments: 6, avgPaymentTime: 22 },
  { name: 'Mixed-Use Development', revenue: 850000, payments: 9, avgPaymentTime: 18 },
  { name: 'Sustainable Housing', revenue: 750000, payments: 5, avgPaymentTime: 12 },
  { name: 'Corporate Headquarters', revenue: 1150000, payments: 7, avgPaymentTime: 28 },
  { name: 'Resort Complex', revenue: 680000, payments: 4, avgPaymentTime: 14 }
];

const paymentMethodData = [
  { name: 'Bank Transfer', value: 45, amount: 3600000, color: '#8b5cf6' },
  { name: 'Check', value: 25, amount: 2000000, color: '#06b6d4' },
  { name: 'Wire Transfer', value: 20, amount: 1600000, color: '#10b981' },
  { name: 'ACH Transfer', value: 8, amount: 640000, color: '#f59e0b' },
  { name: 'Credit Card', value: 2, amount: 160000, color: '#ef4444' }
];

const agingReport = [
  { category: 'Current (0-30 days)', amount: 450000, count: 12, percentage: 65 },
  { category: '31-60 days', amount: 150000, count: 8, percentage: 22 },
  { category: '61-90 days', amount: 75000, count: 4, percentage: 11 },
  { category: '90+ days (Overdue)', amount: 15000, count: 2, percentage: 2 }
];

const topClientsByRevenue = [
  { client: 'Luxury Residential Complex', revenue: 1250000, growth: 15.2 },
  { client: 'Corporate Headquarters', revenue: 1150000, growth: 8.7 },
  { client: 'Commercial Office Tower', revenue: 980000, growth: -2.1 },
  { client: 'Mixed-Use Development', revenue: 850000, growth: 22.3 },
  { client: 'Sustainable Housing', revenue: 750000, growth: 12.8 }
];

const predefinedReports = [
  {
    id: 'monthly-summary',
    name: 'Monthly Payment Summary',
    description: 'Comprehensive monthly payment and collection report',
    type: 'summary',
    frequency: 'monthly'
  },
  {
    id: 'client-analysis',
    name: 'Client Payment Analysis',
    description: 'Detailed analysis of client payment patterns',
    type: 'analysis',
    frequency: 'quarterly'
  },
  {
    id: 'aging-report',
    name: 'Accounts Receivable Aging',
    description: 'Outstanding receivables categorized by age',
    type: 'aging',
    frequency: 'weekly'
  },
  {
    id: 'cash-flow',
    name: 'Cash Flow Projection',
    description: 'Projected cash flow based on payment schedules',
    type: 'projection',
    frequency: 'monthly'
  },
  {
    id: 'performance-metrics',
    name: 'Payment Performance Metrics',
    description: 'KPIs and performance indicators for payments',
    type: 'metrics',
    frequency: 'monthly'
  }
];

export function PaymentReports() {
  const [activeReportTab, setActiveReportTab] = useState("overview");
  const [selectedDateRange, setSelectedDateRange] = useState("last-12-months");
  const [selectedReport, setSelectedReport] = useState("");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const totalRevenue = monthlyRevenueData.reduce((sum, month) => sum + month.revenue, 0);
  const totalCollections = monthlyRevenueData.reduce((sum, month) => sum + month.collections, 0);
  const totalOutstanding = monthlyRevenueData[monthlyRevenueData.length - 1].outstanding;
  const collectionRate = ((totalCollections / totalRevenue) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Report Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Label htmlFor="dateRange">Date Range</Label>
          <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
            <SelectTrigger>
              <SelectValue placeholder="Select date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-7-days">Last 7 Days</SelectItem>
              <SelectItem value="last-30-days">Last 30 Days</SelectItem>
              <SelectItem value="last-3-months">Last 3 Months</SelectItem>
              <SelectItem value="last-6-months">Last 6 Months</SelectItem>
              <SelectItem value="last-12-months">Last 12 Months</SelectItem>
              <SelectItem value="ytd">Year to Date</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex-1">
          <Label htmlFor="reportType">Quick Reports</Label>
          <Select value={selectedReport} onValueChange={setSelectedReport}>
            <SelectTrigger>
              <SelectValue placeholder="Select a report" />
            </SelectTrigger>
            <SelectContent>
              {predefinedReports.map((report) => (
                <SelectItem key={report.id} value={report.id}>
                  {report.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-end gap-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg shadow-purple-500/25">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Report Tabs */}
      <Tabs value={activeReportTab} onValueChange={setActiveReportTab}>
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 gap-1">
          <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
          <TabsTrigger value="revenue" className="text-xs sm:text-sm">Revenue</TabsTrigger>
          <TabsTrigger value="clients" className="text-xs sm:text-sm">Clients</TabsTrigger>
          <TabsTrigger value="aging" className="text-xs sm:text-sm">Aging</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="relative bg-gradient-to-br from-white/50 to-green-50/50 dark:from-gray-900/50 dark:to-green-900/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg shadow-green-500/5 dark:shadow-green-500/10">
              <CardContent className="p-6 text-center">
                <DollarSign className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl text-foreground">{formatCurrency(totalRevenue)}</p>
              </CardContent>
            </Card>

            <Card className="relative bg-gradient-to-br from-white/50 to-blue-50/50 dark:from-gray-900/50 dark:to-blue-900/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg shadow-blue-500/5 dark:shadow-blue-500/10">
              <CardContent className="p-6 text-center">
                <CheckCircle className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Collections</p>
                <p className="text-2xl text-foreground">{formatCurrency(totalCollections)}</p>
              </CardContent>
            </Card>

            <Card className="relative bg-gradient-to-br from-white/50 to-yellow-50/50 dark:from-gray-900/50 dark:to-yellow-900/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg shadow-yellow-500/5 dark:shadow-yellow-500/10">
              <CardContent className="p-6 text-center">
                <Clock className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Outstanding</p>
                <p className="text-2xl text-foreground">{formatCurrency(totalOutstanding)}</p>
              </CardContent>
            </Card>

            <Card className="relative bg-gradient-to-br from-white/50 to-purple-50/50 dark:from-gray-900/50 dark:to-purple-900/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg shadow-purple-500/5 dark:shadow-purple-500/10">
              <CardContent className="p-6 text-center">
                <Target className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Collection Rate</p>
                <p className="text-2xl text-foreground">{collectionRate}%</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Reports Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {predefinedReports.map((report) => (
              <Card key={report.id} className="relative bg-gradient-to-br from-white/50 to-gray-50/50 dark:from-gray-900/50 dark:to-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg shadow-gray-500/5 dark:shadow-gray-500/10 hover:shadow-xl transition-all duration-300 cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/25">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-foreground">{report.name}</h3>
                      <Badge variant="outline" className="text-xs mt-1">
                        {report.frequency}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{report.description}</p>
                  <Button variant="outline" size="sm" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Generate Report
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Revenue Tab */}
        <TabsContent value="revenue" className="space-y-6">
          {/* Revenue Trend Chart */}
          <Card className="relative bg-gradient-to-br from-white/50 to-gray-50/50 dark:from-gray-900/50 dark:to-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg shadow-gray-500/5 dark:shadow-gray-500/10">
            <CardHeader>
              <CardTitle className="text-foreground">Revenue & Collections Trend</CardTitle>
              <CardDescription>Monthly revenue vs collections over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={monthlyRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white'
                    }}
                    formatter={(value) => [formatCurrency(Number(value)), '']}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="revenue" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} name="Revenue" />
                  <Area type="monotone" dataKey="collections" stackId="1" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.3} name="Collections" />
                  <Line type="monotone" dataKey="outstanding" stroke="#ef4444" strokeWidth={2} name="Outstanding" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Payment Methods Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="relative bg-gradient-to-br from-white/50 to-gray-50/50 dark:from-gray-900/50 dark:to-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg shadow-gray-500/5 dark:shadow-gray-500/10">
              <CardHeader>
                <CardTitle className="text-foreground">Payment Methods</CardTitle>
                <CardDescription>Distribution by payment method</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={paymentMethodData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {paymentMethodData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, '']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="relative bg-gradient-to-br from-white/50 to-gray-50/50 dark:from-gray-900/50 dark:to-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg shadow-gray-500/5 dark:shadow-gray-500/10">
              <CardHeader>
                <CardTitle className="text-foreground">Payment Methods by Amount</CardTitle>
                <CardDescription>Revenue breakdown by payment method</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {paymentMethodData.map((method, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: method.color }}
                        ></div>
                        <span className="text-foreground">{method.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-foreground">{formatCurrency(method.amount)}</p>
                        <p className="text-sm text-muted-foreground">{method.value}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Clients Tab */}
        <TabsContent value="clients" className="space-y-6">
          {/* Top Clients by Revenue */}
          <Card className="relative bg-gradient-to-br from-white/50 to-gray-50/50 dark:from-gray-900/50 dark:to-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg shadow-gray-500/5 dark:shadow-gray-500/10">
            <CardHeader>
              <CardTitle className="text-foreground">Top Clients by Revenue</CardTitle>
              <CardDescription>Highest revenue generating clients</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topClientsByRevenue.map((client, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/20">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-sm shadow-lg shadow-purple-500/25">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="text-foreground">{client.client}</h4>
                        <p className="text-sm text-muted-foreground">
                          Growth: {client.growth > 0 ? '+' : ''}{client.growth}%
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-foreground">{formatCurrency(client.revenue)}</p>
                      <Badge 
                        className={
                          client.growth > 0 ? "bg-green-500/20 text-green-400 border-green-500/30" : 
                          "bg-red-500/20 text-red-400 border-red-500/30"
                        }
                      >
                        {client.growth > 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingUp className="w-3 h-3 mr-1 rotate-180" />}
                        {Math.abs(client.growth)}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Client Payment Analysis */}
          <Card className="relative bg-gradient-to-br from-white/50 to-gray-50/50 dark:from-gray-900/50 dark:to-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg shadow-gray-500/5 dark:shadow-gray-500/10">
            <CardHeader>
              <CardTitle className="text-foreground">Client Payment Analysis</CardTitle>
              <CardDescription>Revenue and payment behavior by client</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={clientRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} angle={-45} textAnchor="end" height={100} />
                  <YAxis stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white'
                    }}
                    formatter={(value, name) => [
                      name === 'revenue' ? formatCurrency(Number(value)) : value,
                      name === 'revenue' ? 'Revenue' : name === 'payments' ? 'Payments' : 'Avg Days'
                    ]}
                  />
                  <Legend />
                  <Bar dataKey="revenue" fill="#8b5cf6" name="Revenue" />
                  <Bar dataKey="avgPaymentTime" fill="#06b6d4" name="Avg Payment Time (Days)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aging Tab */}
        <TabsContent value="aging" className="space-y-6">
          {/* Aging Report */}
          <Card className="relative bg-gradient-to-br from-white/50 to-gray-50/50 dark:from-gray-900/50 dark:to-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg shadow-gray-500/5 dark:shadow-gray-500/10">
            <CardHeader>
              <CardTitle className="text-foreground">Accounts Receivable Aging</CardTitle>
              <CardDescription>Outstanding receivables by age category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {agingReport.map((category, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-foreground">{category.category}</span>
                      <div className="text-right">
                        <span className="text-foreground">{formatCurrency(category.amount)}</span>
                        <span className="text-sm text-muted-foreground ml-2">({category.count} invoices)</span>
                      </div>
                    </div>
                    <div className="w-full bg-muted/20 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          index === 0 ? 'bg-green-500' :
                          index === 1 ? 'bg-yellow-500' :
                          index === 2 ? 'bg-orange-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${category.percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {category.percentage}% of total outstanding
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}