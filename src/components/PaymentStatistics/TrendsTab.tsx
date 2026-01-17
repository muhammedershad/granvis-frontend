import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { monthlyTrendsData, seasonalTrendsData } from "./data";
import { formatCurrency, formatPercentage } from "./utils";

export function TrendsTab() {
  return (
    <div className="space-y-6">
      <Card className="relative bg-gradient-to-br from-white/50 to-gray-50/50 dark:from-gray-900/50 dark:to-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg shadow-gray-500/5 dark:shadow-gray-500/10">
        <CardHeader>
          <CardTitle className="text-foreground">
            Monthly Payment Trends
          </CardTitle>
          <CardDescription>
            Revenue and performance metrics over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={monthlyTrendsData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.1)"
              />
              <XAxis dataKey="month" stroke="#64748b" />
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
                      : name === "cycleTime"
                        ? "Cycle Time (Days)"
                        : name === "invoices"
                          ? "Invoices"
                          : name,
                ]}
              />
              <Legend />
              <Line
                yAxisId="revenue"
                type="monotone"
                dataKey="revenue"
                stroke="#8b5cf6"
                strokeWidth={3}
                name="Revenue"
              />
              <Line
                yAxisId="metrics"
                type="monotone"
                dataKey="collectionRate"
                stroke="#06b6d4"
                strokeWidth={2}
                name="Collection Rate %"
              />
              <Line
                yAxisId="metrics"
                type="monotone"
                dataKey="cycleTime"
                stroke="#ef4444"
                strokeWidth={2}
                name="Cycle Time (Days)"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="relative bg-gradient-to-br from-white/50 to-gray-50/50 dark:from-gray-900/50 dark:to-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg shadow-gray-500/5 dark:shadow-gray-500/10">
        <CardHeader>
          <CardTitle className="text-foreground">
            Quarterly Performance
          </CardTitle>
          <CardDescription>Seasonal trends and patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={seasonalTrendsData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.1)"
              />
              <XAxis dataKey="quarter" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0,0,0,0.8)",
                  border: "none",
                  borderRadius: "8px",
                  color: "white",
                }}
                formatter={(value, name) => [
                  name === "revenue" ? formatCurrency(Number(value)) : value,
                  name === "revenue"
                    ? "Revenue"
                    : name === "invoices"
                      ? "Invoices"
                      : name === "disputes"
                        ? "Disputes"
                        : name === "satisfaction"
                          ? "Satisfaction"
                          : name,
                ]}
              />
              <Legend />
              <Bar dataKey="revenue" fill="#8b5cf6" name="Revenue" />
              <Bar dataKey="invoices" fill="#06b6d4" name="Invoices" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
