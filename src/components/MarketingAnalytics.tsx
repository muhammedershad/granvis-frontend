import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { TrendingUp, TrendingDown, Users, Eye, MousePointer, DollarSign } from "lucide-react";

// Mock analytics data
const campaignPerformanceData = [
  { name: 'Q1 Brand Awareness', impressions: 250000, clicks: 12500, conversions: 850, cost: 32500 },
  { name: 'Digital Lead Gen', impressions: 180000, clicks: 9200, conversions: 1150, cost: 15750 },
  { name: 'Social Media', impressions: 320000, clicks: 15600, conversions: 780, cost: 7500 },
  { name: 'Content Marketing', impressions: 95000, clicks: 4800, conversions: 320, cost: 2000 }
];

const monthlyTrendsData = [
  { month: 'Jan', leads: 45, conversions: 12, revenue: 180000 },
  { month: 'Feb', leads: 52, conversions: 15, revenue: 225000 },
  { month: 'Mar', leads: 48, conversions: 18, revenue: 270000 },
  { month: 'Apr', leads: 61, conversions: 22, revenue: 330000 },
  { month: 'May', leads: 58, conversions: 19, revenue: 285000 },
  { month: 'Jun', leads: 69, conversions: 25, revenue: 375000 },
  { month: 'Jul', leads: 74, conversions: 28, revenue: 420000 },
  { month: 'Aug', leads: 67, conversions: 24, revenue: 360000 },
  { month: 'Sep', leads: 72, conversions: 31, revenue: 465000 },
  { month: 'Oct', leads: 78, conversions: 29, revenue: 435000 },
  { month: 'Nov', leads: 83, conversions: 35, revenue: 525000 },
  { month: 'Dec', leads: 89, conversions: 42, revenue: 630000 }
];

const channelDistributionData = [
  { name: 'Website', value: 35, color: '#8b5cf6' },
  { name: 'Social Media', value: 28, color: '#06b6d4' },
  { name: 'Email Marketing', value: 18, color: '#10b981' },
  { name: 'Referrals', value: 12, color: '#f59e0b' },
  { name: 'Paid Ads', value: 7, color: '#ef4444' }
];

const conversionFunnelData = [
  { stage: 'Impressions', value: 845000, percentage: 100 },
  { stage: 'Clicks', value: 42100, percentage: 5.0 },
  { stage: 'Leads', value: 3150, percentage: 7.5 },
  { stage: 'Qualified', value: 1260, percentage: 40.0 },
  { stage: 'Proposals', value: 504, percentage: 40.0 },
  { stage: 'Closed', value: 151, percentage: 30.0 }
];

const topPerformingContent = [
  { title: "Modern Residential Design Trends 2024", views: 15420, engagement: 8.5, leads: 67 },
  { title: "Sustainable Architecture Solutions", views: 12890, engagement: 9.2, leads: 54 },
  { title: "Commercial Space Optimization", views: 11340, engagement: 7.8, leads: 43 },
  { title: "Smart Home Integration Guide", views: 9870, engagement: 8.9, leads: 39 },
  { title: "Cost-Effective Design Strategies", views: 8940, engagement: 7.2, leads: 31 }
];

export function MarketingAnalytics() {
  const totalImpressions = campaignPerformanceData.reduce((sum, item) => sum + item.impressions, 0);
  const totalClicks = campaignPerformanceData.reduce((sum, item) => sum + item.clicks, 0);
  const totalConversions = campaignPerformanceData.reduce((sum, item) => sum + item.conversions, 0);
  const totalCost = campaignPerformanceData.reduce((sum, item) => sum + item.cost, 0);
  
  const ctr = ((totalClicks / totalImpressions) * 100).toFixed(2);
  const conversionRate = ((totalConversions / totalClicks) * 100).toFixed(2);
  const costPerConversion = (totalCost / totalConversions).toFixed(0);

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="relative bg-gradient-to-br from-white/50 to-blue-50/50 dark:from-gray-900/50 dark:to-blue-900/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg shadow-blue-500/5 dark:shadow-blue-500/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Impressions</p>
                <p className="text-2xl text-foreground">{(totalImpressions / 1000).toFixed(0)}K</p>
              </div>
              <Eye className="w-8 h-8 text-blue-500" />
            </div>
            <div className="mt-4 flex items-center text-green-600 text-sm">
              <TrendingUp className="w-4 h-4 mr-1" />
              +12.5% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="relative bg-gradient-to-br from-white/50 to-purple-50/50 dark:from-gray-900/50 dark:to-purple-900/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg shadow-purple-500/5 dark:shadow-purple-500/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Click-Through Rate</p>
                <p className="text-2xl text-foreground">{ctr}%</p>
              </div>
              <MousePointer className="w-8 h-8 text-purple-500" />
            </div>
            <div className="mt-4 flex items-center text-green-600 text-sm">
              <TrendingUp className="w-4 h-4 mr-1" />
              +0.8% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="relative bg-gradient-to-br from-white/50 to-green-50/50 dark:from-gray-900/50 dark:to-green-900/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg shadow-green-500/5 dark:shadow-green-500/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl text-foreground">{conversionRate}%</p>
              </div>
              <Users className="w-8 h-8 text-green-500" />
            </div>
            <div className="mt-4 flex items-center text-red-600 text-sm">
              <TrendingDown className="w-4 h-4 mr-1" />
              -1.2% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="relative bg-gradient-to-br from-white/50 to-cyan-50/50 dark:from-gray-900/50 dark:to-cyan-900/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg shadow-cyan-500/5 dark:shadow-cyan-500/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cost Per Conversion</p>
                <p className="text-2xl text-foreground">${costPerConversion}</p>
              </div>
              <DollarSign className="w-8 h-8 text-cyan-500" />
            </div>
            <div className="mt-4 flex items-center text-green-600 text-sm">
              <TrendingDown className="w-4 h-4 mr-1" />
              -$15 from last month
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Campaign Performance Bar Chart */}
        <Card className="relative bg-gradient-to-br from-white/50 to-gray-50/50 dark:from-gray-900/50 dark:to-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg shadow-gray-500/5 dark:shadow-gray-500/10">
          <CardHeader>
            <CardTitle className="text-foreground">Campaign Performance</CardTitle>
            <CardDescription>Conversions by campaign</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={campaignPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
                <Bar dataKey="conversions" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Lead Source Distribution */}
        <Card className="relative bg-gradient-to-br from-white/50 to-gray-50/50 dark:from-gray-900/50 dark:to-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg shadow-gray-500/5 dark:shadow-gray-500/10">
          <CardHeader>
            <CardTitle className="text-foreground">Lead Sources</CardTitle>
            <CardDescription>Distribution of lead generation channels</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={channelDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {channelDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trends */}
      <Card className="relative bg-gradient-to-br from-white/50 to-gray-50/50 dark:from-gray-900/50 dark:to-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg shadow-gray-500/5 dark:shadow-gray-500/10">
        <CardHeader>
          <CardTitle className="text-foreground">Monthly Performance Trends</CardTitle>
          <CardDescription>Leads, conversions, and revenue over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={monthlyTrendsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis yAxisId="left" stroke="#64748b" />
              <YAxis yAxisId="right" orientation="right" stroke="#64748b" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white'
                }}
              />
              <Legend />
              <Area yAxisId="left" type="monotone" dataKey="leads" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
              <Area yAxisId="left" type="monotone" dataKey="conversions" stackId="1" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.3} />
              <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversion Funnel */}
        <Card className="relative bg-gradient-to-br from-white/50 to-gray-50/50 dark:from-gray-900/50 dark:to-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg shadow-gray-500/5 dark:shadow-gray-500/10">
          <CardHeader>
            <CardTitle className="text-foreground">Conversion Funnel</CardTitle>
            <CardDescription>Marketing to sales conversion stages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {conversionFunnelData.map((stage, index) => (
                <div key={stage.stage} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-foreground">{stage.stage}</span>
                    <div className="text-right">
                      <span className="text-sm text-foreground">{stage.value.toLocaleString()}</span>
                      {index > 0 && (
                        <span className="text-xs text-muted-foreground ml-2">
                          ({stage.percentage}%)
                        </span>
                      )}
                    </div>
                  </div>
                  <Progress 
                    value={index === 0 ? 100 : (stage.value / conversionFunnelData[0].value) * 100} 
                    className="h-3"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Performing Content */}
        <Card className="relative bg-gradient-to-br from-white/50 to-gray-50/50 dark:from-gray-900/50 dark:to-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg shadow-gray-500/5 dark:shadow-gray-500/10">
          <CardHeader>
            <CardTitle className="text-foreground">Top Performing Content</CardTitle>
            <CardDescription>Content pieces driving the most engagement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPerformingContent.map((content, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                  <div className="flex-1">
                    <h4 className="text-sm text-foreground mb-1">{content.title}</h4>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{content.views.toLocaleString()} views</span>
                      <span>{content.engagement}% engagement</span>
                      <span>{content.leads} leads</span>
                    </div>
                  </div>
                  <Badge variant="outline" className="ml-2">
                    #{index + 1}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}