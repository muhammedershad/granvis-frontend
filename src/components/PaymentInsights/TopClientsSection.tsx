import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import { formatIndianCurrency } from "@/lib/utils/currency";
import type { ClientAnalysis } from "./types";

interface TopClientsSectionProps {
  data: ClientAnalysis[] | undefined;
  isLoading: boolean;
}

export function TopClientsSection({ data, isLoading }: TopClientsSectionProps) {
  const topClients = data?.slice(0, 10);
  const chartData = topClients?.map((c) => ({
    name:
      c.clientName.length > 18
        ? `${c.clientName.slice(0, 18)}...`
        : c.clientName,
    revenue: c.totalAmount,
    collected: c.paidAmount,
    outstanding: c.outstanding,
  }));

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">Client Analysis</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Clients Ranked List */}
        <Card className="backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 shadow-xl shadow-gray-200/50 dark:shadow-black/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50/60 via-transparent to-orange-50/60 opacity-100 dark:opacity-0 transition-opacity duration-300" />
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 opacity-0 dark:opacity-100 transition-opacity duration-300" />
          <CardHeader className="relative">
            <CardTitle className="text-foreground">
              Top Clients by Revenue
            </CardTitle>
            <CardDescription>
              Highest paying clients in the period
            </CardDescription>
          </CardHeader>
          <CardContent className="relative">
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : !topClients || topClients.length === 0 ? (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                No client data available
              </div>
            ) : (
              <div className="space-y-2">
                {topClients.map((client, index) => (
                  <div
                    key={client.clientId}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/10 hover:bg-muted/20 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-xs font-medium shadow-lg shadow-purple-500/25 shrink-0">
                        {index + 1}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {client.clientName}
                        </p>
                        {client.companyName && (
                          <p className="text-xs text-muted-foreground truncate">
                            {client.companyName}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-2">
                      <p className="text-sm font-medium text-foreground">
                        {formatIndianCurrency(client.totalAmount)}
                      </p>
                      <div className="flex items-center gap-1 justify-end">
                        <Badge
                          variant="outline"
                          className="text-[10px] px-1.5 py-0"
                        >
                          {client.paymentCount} payments
                        </Badge>
                        {client.outstanding > 0 && (
                          <Badge className="text-[10px] px-1.5 py-0 bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/30">
                            {formatIndianCurrency(client.outstanding)} due
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Client Revenue Bar Chart */}
        <Card className="backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 shadow-xl shadow-gray-200/50 dark:shadow-black/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50/60 via-transparent to-orange-50/60 opacity-100 dark:opacity-0 transition-opacity duration-300" />
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 opacity-0 dark:opacity-100 transition-opacity duration-300" />
          <CardHeader className="relative">
            <CardTitle className="text-foreground">
              Client Payment Analysis
            </CardTitle>
            <CardDescription>
              Revenue, collected, and outstanding by client
            </CardDescription>
          </CardHeader>
          <CardContent className="relative">
            {isLoading ? (
              <Skeleton className="w-full h-[400px]" />
            ) : !chartData || chartData.length === 0 ? (
              <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                No data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData} layout="vertical">
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(128,128,128,0.15)"
                  />
                  <XAxis
                    type="number"
                    stroke="#64748b"
                    fontSize={12}
                    tickFormatter={(value) => formatIndianCurrency(value)}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    stroke="#64748b"
                    fontSize={11}
                    width={130}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(0,0,0,0.85)",
                      border: "none",
                      borderRadius: "8px",
                      color: "white",
                      fontSize: "13px",
                    }}
                    formatter={(value: number) => formatIndianCurrency(value)}
                  />
                  <Bar
                    dataKey="collected"
                    stackId="a"
                    fill="#10b981"
                    name="Collected"
                    radius={[0, 0, 0, 0]}
                  />
                  <Bar
                    dataKey="outstanding"
                    stackId="a"
                    fill="#f59e0b"
                    name="Outstanding"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
