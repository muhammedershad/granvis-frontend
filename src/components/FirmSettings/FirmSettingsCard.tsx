"use client";

import {
  Globe,
  Mail,
  MapPin,
  MoreHorizontal,
  Phone,
  Star,
  Edit2,
  Trash2,
  FileText,
  StickyNote,
  Hash,
  Info,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { FirmSettings } from "@/types/firm-settings";
import { getCloudFrontUrl } from "@/lib/utils/cloudfront";

interface FirmSettingsCardProps {
  firm: FirmSettings;
  onEdit: (firm: FirmSettings) => void;
  onDelete: (firm: FirmSettings) => void;
  onSetDefault: (firm: FirmSettings) => void;
}

export function FirmSettingsCard({
  firm,
  onEdit,
  onDelete,
  onSetDefault,
}: FirmSettingsCardProps) {
  const logoUrl = firm.logo || getCloudFrontUrl(firm.logoKey);
  const fullAddress = [firm.address, firm.city, firm.state, firm.country]
    .filter(Boolean)
    .join(", ");
  const notesCount = firm.defaultNotes?.filter((n) => n.trim()).length || 0;

  return (
    <Card className="flex flex-col h-full backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 hover:bg-white/80 dark:hover:bg-white/5 transition-all duration-300 group relative overflow-hidden shadow-xl shadow-gray-200/50 dark:shadow-black/50 hover:shadow-2xl dark:hover:shadow-black/70 hover:-translate-y-0.5">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 via-purple-50/40 to-cyan-50/60 opacity-100 dark:opacity-0 transition-opacity duration-300"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-cyan-500/5 opacity-0 dark:opacity-100 transition-opacity duration-300"></div>

      {/* Top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>

      <CardHeader className="relative z-10 pb-3 pt-5">
        <div className="flex items-start gap-2 overflow-hidden">
          <div className="flex items-center space-x-3.5 min-w-0 flex-1 overflow-hidden">
            {/* Logo or Initials */}
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={firm.name}
                className="w-14 h-14 object-contain rounded-xl border border-gray-200 dark:border-gray-700 bg-white shadow-sm flex-shrink-0"
              />
            ) : (
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20 flex-shrink-0">
                <span className="text-lg font-bold text-white">
                  {firm.name.substring(0, 2).toUpperCase()}
                </span>
              </div>
            )}
            <div className="min-w-0">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <h3 className="text-base font-semibold truncate text-foreground">
                      {firm.name}
                    </h3>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{firm.name}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              {(firm.city || firm.state) && (
                <p className="text-sm text-muted-foreground truncate flex items-center gap-1 mt-0.5">
                  <MapPin className="h-3 w-3 flex-shrink-0" />
                  {firm.city}{firm.state ? `, ${firm.state}` : ""}
                </p>
              )}
            </div>
          </div>

          {/* Dropdown Menu */}
          <div className="flex-shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 transition-all duration-200 hover:bg-white/60 dark:hover:bg-white/10 rounded-lg"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="min-w-[180px] backdrop-blur-xl bg-white/95 dark:bg-gray-900/95 border-white/30 dark:border-white/10 shadow-2xl shadow-black/10 dark:shadow-black/40 rounded-xl p-1.5"
            >
              <DropdownMenuItem
                onClick={() => onEdit(firm)}
                className="rounded-lg px-3 py-2.5 cursor-pointer gap-3 focus:bg-blue-500/10 dark:focus:bg-blue-500/20"
              >
                <div className="w-7 h-7 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <Edit2 className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-sm font-medium">Edit Firm</span>
              </DropdownMenuItem>
              {!firm.isDefault && (
                <DropdownMenuItem
                  onClick={() => onSetDefault(firm)}
                  className="rounded-lg px-3 py-2.5 cursor-pointer gap-3 focus:bg-amber-500/10 dark:focus:bg-amber-500/20"
                >
                  <div className="w-7 h-7 rounded-lg bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                    <Star className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <span className="text-sm font-medium">Set as Default</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator className="my-1.5 bg-gray-200/60 dark:bg-white/10" />
              <DropdownMenuItem
                onClick={() => onDelete(firm)}
                className="rounded-lg px-3 py-2.5 cursor-pointer gap-3 text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 focus:bg-red-500/10 dark:focus:bg-red-500/20"
              >
                <div className="w-7 h-7 rounded-lg bg-red-500/10 dark:bg-red-500/20 flex items-center justify-center flex-shrink-0">
                  <Trash2 className="h-3.5 w-3.5 text-red-500 dark:text-red-400" />
                </div>
                <span className="text-sm font-medium">Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          </div>
        </div>

        {/* Badges */}
        <div className="flex items-center gap-2 mt-3">
          {firm.isDefault && (
            <Badge className="bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-500/30 text-xs">
              <Star className="h-3 w-3 mr-1" />
              Default
            </Badge>
          )}
          <Badge
            className={
              firm.isActive
                ? "bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30 text-xs"
                : "bg-gray-500/20 text-gray-700 dark:text-gray-400 border-gray-500/30 text-xs"
            }
          >
            {firm.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="relative z-10 space-y-4 pb-5 flex-1 flex flex-col">
        {/* Contact Details */}
        <div className="space-y-2.5">
          <div className="flex items-center space-x-2.5 text-sm text-muted-foreground">
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center flex-shrink-0">
              <Phone className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="truncate">
              <span>{firm.phone}</span>
              {firm.alternatePhone && (
                <span className="text-muted-foreground/60"> / {firm.alternatePhone}</span>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2.5 text-sm text-muted-foreground">
            <div className="w-7 h-7 rounded-lg bg-pink-500/10 dark:bg-pink-500/20 flex items-center justify-center flex-shrink-0">
              <Mail className="h-3.5 w-3.5 text-pink-600 dark:text-pink-400" />
            </div>
            <span className="truncate">{firm.email}</span>
          </div>

          {firm.website && (
            <div className="flex items-center space-x-2.5 text-sm text-muted-foreground">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/10 dark:bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                <Globe className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
              </div>
              <span className="truncate">{firm.website}</span>
            </div>
          )}

          <div className="flex items-start space-x-2.5 text-sm text-muted-foreground">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <MapPin className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <span className="line-clamp-2">{fullAddress}</span>
          </div>
        </div>

        {/* Invoice & Notes Info */}
        <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-white/40 dark:border-white/10 mt-auto">
          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-violet-500/5 dark:bg-violet-500/10 border border-violet-500/10 dark:border-violet-500/20">
            <div className="w-7 h-7 rounded-lg bg-violet-500/15 dark:bg-violet-500/25 flex items-center justify-center flex-shrink-0">
              <Hash className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <p className="text-[10px] text-muted-foreground leading-tight">Start No.</p>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3 w-3 text-muted-foreground/60 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Invoice numbering begins from this number</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="text-sm font-semibold text-foreground">{firm.invoiceStartNumber || 1}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-orange-500/5 dark:bg-orange-500/10 border border-orange-500/10 dark:border-orange-500/20">
            <div className="w-7 h-7 rounded-lg bg-orange-500/15 dark:bg-orange-500/25 flex items-center justify-center flex-shrink-0">
              <StickyNote className="h-3.5 w-3.5 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <p className="text-[10px] text-muted-foreground leading-tight">Notes</p>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3 w-3 text-muted-foreground/60 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Default notes added to every invoice</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="text-sm font-semibold text-foreground">{notesCount} {notesCount === 1 ? "note" : "notes"}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
