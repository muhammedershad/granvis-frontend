import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { OverviewTab } from "./OverviewTab";
import { TrendsTab } from "./TrendsTab";
import { PerformanceTab } from "./PerformanceTab";
import { InsightsTab } from "./InsightsTab";

export function PaymentStatisticsMain() {
  const [selectedPeriod, setSelectedPeriod] = useState("last-12-months");
  const [activeStatsTab, setActiveStatsTab] = useState("overview");

  return (
    <div className="space-y-6">
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

      <Tabs value={activeStatsTab} onValueChange={setActiveStatsTab}>
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 gap-1">
          <TabsTrigger value="overview" className="text-xs sm:text-sm">
            Overview
          </TabsTrigger>
          <TabsTrigger value="trends" className="text-xs sm:text-sm">
            Trends
          </TabsTrigger>
          <TabsTrigger value="performance" className="text-xs sm:text-sm">
            Performance
          </TabsTrigger>
          <TabsTrigger value="insights" className="text-xs sm:text-sm">
            Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <OverviewTab />
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <TrendsTab />
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <PerformanceTab />
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <InsightsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
