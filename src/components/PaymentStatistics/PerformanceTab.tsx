import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Progress } from "../ui/progress";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { clientSegmentData, projectTypePerformanceData } from "./data";
import { formatCurrency, formatPercentage } from "./utils";

export function PerformanceTab() {
  return (
    <div className="space-y-6">
      <Card className="relative bg-gradient-to-br from-white/50 to-gray-50/50 dark:from-gray-900/50 dark:to-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg shadow-gray-500/5 dark:shadow-gray-500/10">
        <CardHeader>
          <CardTitle className="text-foreground">
            Performance by Project Type
          </CardTitle>
          <CardDescription>
            Revenue and collection metrics by project category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={projectTypePerformanceData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.1)"
              />
              <XAxis dataKey="type" stroke="#64748b" />
              <YAxis yAxisId="revenue" orientation="left" stroke="#64748b" />
              <YAxis yAxisId="metrics" orientation="right" stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0,0,0,0.8)",
                  border: "none",
                  borderRadius: "8px",
                  color: "white",
                }}
                formatter={(value, name) => [
                  name === "revenue"
                    ? formatCurrency(Number(value))
                    : name === "collectionRate"
                      ? formatPercentage(Number(value))
                      : value,
                  name === "revenue"
                    ? "Revenue"
                    : name === "collectionRate"
                      ? "Collection Rate"
                      : name === "avgCycle"
                        ? "Avg Cycle (Days)"
                        : name,
                ]}
              />
              <Legend />
              <Bar
                yAxisId="revenue"
                dataKey="revenue"
                fill="#8b5cf6"
                name="Revenue"
              />
              <Bar
                yAxisId="metrics"
                dataKey="collectionRate"
                fill="#06b6d4"
                name="Collection Rate %"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {clientSegmentData.map((segment, index) => (
          <Card
            key={index}
            className="relative bg-gradient-to-br from-white/50 to-gray-50/50 dark:from-gray-900/50 dark:to-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg shadow-gray-500/5 dark:shadow-gray-500/10"
          >
            <CardHeader>
              <CardTitle className="text-foreground">
                {segment.segment}
              </CardTitle>
              <CardDescription>{segment.count} clients</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Revenue</span>
                  <span className="text-foreground">
                    {formatCurrency(segment.revenue)}
                  </span>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Avg Invoice</span>
                  <span className="text-foreground">
                    {formatCurrency(segment.avgInvoice)}
                  </span>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Cycle Time</span>
                  <span className="text-foreground">
                    {segment.cycleTime} days
                  </span>
                </div>
                <Progress
                  value={100 - (segment.cycleTime / 40) * 100}
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
