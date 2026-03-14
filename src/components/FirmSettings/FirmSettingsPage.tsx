"use client";

import { useState } from "react";
import { Building2, Loader2, Plus, Settings } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { FirmSettingsCard } from "./FirmSettingsCard";
import { FirmSettingsFormDialog } from "./FirmSettingsFormDialog";
import { DeleteFirmDialog } from "./DeleteFirmDialog";
import {
  useGetFirmSettingsQuery,
  useSetFirmSettingsAsDefaultMutation,
} from "@/lib/api/firmSettingsApi";
import { FirmSettings } from "@/types/firm-settings";
import { toast } from "sonner";

export function FirmSettingsPage() {
  const { data: firms = [], isLoading } = useGetFirmSettingsQuery();
  const [setDefault] = useSetFirmSettingsAsDefaultMutation();

  // Dialog state
  const [showFormDialog, setShowFormDialog] = useState(false);
  const [editingFirm, setEditingFirm] = useState<FirmSettings | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingFirm, setDeletingFirm] = useState<FirmSettings | null>(null);

  const handleAdd = () => {
    setEditingFirm(null);
    setShowFormDialog(true);
  };

  const handleEdit = (firm: FirmSettings) => {
    setEditingFirm(firm);
    setShowFormDialog(true);
  };

  const handleDelete = (firm: FirmSettings) => {
    setDeletingFirm(firm);
    setShowDeleteDialog(true);
  };

  const handleSetDefault = async (firm: FirmSettings) => {
    try {
      await setDefault(firm.id).unwrap();
      toast.success(`"${firm.name}" set as default`);
    } catch {
      toast.error("Failed to set default firm");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <Loader2 className="w-12 h-12 text-purple-500 dark:text-purple-400 mx-auto animate-spin" />
            <p className="text-muted-foreground">Loading firm settings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-500/10 rounded-lg border border-slate-500/20">
            <Settings className="h-6 w-6 text-slate-600 dark:text-slate-400" />
          </div>
          <div>
            <h1 className="text-foreground">Firm Settings</h1>
            <p className="text-muted-foreground">
              Manage firm profiles used on invoices
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            onClick={handleAdd}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 border-0 shadow-lg shadow-purple-200/50 dark:shadow-purple-500/25"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Firm
          </Button>
        </div>
      </div>

      {/* Card Grid */}
      {firms.length === 0 ? (
        <Card className="backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 shadow-xl shadow-gray-200/50 dark:shadow-black/50">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 via-indigo-50/40 to-purple-50/60 opacity-100 dark:opacity-0 transition-opacity duration-300"></div>
          <div className="relative p-12 text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-full flex items-center justify-center">
              <Building2 className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">
              No Firm Settings Yet
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Add your firm details to display on invoices — including name,
              contact info, logo, and bank details.
            </p>
            <Button
              onClick={handleAdd}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 border-0 shadow-lg shadow-purple-200/50 dark:shadow-purple-500/25"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Firm
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {firms.map((firm) => (
            <FirmSettingsCard
              key={firm.id}
              firm={firm}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onSetDefault={handleSetDefault}
            />
          ))}
        </div>
      )}

      {/* Form Dialog */}
      <FirmSettingsFormDialog
        open={showFormDialog}
        onOpenChange={setShowFormDialog}
        editingFirm={editingFirm}
      />

      {/* Delete Dialog */}
      <DeleteFirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        firm={deletingFirm}
      />
    </div>
  );
}
