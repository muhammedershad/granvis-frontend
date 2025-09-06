import { useState } from "react";
import { TrendingUp, TrendingDown, DollarSign, Clock, Users, Target, Calendar, CheckCircle, AlertCircle, BarChart3 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, RadialBarChart, RadialBar } from 'recharts';

// Mock statistics data
const kpiData = {
  totalRevenue: {
    current: 8500000,
    previous: 7200000,
    change: 18.1,
    trend: "up"
  },
  averageInvoiceValue: {
    current: 85000,
    previous: 78000,
    change: 9.0,
    trend: "up"
  },
  paymentCycleTime: {
    current: 24,
    previous: 28,
    change: -14.3,
    trend: "down"
  },
  collectionRate: {
    current: 94.5,
    previous: 91.2,
    change: 3.6,
    trend: "up"
  },
  overdueRate: {
    current: 5.5,
    previous: 8.8,
    change: -37.5,
    trend: "down"
  },
  disputeRate: {
    current: 2.1,
    previous: 3.4,
    change: -38.2,
    trend: "down"
  }
};

const monthlyTrendsData = [
  { month: 'Jan', revenue: 650000, invoices: 24, avgValue: 27083, cycleTime: 32, collectionRate: 89 },
  { month: 'Feb', revenue: 720000, invoices: 28, avgValue: 25714, cycleTime: 30, collectionRate: 91 },
  { month: 'Mar', revenue: 680000, invoices: 22, avgValue: 30909, cycleTime: 28, collectionRate: 93 },
  { month: 'Apr', revenue: 890000, invoices: 31, avgValue: 28710, cycleTime: 26, collectionRate: 94 },
  { month: 'May', revenue: 750000, invoices: 25, avgValue: 30000, cycleTime: 25, collectionRate: 95 },
  { month: 'Jun', revenue: 920000, invoices: 34, avgValue: 27059, cycleTime: 24, collectionRate: 96 },
  { month: 'Jul', revenue: 850000, invoices: 29, avgValue: 29310, cycleTime: 23, collectionRate: 94 },
  { month: 'Aug', revenue: 780000, invoices: 26, avgValue: 30000, cycleTime: 22, collectionRate: 95 },
  { month: 'Sep', revenue: 940000, invoices: 32, avgValue: 29375, cycleTime: 21, collectionRate: 96 },
  { month: 'Oct', revenue: 1050000, invoices: 38, avgValue: 27632, cycleTime: 20, collectionRate: 97 },
  { month: 'Nov', revenue: 980000, invoices: 35, avgValue: 28000, cycleTime: 19, collectionRate: 95 },
  { month: 'Dec', revenue: 820000, invoices: 30, avgValue: 27333, cycleTime: 18, collectionRate: 94 }
];

const projectTypePerformanceData = [
  { type: 'Residential', revenue: 3200000, invoices: 89, avgCycle: 22, collectionRate: 96 },
  { type: 'Commercial', revenue: 2800000, invoices: 67, avgCycle: 28, collectionRate: 92 },
  { type: 'Mixed-Use', revenue: 1900000, invoices: 45, avgCycle: 25, collectionRate: 94 },
  { type: 'Hospitality', revenue: 600000, invoices: 18, avgCycle: 30, collectionRate: 88 }
];

const paymentTimingData = [
  { period: 'On Time', count: 245, percentage: 78.5, color: '#10b981' },
  { period: '1-7 Days Late', count: 42, percentage: 13.5, color: '#f59e0b' },
  { period: '8-30 Days Late', count: 18, percentage: 5.8, color: '#ef4444' },
  { period: '30+ Days Late', count: 7, percentage: 2.2, color: '#7c2d12' }
];

const clientSegmentData = [
  { segment: 'Enterprise', revenue: 4200000, avgInvoice: 125000, count: 34, cycleTime: 18 },
  { segment: 'Mid-Market', revenue: 2800000, avgInvoice: 75000, count: 37, cycleTime: 22 },
  { segment: 'Small Business', revenue: 1500000, avgInvoice: 35000, count: 43, cycleTime: 28 }
];

const seasonalTrendsData = [
  { quarter: 'Q1', revenue: 2050000, invoices: 74, disputes: 8, satisfaction: 4.2 },
  { quarter: 'Q2', revenue: 2560000, invoices: 90, disputes: 5, satisfaction: 4.5 },
  { quarter: 'Q3', revenue: 2570000, invoices: 87, disputes: 4, satisfaction: 4.6 },
  { quarter: 'Q4', revenue: 2850000, invoices: 98, disputes: 3, satisfaction: 4.7 }
];

const collectionEfficiencyData = [
  { name: 'Collected', value: 94.5, color: '#10b981' },
  { name: 'Outstanding', value: 5.5, color: '#ef4444' }
];

export function PaymentStatistics() {
  const [selectedPeriod, setSelectedPeriod] = useState("last-12-months");
  const [activeStatsTab, setActiveStatsTab] = useState("overview");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getTrendIcon = (trend: string) => {
    return trend === "up" ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />;
  };

  const getTrendColor = (trend: string, isPositive: boolean = true) => {
    if (trend === "up") {
      return isPositive ? "text-green-600" : "text-red-600";
    } else {
      return isPositive ? "text-red-600" : "text-green-600";
    }
  };

  return (
    <div className="space-y-6">
      {/* Period Selection */}
      <div className="flex justify-end">
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="last-30-days">Last 30 Days</SelectItem>
            <SelectItem value="last-3-months">Last 3 Months</SelectItem>
            <SelectItem value="last-6-months">Last 6 Months</SelectItem>
            <SelectItem value="last-12-months">Last 12 Months</SelectItem>
            <SelectItem value="ytd">Year to Date</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Statistics Tabs */}
      <Tabs value={activeStatsTab} onValueChange={setActiveStatsTab}>
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 gap-1">
          <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
          <TabsTrigger value="trends" className="text-xs sm:text-sm">Trends</TabsTrigger>
          <TabsTrigger value="performance" className="text-xs sm:text-sm">Performance</TabsTrigger>
          <TabsTrigger value="insights" className="text-xs sm:text-sm">Insights</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Key Performance Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="relative bg-gradient-to-br from-white/50 to-green-50/50 dark:from-gray-900/50 dark:to-green-900/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg shadow-green-500/5 dark:shadow-green-500/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl text-foreground">{formatCurrency(kpiData.totalRevenue.current)}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-500" />
                </div>
                <div className={`mt-4 flex items-center text-sm ${getTrendColor(kpiData.totalRevenue.trend)}`}>
                  {getTrendIcon(kpiData.totalRevenue.trend)}
                  <span className="ml-1">{formatPercentage(kpiData.totalRevenue.change)} vs previous period</span>
                </div>
              </CardContent>
            </Card>

            <Card className="relative bg-gradient-to-br from-white/50 to-blue-50/50 dark:from-gray-900/50 dark:to-blue-900/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg shadow-blue-500/5 dark:shadow-blue-500/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Invoice Value</p>
                    <p className="text-2xl text-foreground">{formatCurrency(kpiData.averageInvoiceValue.current)}</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-blue-500" />
                </div>
                <div className={`mt-4 flex items-center text-sm ${getTrendColor(kpiData.averageInvoiceValue.trend)}`}>
                  {getTrendIcon(kpiData.averageInvoiceValue.trend)}
                  <span className="ml-1">{formatPercentage(kpiData.averageInvoiceValue.change)} vs previous period</span>
                </div>
              </CardContent>
            </Card>

            <Card className="relative bg-gradient-to-br from-white/50 to-purple-50/50 dark:from-gray-900/50 dark:to-purple-900/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg shadow-purple-500/5 dark:shadow-purple-500/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Payment Cycle Time</p>
                    <p className="text-2xl text-foreground">{kpiData.paymentCycleTime.current} days</p>
                  </div>
                  <Clock className="w-8 h-8 text-purple-500" />
                </div>
                <div className={`mt-4 flex items-center text-sm ${getTrendColor(kpiData.paymentCycleTime.trend, false)}`}>
                  {getTrendIcon(kpiData.paymentCycleTime.trend)}
                  <span className="ml-1">{formatPercentage(Math.abs(kpiData.paymentCycleTime.change))} vs previous period</span>
                </div>
              </CardContent>
            </Card>

            <Card className="relative bg-gradient-to-br from-white/50 to-cyan-50/50 dark:from-gray-900/50 dark:to-cyan-900/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg shadow-cyan-500/5 dark:shadow-cyan-500/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Collection Rate</p>
                    <p className="text-2xl text-foreground">{formatPercentage(kpiData.collectionRate.current)}</p>
                  </div>
                  <Target className="w-8 h-8 text-cyan-500" />
                </div>
                <div className={`mt-4 flex items-center text-sm ${getTrendColor(kpiData.collectionRate.trend)}`}>
                  {getTrendIcon(kpiData.collectionRate.trend)}
                  <span className="ml-1">{formatPercentage(kpiData.collectionRate.change)} vs previous period</span>
                </div>
              </CardContent>
            </Card>

            <Card className="relative bg-gradient-to-br from-white/50 to-orange-50/50 dark:from-gray-900/50 dark:to-orange-900/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg shadow-orange-500/5 dark:shadow-orange-500/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Overdue Rate</p>
                    <p className="text-2xl text-foreground">{formatPercentage(kpiData.overdueRate.current)}</p>
                  </div>
                  <AlertCircle className="w-8 h-8 text-orange-500" />
                </div>
                <div className={`mt-4 flex items-center text-sm ${getTrendColor(kpiData.overdueRate.trend, false)}`}>
                  {getTrendIcon(kpiData.overdueRate.trend)}
                  <span className="ml-1">{formatPercentage(Math.abs(kpiData.overdueRate.change))} vs previous period</span>
                </div>
              </CardContent>
            </Card>

            <Card className="relative bg-gradient-to-br from-white/50 to-red-50/50 dark:from-gray-900/50 dark:to-red-900/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg shadow-red-500/5 dark:shadow-red-500/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Dispute Rate</p>
                    <p className="text-2xl text-foreground">{formatPercentage(kpiData.disputeRate.current)}</p>
                  </div>
                  <Users className="w-8 h-8 text-red-500" />
                </div>
                <div className={`mt-4 flex items-center text-sm ${getTrendColor(kpiData.disputeRate.trend, false)}`}>
                  {getTrendIcon(kpiData.disputeRate.trend)}
                  <span className="ml-1">{formatPercentage(Math.abs(kpiData.disputeRate.change))} vs previous period</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Collection Efficiency Radial Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="relative bg-gradient-to-br from-white/50 to-gray-50/50 dark:from-gray-900/50 dark:to-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg shadow-gray-500/5 dark:shadow-gray-500/10">
              <CardHeader>
                <CardTitle className="text-foreground">Collection Efficiency</CardTitle>
                <CardDescription>Overall collection performance</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={collectionEfficiencyData}>
                    <RadialBar dataKey="value" cornerRadius={10} fill="#8884d8" />
                    <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-foreground">
                      <tspan fontSize="24" fontWeight="bold">{collectionEfficiencyData[0].value}%</tspan>
                      <tspan x="50%" dy="20" fontSize="14">Collected</tspan>
                    </text>
                  </RadialBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="relative bg-gradient-to-br from-white/50 to-gray-50/50 dark:from-gray-900/50 dark:to-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg shadow-gray-500/5 dark:shadow-gray-500/10">
              <CardHeader>
                <CardTitle className="text-foreground">Payment Timing Distribution</CardTitle>
                <CardDescription>Payment timing analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {paymentTimingData.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-foreground">{item.period}</span>
                        <div className="text-right">
                          <span className="text-foreground">{item.count}</span>
                          <span className="text-sm text-muted-foreground ml-2">({item.percentage}%)</span>
                        </div>
                      </div>
                      <Progress value={item.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-6">
          {/* Monthly Trends Chart */}
          <Card className="relative bg-gradient-to-br from-white/50 to-gray-50/50 dark:from-gray-900/50 dark:to-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg shadow-gray-500/5 dark:shadow-gray-500/10">
            <CardHeader>
              <CardTitle className="text-foreground">Monthly Payment Trends</CardTitle>
              <CardDescription>Revenue and performance metrics over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={monthlyTrendsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis yAxisId="revenue" orientation="left" stroke="#64748b" />
                  <YAxis yAxisId="metrics" orientation="right" stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white'
                    }}
                    formatter={(value, name) => [
                      name === 'revenue' ? formatCurrency(Number(value)) : 
                      name === 'collectionRate' ? formatPercentage(Number(value)) :
                      value,
                      name === 'revenue' ? 'Revenue' :
                      name === 'collectionRate' ? 'Collection Rate' :
                      name === 'cycleTime' ? 'Cycle Time (Days)' :
                      name === 'invoices' ? 'Invoices' : name
                    ]}
                  />
                  <Legend />
                  <Line yAxisId="revenue" type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={3} name="Revenue" />
                  <Line yAxisId="metrics" type="monotone" dataKey="collectionRate" stroke="#06b6d4" strokeWidth={2} name="Collection Rate %" />
                  <Line yAxisId="metrics" type="monotone" dataKey="cycleTime" stroke="#ef4444" strokeWidth={2} name="Cycle Time (Days)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Seasonal Analysis */}
          <Card className="relative bg-gradient-to-br from-white/50 to-gray-50/50 dark:from-gray-900/50 dark:to-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg shadow-gray-500/5 dark:shadow-gray-500/10">
            <CardHeader>
              <CardTitle className="text-foreground">Quarterly Performance</CardTitle>
              <CardDescription>Seasonal trends and patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={seasonalTrendsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="quarter" stroke="#64748b" />
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
                      name === 'revenue' ? 'Revenue' :
                      name === 'invoices' ? 'Invoices' :
                      name === 'disputes' ? 'Disputes' :
                      name === 'satisfaction' ? 'Satisfaction' : name
                    ]}
                  />
                  <Legend />
                  <Bar dataKey="revenue" fill="#8b5cf6" name="Revenue" />
                  <Bar dataKey="invoices" fill="#06b6d4" name="Invoices" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          {/* Project Type Performance */}
          <Card className="relative bg-gradient-to-br from-white/50 to-gray-50/50 dark:from-gray-900/50 dark:to-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg shadow-gray-500/5 dark:shadow-gray-500/10">
            <CardHeader>
              <CardTitle className="text-foreground">Performance by Project Type</CardTitle>
              <CardDescription>Revenue and collection metrics by project category</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={projectTypePerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="type" stroke="#64748b" />
                  <YAxis yAxisId="revenue" orientation="left" stroke="#64748b" />
                  <YAxis yAxisId="metrics" orientation="right" stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white'
                    }}
                    formatter={(value, name) => [
                      name === 'revenue' ? formatCurrency(Number(value)) : 
                      name === 'collectionRate' ? formatPercentage(Number(value)) :
                      value,
                      name === 'revenue' ? 'Revenue' :
                      name === 'collectionRate' ? 'Collection Rate' :
                      name === 'avgCycle' ? 'Avg Cycle (Days)' : name
                    ]}
                  />
                  <Legend />
                  <Bar yAxisId="revenue" dataKey="revenue" fill="#8b5cf6" name="Revenue" />
                  <Bar yAxisId="metrics" dataKey="collectionRate" fill="#06b6d4" name="Collection Rate %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Client Segment Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {clientSegmentData.map((segment, index) => (
              <Card key={index} className="relative bg-gradient-to-br from-white/50 to-gray-50/50 dark:from-gray-900/50 dark:to-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg shadow-gray-500/5 dark:shadow-gray-500/10">
                <CardHeader>
                  <CardTitle className="text-foreground">{segment.segment}</CardTitle>
                  <CardDescription>{segment.count} clients</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Revenue</span>
                      <span className="text-foreground">{formatCurrency(segment.revenue)}</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Avg Invoice</span>
                      <span className="text-foreground">{formatCurrency(segment.avgInvoice)}</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Cycle Time</span>
                      <span className="text-foreground">{segment.cycleTime} days</span>
                    </div>
                    <Progress value={100 - (segment.cycleTime / 40) * 100} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          {/* Key Insights Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="relative bg-gradient-to-br from-white/50 to-green-50/50 dark:from-gray-900/50 dark:to-green-900/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg shadow-green-500/5 dark:shadow-green-500/10">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-foreground">Positive Trends</h3>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Collection rate improved by 3.6% this period</li>
                  <li>• Payment cycle time reduced by 4 days on average</li>
                  <li>• Enterprise segment showing 18% revenue growth</li>
                  <li>• Dispute rate decreased significantly (-38.2%)</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="relative bg-gradient-to-br from-white/50 to-orange-50/50 dark:from-gray-900/50 dark:to-orange-900/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg shadow-orange-500/5 dark:shadow-orange-500/10">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-foreground">Areas for Attention</h3>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Commercial projects have longer payment cycles</li>
                  <li>• Small business segment needs payment follow-up</li>
                  <li>• Q4 typically shows seasonal slowdown</li>
                  <li>• 5.5% of invoices still become overdue</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Recommendations */}
          <Card className="relative bg-gradient-to-br from-white/50 to-blue-50/50 dark:from-gray-900/50 dark:to-blue-900/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg shadow-blue-500/5 dark:shadow-blue-500/10">
            <CardHeader>
              <CardTitle className="text-foreground">Recommendations</CardTitle>
              <CardDescription>Actionable insights to improve payment performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-foreground mb-3">Short-term Actions</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">Implement automated payment reminders for overdue invoices</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">Offer early payment discounts to improve cash flow</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">Review payment terms for commercial projects</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-foreground mb-3">Long-term Strategy</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <Target className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">Develop client-specific payment strategies</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Target className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">Implement predictive analytics for payment forecasting</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Target className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">Expand enterprise client base for stable revenue</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}