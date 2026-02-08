"use client";

import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  Activity,
  AlertCircle,
  CheckCircle2,
  Circle,
  Clock,
  DollarSign,
  Flag,
  Plus,
  RefreshCcw,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { Skeleton } from "../ui/skeleton";
import { toast } from "sonner";
import { IAuthRoles, getAuthDetails } from "@/store/slices/authSlice";
import type { Project } from "@/types/project";
import { Milestone } from "@/types/milestone";
import {
  useGetMilestonesByProjectQuery,
  useGetProjectProgressSummaryQuery,
  useReorderMilestonesMutation,
} from "@/lib/api/milestonesApi";
import { MilestoneCard } from "./MilestoneCard";
import { MilestoneFormModal } from "./MilestoneFormModal";
import { UpdateProgressModal } from "./UpdateProgressModal";
import { DeleteMilestoneDialog } from "./DeleteMilestoneDialog";

interface TimelineTabProps {
  project: Project;
}

const formatCurrency = (amount: number): string => {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)}Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)}L`;
  }
  return `₹${amount.toLocaleString("en-IN")}`;
};

export function TimelineTab({ project }: TimelineTabProps) {
  const { user } = useSelector(getAuthDetails);

  // API queries
  const {
    data: milestones,
    isLoading,
    isError,
    refetch,
  } = useGetMilestonesByProjectQuery(project.id);

  const { data: summary } = useGetProjectProgressSummaryQuery(project.id);

  const [reorderMilestones] = useReorderMilestonesMutation();

  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [progressModalOpen, setProgressModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(
    null
  );

  // Drag and drop states
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  // Sort milestones by order
  const sortedMilestones = useMemo(() => {
    return milestones ? [...milestones].sort((a, b) => a.order - b.order) : [];
  }, [milestones]);

  // Permission checks
  const canEdit =
    user?.role &&
    [IAuthRoles.SUPER_ADMIN, IAuthRoles.ADMIN, IAuthRoles.MANAGER].includes(
      user.role
    );

  // Handlers
  const handleCreateMilestone = () => {
    setCreateModalOpen(true);
  };

  const handleEditMilestone = (milestone: Milestone) => {
    setSelectedMilestone(milestone);
    setEditModalOpen(true);
  };

  const handleUpdateProgress = (milestone: Milestone) => {
    setSelectedMilestone(milestone);
    setProgressModalOpen(true);
  };

  const handleDeleteMilestone = (milestone: Milestone) => {
    setSelectedMilestone(milestone);
    setDeleteDialogOpen(true);
  };

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, milestoneId: string) => {
    e.dataTransfer.effectAllowed = "move";
    setDraggedId(milestoneId);
  };

  const handleDragOver = (e: React.DragEvent, milestoneId: string) => {
    e.preventDefault();
    setDragOverId(milestoneId);
  };

  const handleDrop = async (e: React.DragEvent, targetId: string) => {
    e.preventDefault();

    if (!draggedId || draggedId === targetId || !canEdit) {
      setDraggedId(null);
      setDragOverId(null);
      return;
    }

    // Calculate new order
    const draggedIndex = sortedMilestones.findIndex((m) => m.id === draggedId);
    const targetIndex = sortedMilestones.findIndex((m) => m.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) {
      return;
    }

    const newOrder = [...sortedMilestones];
    const [draggedItem] = newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, draggedItem);

    const reorderedIds = newOrder.map((m) => m.id);

    try {
      await reorderMilestones({
        milestoneIds: reorderedIds,
        projectId: project.id,
      }).unwrap();
      toast.success("Milestones reordered successfully");
    } catch (error) {
      toast.error("Failed to reorder milestones");
      console.error("Reorder error:", error);
    } finally {
      setDraggedId(null);
      setDragOverId(null);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <p className="text-lg font-medium text-foreground mb-2">
            Failed to load milestones
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            There was an error loading the project milestones.
          </p>
          <Button onClick={() => refetch()} variant="outline">
            <RefreshCcw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Milestones List */}
      <Card className="relative overflow-hidden bg-transparent border-none shadow-none">
        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-foreground">
                Project Milestones ({sortedMilestones.length})
              </CardTitle>
            </div>
            {canEdit && (
              <Button
                variant="default"
                size="sm"
                onClick={handleCreateMilestone}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Milestone
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="relative px-0">
          {sortedMilestones.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Flag className="h-12 w-12 mb-4 opacity-50" />
              <p className="text-lg font-medium">No milestones yet</p>
              <p className="text-sm mb-4">
                Create your first milestone to start tracking progress
              </p>
              {canEdit && (
                <Button onClick={handleCreateMilestone} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Milestone
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {sortedMilestones.map((milestone, index) => (
                <MilestoneCard
                  key={milestone.id}
                  milestone={milestone}
                  onEdit={handleEditMilestone}
                  onDelete={handleDeleteMilestone}
                  onUpdateProgress={handleUpdateProgress}
                  draggable={canEdit}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  isDragging={draggedId === milestone.id}
                  isDragOver={dragOverId === milestone.id}
                  isLast={index === sortedMilestones.length - 1}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <MilestoneFormModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        project={project}
        existingMilestones={sortedMilestones}
      />

      <MilestoneFormModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        project={project}
        milestone={selectedMilestone}
        existingMilestones={sortedMilestones}
      />

      <UpdateProgressModal
        open={progressModalOpen}
        onOpenChange={setProgressModalOpen}
        milestone={selectedMilestone}
      />

      <DeleteMilestoneDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        milestone={selectedMilestone}
        projectId={project.id}
      />
    </div>
  );
}
