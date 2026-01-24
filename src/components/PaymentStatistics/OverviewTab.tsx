import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Progress } from "../ui/progress";
import { RadialBar, RadialBarChart, ResponsiveContainer } from "recharts";
import { KPICards } from "./KPICards";
import { collectionEfficiencyData, kpiData, paymentTimingData } from "./data";

export function OverviewTab() {
  return (
    <div className="space-y-6">
      <KPICards data={kpiData} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="relative bg-gradient-to-br from-white/50 to-gray-50/50 dark:from-gray-900/50 dark:to-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg shadow-gray-500/5 dark:shadow-gray-500/10">
          <CardHeader>
            <CardTitle className="text-foreground">
              Collection Efficiency
            </CardTitle>
            <CardDescription>Overall collection performance</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="60%"
                outerRadius="90%"
                data={collectionEfficiencyData}
              >
                <RadialBar dataKey="value" cornerRadius={10} fill="#8884d8" />
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-foreground"
                >
                  <tspan fontSize="24" fontWeight="bold">
                    {collectionEfficiencyData[0].value}%
                  </tspan>
                  <tspan x="50%" dy="20" fontSize="14">
                    Collected
                  </tspan>
                </text>
              </RadialBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="relative bg-gradient-to-br from-white/50 to-gray-50/50 dark:from-gray-900/50 dark:to-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg shadow-gray-500/5 dark:shadow-gray-500/10">
          <CardHeader>
            <CardTitle className="text-foreground">
              Payment Timing Distribution
            </CardTitle>
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
                      <span className="text-sm text-muted-foreground ml-2">
                        ({item.percentage}%)
                      </span>
                    </div>
                  </div>
                  <Progress value={item.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
