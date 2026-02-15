"use client";

import { useCallback, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card } from "../ui/card";
import { ProjectHeader } from "./ProjectHeader";
import { QuickStatsCards } from "./QuickStatsCards";
import { OverviewTab } from "./OverviewTab";
import { TimelineTab } from "./TimelineTab";
import { ScheduleTab } from "./ScheduleTab";
import { PaymentsTab } from "./PaymentsTab";
import { DocumentsTab } from "./DocumentsTab";
import { InvoicesTab } from "./InvoicesTab";
import { TimelineItemModal } from "./TimelineItemModal";
import { useGetProjectByIdQuery } from "@/lib/api/projectsApi";
import type { TimelineItem } from "./types";

const VALID_TABS = [
  "overview",
  "timeline",
  "schedule",
  "payments",
  "documents",
  "invoices",
] as const;

interface ProjectDetailsPageProps {
  projectId: string;
  onBack: () => void;
  basePath?: string;
}

export function ProjectDetailsPage({
  projectId,
  onBack,
  basePath = "/super-admin/projects",
}: ProjectDetailsPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const tabFromUrl = searchParams.get("tab");
  const initialTab = VALID_TABS.includes(
    tabFromUrl as (typeof VALID_TABS)[number]
  )
    ? (tabFromUrl as string)
    : "overview";

  const [selectedTimelineItem, setSelectedTimelineItem] =
    useState<TimelineItem | null>(null);
  const [activeTab, setActiveTab] = useState(initialTab);

  const handleTabChange = useCallback(
    (tab: string) => {
      setActiveTab(tab);
      const params = new URLSearchParams(searchParams.toString());
      if (tab === "overview") {
        params.delete("tab");
      } else {
        params.set("tab", tab);
      }
      const query = params.toString();
      router.replace(`${pathname}${query ? `?${query}` : ""}`, {
        scroll: false,
      });
    },
    [router, pathname, searchParams]
  );

  const {
    data: project,
    isLoading,
    error,
  } = useGetProjectByIdQuery(projectId, {
    skip: !projectId,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
        <span className="ml-3 text-lg text-muted-foreground">
          Loading project details...
        </span>
      </div>
    );
  }

  if (error || !project) {
    return (
      <Card className="backdrop-blur-xl bg-red-50/70 dark:bg-red-900/20 border-red-200 dark:border-red-800 p-8">
        <div className="flex items-center justify-center gap-3 text-red-600 dark:text-red-400">
          <AlertCircle className="w-6 h-6" />
          <p className="text-lg font-medium">
            Failed to load project details. Please try again later.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <ProjectHeader
        projectName={project.name}
        projectId={projectId}
        onBack={onBack}
        basePath={basePath}
      />

      <QuickStatsCards project={project} />

      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="space-y-6"
      >
        <TabsList className="grid grid-cols-6 w-full bg-muted/30 p-1 rounded-xl">
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
          <TabsTrigger
            value="invoices"
            className="data-[state=active]:bg-background"
          >
            Invoices
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <OverviewTab project={project} />
        </TabsContent>

        <TabsContent value="timeline" className="space-y-6">
          <TimelineTab project={project} />
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          <ScheduleTab project={project} />
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <PaymentsTab
            project={project}
            onNavigateToInvoices={() => handleTabChange("invoices")}
          />
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <DocumentsTab documents={project.documents} />
        </TabsContent>

        <TabsContent value="invoices" className="space-y-6">
          <InvoicesTab project={project} basePath={basePath} />
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
