import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ProjectHeader } from "./ProjectHeader";
import { QuickStatsCards } from "./QuickStatsCards";
import { OverviewTab } from "./OverviewTab";
import { TimelineTab } from "./TimelineTab";
import { ScheduleTab } from "./ScheduleTab";
import { PaymentsTab } from "./PaymentsTab";
import { DocumentsTab } from "./DocumentsTab";
import { TimelineItemModal } from "./TimelineItemModal";
import {
  mockPayments,
  mockProject,
  mockSchedule,
  mockTimeline,
} from "./mockData";
import type { TimelineItem } from "./types";

interface ProjectDetailsPageProps {
  projectId: string;
  onBack: () => void;
}

export function ProjectDetailsPage({ onBack }: ProjectDetailsPageProps) {
  const [selectedTimelineItem, setSelectedTimelineItem] =
    useState<TimelineItem | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-6">
      <ProjectHeader projectName={mockProject.name} onBack={onBack} />

      <QuickStatsCards project={mockProject} />

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid grid-cols-5 w-full bg-muted/30 p-1 rounded-xl">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-background"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="timeline"
            className="data-[state=active]:bg-background"
          >
            Timeline
          </TabsTrigger>
          <TabsTrigger
            value="schedule"
            className="data-[state=active]:bg-background"
          >
            Schedule
          </TabsTrigger>
          <TabsTrigger
            value="payments"
            className="data-[state=active]:bg-background"
          >
            Payments
          </TabsTrigger>
          <TabsTrigger
            value="documents"
            className="data-[state=active]:bg-background"
          >
            Documents
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <OverviewTab project={mockProject} />
        </TabsContent>

        <TabsContent value="timeline" className="space-y-6">
          <TimelineTab
            timeline={mockTimeline}
            onSelectItem={setSelectedTimelineItem}
          />
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          <ScheduleTab schedule={mockSchedule} />
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <PaymentsTab payments={mockPayments} project={mockProject} />
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <DocumentsTab />
        </TabsContent>
      </Tabs>

      <TimelineItemModal
        item={selectedTimelineItem}
        onClose={() => setSelectedTimelineItem(null)}
      />
    </div>
  );
}

export default ProjectDetailsPage;
