"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
interface TeamMembersListProps {
  data: Array<{
    id: string;
    firstName: string;
    lastName: string;
    role: string;
    department?: string;
    avatar?: string;
  }>;
}

export function TeamMembersList({ data }: TeamMembersListProps) {
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <Card className="backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 p-6 relative overflow-hidden shadow-xl dark:shadow-2xl shadow-gray-200/50 dark:shadow-black/50">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50/80 via-purple-50/60 to-indigo-50/80 opacity-100 dark:opacity-0 transition-opacity duration-300" />
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-purple-500/5 opacity-0 dark:opacity-100 transition-opacity duration-300" />
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">
            Team Members
          </h3>
          <Badge
            variant="secondary"
            className="bg-purple-100/80 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-500/30"
          >
            {data.length} members
          </Badge>
        </div>

        <div className="space-y-3">
          {data.map((member) => (
            <div
              key={member.id}
              className="flex items-center gap-3 p-2.5 rounded-lg bg-white/60 dark:bg-white/5 border border-white/40 dark:border-white/10 hover:bg-white/80 dark:hover:bg-white/10 transition-all duration-200"
            >
              {member.avatar ? (
                <Image
                  src={member.avatar}
                  alt={`${member.firstName} ${member.lastName}`}
                  width={36}
                  height={36}
                  className="w-9 h-9 rounded-full object-cover border-2 border-white/50 dark:border-white/10"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                  {member.firstName[0]}
                  {member.lastName[0]}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {member.firstName} {member.lastName}
                </p>
                <p className="text-xs text-muted-foreground capitalize">
                  {member.department || member.role}
                </p>
              </div>
              <Badge
                variant="outline"
                className="text-[10px] capitalize bg-white/60 dark:bg-white/5"
              >
                {member.role}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
