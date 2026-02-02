"use client";

import { useSelector } from "react-redux";
import {
  Pencil,
  Trash2,
  TrendingUp,
  Calendar,
  Clock,
  Circle,
  CheckCircle2,
  User,
  Tag,
  FileText,
  Eye,
  ClipboardList,
  FileIcon,
} from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { getAuthDetails, IAuthRoles } from "@/store/slices/authSlice";
import { Milestone, MilestoneStatus } from "@/types/milestone";
import { formatDate } from "./utils";

interface MilestoneCardProps {
  milestone: Milestone;
  onEdit: (milestone: Milestone) => void;
  onDelete: (milestone: Milestone) => void;
  onUpdateProgress: (milestone: Milestone) => void;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent, milestoneId: string) => void;
  onDragOver?: (e: React.DragEvent, milestoneId: string) => void;
  onDrop?: (e: React.DragEvent, milestoneId: string) => void;
  isDragging?: boolean;
  isDragOver?: boolean;
  isLast?: boolean;
}

const getStatusColor = (status: MilestoneStatus) => {
  switch (status) {
    case MilestoneStatus.COMPLETED:
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    case MilestoneStatus.IN_PROGRESS:
      return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    case MilestoneStatus.NOT_STARTED:
      return "bg-orange-500/10 text-orange-400 border-orange-500/20";
    default:
      return "bg-gray-500/10 text-gray-400 border-gray-500/20";
  }
};

const getStatusIcon = (status: MilestoneStatus) => {
  switch (status) {
    case MilestoneStatus.COMPLETED:
      return <CheckCircle2 className="h-3 w-3" />;
    case MilestoneStatus.IN_PROGRESS:
      return <Clock className="h-3 w-3" />;
    case MilestoneStatus.NOT_STARTED:
      return <Circle className="h-3 w-3" />;
    default:
      return <Circle className="h-3 w-3" />;
  }
};

const formatStatus = (status: MilestoneStatus) => {
  switch (status) {
    case MilestoneStatus.NOT_STARTED:
      return "pending";
    case MilestoneStatus.IN_PROGRESS:
      return "in progress";
    case MilestoneStatus.COMPLETED:
      return "completed";
    default:
      return status;
  }
};

export function MilestoneCard({
  milestone,
  onEdit,
  onDelete,
  onUpdateProgress,
  draggable = false,
  onDragStart,
  onDragOver,
  onDrop,
  isDragging = false,
  isDragOver = false,
  isLast = false,
}: MilestoneCardProps) {
  const { user } = useSelector(getAuthDetails);

  const canEdit = user?.role && [
    IAuthRoles.SUPER_ADMIN,
    IAuthRoles.ADMIN,
    IAuthRoles.MANAGER,
  ].includes(user.role);

  return (
    <div 
      className={`relative flex gap-6 ${isDragging ? "opacity-50" : ""} ${isDragOver ? "scale-[1.01]" : ""} transition-all duration-200`}
      draggable={draggable && canEdit}
      onDragStart={(e) => onDragStart?.(e, milestone.id)}
      onDragOver={(e) => onDragOver?.(e, milestone.id)}
      onDrop={(e) => onDrop?.(e, milestone.id)}
    >
      {/* Timeline Connector */}
      <div className="flex flex-col items-center">
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-[#1a1a1a] border border-white/10 ring-1 ring-white/5 transition-all duration-300 ${isDragOver ? "border-blue-500/50" : ""}`}>
          <FileIcon className="h-5 w-5 text-gray-400" />
        </div>
        {!isLast && (
          <div className="w-px flex-1 bg-gradient-to-b from-white/10 to-transparent my-2" />
        )}
      </div>

      {/* Card Content */}
      <Card
        className={`flex-1 bg-[#0a0a0a]/60 border-white/5 backdrop-blur-xl shadow-2xl transition-all duration-200 ${
          isDragOver ? "border-blue-500/30 bg-blue-500/5" : ""
        } hover:bg-[#0a0a0a]/80 group mb-6 overflow-hidden`}
      >
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-4">
              {/* Header: Title and Status */}
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-[#f0f0f0] tracking-tight group-hover:text-blue-400 transition-colors">
                  {milestone.title}
                </h3>
                <Badge variant="outline" className={`rounded-full px-2 py-0 h-5 text-[10px] font-medium uppercase tracking-wider ${getStatusColor(milestone.status)}`}>
                  <span className="flex items-center gap-1">
                    {getStatusIcon(milestone.status)}
                    {formatStatus(milestone.status)}
                  </span>
                </Badge>
              </div>

              {/* Description */}
              {milestone.description && (
                <p className="text-sm text-gray-500 leading-relaxed font-normal">
                  {milestone.description}
                </p>
              )}

              {/* Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-12 gap-y-4">
                {milestone.assignedTo && (
                  <div className="space-y-1">
                    <p className="text-[11px] text-gray-600 uppercase tracking-widest font-medium">Assigned to:</p>
                    <p className="text-sm font-semibold text-[#d0d0d0]">{milestone.assignedTo}</p>
                  </div>
                )}

                {milestone.startDate && (
                  <div className="space-y-1">
                    <p className="text-[11px] text-gray-600 uppercase tracking-widest font-medium">Start Date:</p>
                    <p className="text-sm font-semibold text-[#d0d0d0]">{formatDate(milestone.startDate)}</p>
                  </div>
                )}

                {milestone.dueDate && (
                  <div className="space-y-1">
                    <p className="text-[11px] text-gray-600 uppercase tracking-widest font-medium">End Date:</p>
                    <p className="text-sm font-semibold text-[#d0d0d0]">{formatDate(milestone.dueDate)}</p>
                  </div>
                )}

                {milestone.category && (
                  <div className="space-y-1">
                    <p className="text-[11px] text-gray-600 uppercase tracking-widest font-medium">Category:</p>
                    <p className="text-sm font-semibold text-[#d0d0d0]">{milestone.category}</p>
                  </div>
                )}
              </div>

              {/* Attachments */}
              {milestone.attachments && milestone.attachments.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-white/5">
                  <p className="text-[11px] text-gray-600 uppercase tracking-widest font-medium">Attachments:</p>
                  <div className="flex flex-wrap gap-2">
                    {milestone.attachments.map((attachment) => (
                      <div
                        key={attachment.id}
                        className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                      >
                        <FileText className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-400">{attachment.fileName}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full text-gray-600 hover:text-white hover:bg-white/10 transition-all"
              >
                <Eye className="h-4 w-4" />
              </Button>
              {canEdit && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(milestone)}
                    className="h-8 w-8 rounded-full text-gray-600 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
