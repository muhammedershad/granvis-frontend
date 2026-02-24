"use client";

import { Suspense, useEffect, useReducer, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Briefcase,
  Calendar,
  CheckCircle,
  ChevronRight,
  ExternalLink,
  Eye,
  FileText,
  Home,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { MilestoneSelectionTable } from "./MilestoneSelectionTable";
import { InvoiceSummaryPanel } from "./InvoiceSummaryPanel";
import {
  GenericLineItem,
  MilestoneWithInvoicing,
  calculateMilestoneInvoicingStatus,
  clearFormStateSession,
  initialInvoiceFormState,
  invoiceFormReducer,
  loadFormStateFromSession,
  saveFormStateToSession,
} from "./invoiceMockData";
import { useGetMilestonesByProjectQuery } from "@/lib/api/milestonesApi";
import { useGetProjectByIdQuery } from "@/lib/api/projectsApi";
import { useGetFirmSettingsQuery } from "@/lib/api/firmSettingsApi";
import { getCloudFrontUrl } from "@/lib/utils/cloudfront";
import Link from "next/link";
import { FirmSettings } from "@/types/firm-settings";
import {
  CreateInvoiceDto,
  InvoiceLineItem,
  InvoiceMilestoneItem,
  InvoiceStatus,
  useCreateInvoiceMutation,
  useGetInvoiceByIdQuery,
  useGetInvoicesByProjectQuery,
  useLazyGenerateInvoiceNumberQuery,
  useUpdateInvoiceMutation,
} from "@/lib/api/invoicesApi";
import { useAppSelector } from "@/store/hooks";
import { toast } from "sonner";
import { DatePicker } from "../ui/date-picker";
import { dateToUTC, utcToDate } from "@/lib/utils/date";

interface CreateInvoicePageProps {
  projectId: string;
  basePath: string;
}

interface InvoiceHeaderSectionProps {
  isEditMode: boolean;
  projectName: string | undefined;
  projectId: string;
  basePath: string;
  invoiceReference: string;
  isEditable: boolean;
  isSaving: boolean;
  hasItems: boolean;
  onCancel: () => void;
  onPreview: () => void;
  onSaveDraft: () => void;
  onFinalize: () => void;
}

function InvoiceHeaderSection({
  isEditMode,
  projectName,
  projectId,
  basePath,
  invoiceReference,
  isEditable,
  isSaving,
  hasItems,
  onCancel,
  onPreview,
  onSaveDraft,
  onFinalize,
}: InvoiceHeaderSectionProps) {
  return (
    <div className="space-y-4">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-sm">
        <Link
          href={basePath}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
        >
          <div className="p-1.5 rounded-lg bg-background/50 border border-border/50 group-hover:border-primary/50 group-hover:bg-primary/5 transition-all">
            <Home className="h-4 w-4" />
          </div>
          <span className="font-medium">Projects</span>
        </Link>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
        <Link
          href={`${basePath}/${projectId}?tab=invoices`}
          className="text-muted-foreground hover:text-foreground transition-colors font-medium"
        >
          {projectName}
        </Link>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
        <Link
          href={`${basePath}/${projectId}?tab=invoices`}
          className="text-muted-foreground hover:text-foreground transition-colors font-medium"
        >
          Invoices
        </Link>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
        <span className="text-foreground font-medium">
          {isEditMode ? "Edit" : "Create"}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            {isEditMode ? "Edit Invoice" : "Create New Invoice"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {projectName} • {invoiceReference}
          </p>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Button variant="outline" onClick={onCancel} disabled={isSaving}>
            Cancel
          </Button>
          {isEditable && (
            <>
              <Button
                variant="outline"
                onClick={onPreview}
                disabled={isSaving || !hasItems}
                className="border-blue-500/50 text-blue-600 hover:bg-blue-500/10"
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button
                variant="secondary"
                onClick={onSaveDraft}
                disabled={isSaving || !hasItems}
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save as Draft
              </Button>
              <Button
                onClick={onFinalize}
                disabled={isSaving || !hasItems}
                className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4 mr-2" />
                )}
                Finalize Invoice
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

interface FirmDetailsCardProps {
  allFirmSettings: FirmSettings[];
  selectedFirm: FirmSettings | undefined;
  isEditable: boolean;
  basePath: string;
  onSelectFirm: (firmId: string) => void;
}

function FirmDetailsCard({
  allFirmSettings,
  selectedFirm,
  isEditable,
  basePath,
  onSelectFirm,
}: FirmDetailsCardProps) {
  return (
    <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/[0.02] to-orange-500/[0.02] dark:from-amber-400/[0.05] dark:to-orange-400/[0.05]"></div>
      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
              <Briefcase className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <CardTitle className="text-foreground">Firm Details</CardTitle>
          </div>
          <Link
            href={`/${basePath.split("/")[1]}/firm-settings`}
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
          >
            Manage Firms
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="relative space-y-4">
        {allFirmSettings.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground mb-2">
              No firm settings configured yet.
            </p>
            <Link
              href={`/${basePath.split("/")[1]}/firm-settings`}
              className="text-sm text-purple-600 hover:text-purple-700 underline"
            >
              Add firm details
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <Label className="text-sm">
                Select Firm <span className="text-red-500">*</span>
              </Label>
              <Select
                value={selectedFirm?.id || ""}
                onValueChange={(value) => onSelectFirm(value)}
                disabled={!isEditable}
              >
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Select a firm..." />
                </SelectTrigger>
                <SelectContent>
                  {allFirmSettings.map((firm) => (
                    <SelectItem key={firm.id} value={firm.id}>
                      {firm.name}
                      {firm.isDefault ? " (Default)" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedFirm && (
              <div className="flex items-start gap-4 p-3 rounded-lg bg-muted/50 border border-border/50">
                {selectedFirm.logo || selectedFirm.logoKey ? (
                  <img
                    src={
                      selectedFirm.logo ||
                      getCloudFrontUrl(selectedFirm.logoKey) ||
                      ""
                    }
                    alt={selectedFirm.name}
                    className="w-12 h-12 object-contain rounded-lg border border-gray-200 dark:border-gray-700 bg-white flex-shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-white">
                      {selectedFirm.name.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="min-w-0 flex-1 space-y-1">
                  <p className="font-medium text-sm text-foreground truncate">
                    {selectedFirm.name}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Phone className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">{selectedFirm.phone}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Mail className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">{selectedFirm.email}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">
                      {selectedFirm.address}, {selectedFirm.city}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

interface BasicInfoCardProps {
  invoiceDate: string;
  dueDate: string;
  invoiceReference: string;
  notes: string;
  isEditable: boolean;
  onSetDate: (date: string) => void;
  onSetDueDate: (date: string) => void;
  onSetNotes: (notes: string) => void;
}

function BasicInfoCard({
  invoiceDate,
  dueDate,
  invoiceReference,
  notes,
  isEditable,
  onSetDate,
  onSetDueDate,
  onSetNotes,
}: BasicInfoCardProps) {
  return (
    <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.02] to-purple-500/[0.02] dark:from-blue-400/[0.05] dark:to-purple-400/[0.05]"></div>
      <CardHeader className="relative">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <CardTitle className="text-foreground">Basic Information</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="relative space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-sm">
              Invoice Date <span className="text-red-500">*</span>
            </Label>
            <DatePicker
              date={utcToDate(invoiceDate)}
              onDateChange={(date) => onSetDate(dateToUTC(date))}
              placeholder="Select invoice date"
              disabled={!isEditable}
              className="text-sm h-9"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Due Date</Label>
            <DatePicker
              date={utcToDate(dueDate)}
              onDateChange={(date) => onSetDueDate(dateToUTC(date))}
              placeholder="Select due date"
              disabled={!isEditable}
              className="text-sm h-9"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="invoiceReference" className="text-sm">
              Invoice Reference
            </Label>
            <Input
              id="invoiceReference"
              value={invoiceReference}
              disabled
              className="text-sm bg-muted"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes" className="text-sm">
            Notes
          </Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => onSetNotes(e.target.value)}
            placeholder="Add any notes or special terms..."
            rows={3}
            disabled={!isEditable}
            className="text-sm resize-none"
          />
        </div>
      </CardContent>
    </Card>
  );
}

interface MilestoneSelectionCardProps {
  milestonesWithStatus: MilestoneWithInvoicing[];
  selectedMilestones: typeof initialInvoiceFormState.selectedMilestones;
  expandedMilestones: Set<string>;
  isEditable: boolean;
  onToggleMilestone: (id: string, milestone: MilestoneWithInvoicing) => void;
  onUpdateRate: (
    id: string,
    data: { rateType: string; rate: number; quantity: number }
  ) => void;
  onUpdateAmount: (id: string, amount: number) => void;
  onToggleExpand: (milestoneId: string) => void;
}

function MilestoneSelectionCard({
  milestonesWithStatus,
  selectedMilestones,
  expandedMilestones,
  isEditable,
  onToggleMilestone,
  onUpdateRate,
  onUpdateAmount,
  onToggleExpand,
}: MilestoneSelectionCardProps) {
  return (
    <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.02] to-blue-500/[0.02] dark:from-purple-400/[0.05] dark:to-blue-400/[0.05]"></div>
      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <CardTitle className="text-foreground">
              Select Milestones <span className="text-red-500">*</span>
            </CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            {selectedMilestones.size} milestone(s) selected
          </p>
        </div>
      </CardHeader>
      <CardContent className="relative">
        <MilestoneSelectionTable
          milestones={milestonesWithStatus}
          selectedMilestones={selectedMilestones}
          onToggleMilestone={(id, milestone) => {
            if (isEditable) {
              onToggleMilestone(id, milestone);
            }
          }}
          onUpdateRate={(id, data) => {
            if (isEditable) {
              onUpdateRate(id, data);
            }
          }}
          onUpdateAmount={(id, amount) => {
            if (isEditable) {
              onUpdateAmount(id, amount);
            }
          }}
          expandedMilestones={expandedMilestones}
          onToggleExpand={onToggleExpand}
        />
      </CardContent>
    </Card>
  );
}

interface LineItemsCardProps {
  lineItems: GenericLineItem[];
  isEditable: boolean;
  onAddItem: () => void;
  onUpdateItem: (
    id: string,
    field: keyof GenericLineItem,
    value: string | number
  ) => void;
  onRemoveItem: (id: string) => void;
}

function LineItemsCard({
  lineItems,
  isEditable,
  onAddItem,
  onUpdateItem,
  onRemoveItem,
}: LineItemsCardProps) {
  return (
    <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
      <div className="absolute inset-0 bg-gradient-to-br from-teal-500/[0.02] to-cyan-500/[0.02] dark:from-teal-400/[0.05] dark:to-cyan-400/[0.05]"></div>
      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-500/10 rounded-lg border border-teal-500/20">
              <Plus className="h-5 w-5 text-teal-600 dark:text-teal-400" />
            </div>
            <CardTitle className="text-foreground">
              Additional Line Items
            </CardTitle>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-sm text-muted-foreground">
              {lineItems.length} item(s)
            </p>
            {isEditable && (
              <Button
                variant="outline"
                size="sm"
                onClick={onAddItem}
                className="border-teal-500/50 text-teal-600 hover:bg-teal-500/10"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Item
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative">
        {lineItems.length === 0 ? (
          <div className="text-center py-6 text-sm text-muted-foreground">
            <p>No additional line items added.</p>
            <p className="mt-1 text-xs">
              Add custom items that are not tied to any milestone.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Header */}
            <div className="grid grid-cols-12 gap-3 text-xs font-medium text-muted-foreground uppercase tracking-wider px-1">
              <div className="col-span-2">Phase</div>
              <div className="col-span-3">Description</div>
              <div className="col-span-2">Rate Type</div>
              <div className="col-span-1">Rate</div>
              <div className="col-span-1">Qty</div>
              <div className="col-span-2">Amount</div>
              <div className="col-span-1"></div>
            </div>
            {/* Items */}
            {lineItems.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-12 gap-3 items-center p-2 rounded-lg bg-muted/30 border border-border/30"
              >
                <div className="col-span-2">
                  <Input
                    value={item.phase}
                    onChange={(e) =>
                      onUpdateItem(item.id, "phase", e.target.value)
                    }
                    placeholder="Phase"
                    disabled={!isEditable}
                    className="text-sm h-9"
                  />
                </div>
                <div className="col-span-3">
                  <Input
                    value={item.description}
                    onChange={(e) =>
                      onUpdateItem(item.id, "description", e.target.value)
                    }
                    placeholder="Item description"
                    disabled={!isEditable}
                    className="text-sm h-9"
                  />
                </div>
                <div className="col-span-2">
                  <Select
                    value={item.rateType}
                    onValueChange={(value) =>
                      onUpdateItem(item.id, "rateType", value)
                    }
                    disabled={!isEditable}
                  >
                    <SelectTrigger className="text-sm h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">Fixed</SelectItem>
                      <SelectItem value="per_sqft">Per Sqft</SelectItem>
                      <SelectItem value="per_visit">Per Visit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-1">
                  <Input
                    type="number"
                    value={item.rate || ""}
                    onChange={(e) =>
                      onUpdateItem(
                        item.id,
                        "rate",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    placeholder="0"
                    disabled={!isEditable}
                    className="text-sm h-9"
                    min={0}
                  />
                </div>
                <div className="col-span-1">
                  <Input
                    type="number"
                    value={item.quantity || ""}
                    onChange={(e) =>
                      onUpdateItem(
                        item.id,
                        "quantity",
                        parseInt(e.target.value) || 1
                      )
                    }
                    placeholder="1"
                    disabled={item.rateType === "fixed" || !isEditable}
                    className="text-sm h-9"
                    min={1}
                  />
                </div>
                <div className="col-span-2">
                  <div className="text-sm font-medium text-foreground px-2 py-1.5">
                    {new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "INR",
                      maximumFractionDigits: 0,
                    }).format(item.amount)}
                  </div>
                </div>
                <div className="col-span-1 flex justify-center">
                  {isEditable && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveItem(item.id)}
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface MobileActionButtonsProps {
  isEditable: boolean;
  isSaving: boolean;
  hasItems: boolean;
  onCancel: () => void;
  onPreview: () => void;
  onSaveDraft: () => void;
  onFinalize: () => void;
}

function MobileActionButtons({
  isEditable,
  isSaving,
  hasItems,
  onCancel,
  onPreview,
  onSaveDraft,
  onFinalize,
}: MobileActionButtonsProps) {
  return (
    <>
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur border-t border-border">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isSaving}
            size="sm"
          >
            Cancel
          </Button>
          {isEditable && (
            <>
              <Button
                variant="outline"
                onClick={onPreview}
                disabled={isSaving || !hasItems}
                size="sm"
                className="border-blue-500/50 text-blue-600"
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                onClick={onSaveDraft}
                disabled={isSaving || !hasItems}
                size="sm"
                className="flex-1"
              >
                Draft
              </Button>
              <Button
                onClick={onFinalize}
                disabled={isSaving || !hasItems}
                size="sm"
                className="flex-1 bg-gradient-to-r from-green-600 to-teal-600"
              >
                Finalize
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="md:hidden h-20"></div>
    </>
  );
}

export function CreateInvoicePage(props: CreateInvoicePageProps) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
          <span className="ml-3 text-lg text-muted-foreground">Loading...</span>
        </div>
      }
    >
      <CreateInvoicePageContent {...props} />
    </Suspense>
  );
}

function CreateInvoicePageContent({
  projectId,
  basePath,
}: CreateInvoicePageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [state, dispatch] = useReducer(
    invoiceFormReducer,
    initialInvoiceFormState
  );
  const [expandedMilestones, setExpandedMilestones] = useState<Set<string>>(
    new Set()
  );
  const formInitializedRef = useRef(false);

  // Get current user from auth state
  const user = useAppSelector((state) => state.auth.user);

  // Determine if we're editing an existing invoice (from query param)
  const invoiceId = searchParams.get("edit");
  const isEditMode = !!invoiceId;

  // Fetch project details
  const { data: project, isLoading: isLoadingProject } = useGetProjectByIdQuery(
    projectId,
    {
      skip: !projectId,
    }
  );

  // Fetch milestones for the project
  const { data: milestonesData = [], isLoading: isLoadingMilestones } =
    useGetMilestonesByProjectQuery(projectId, {
      skip: !projectId,
    });

  // Fetch existing invoices for the project
  const { data: existingInvoices = [], isLoading: isLoadingInvoices } =
    useGetInvoicesByProjectQuery(projectId, {
      skip: !projectId,
    });

  // Fetch existing invoice if editing
  const { data: existingInvoice, isLoading: isLoadingExistingInvoice } =
    useGetInvoiceByIdQuery(invoiceId || "", {
      skip: !invoiceId,
    });

  // Fetch all firm settings for selection
  const { data: allFirmSettings = [] } = useGetFirmSettingsQuery();

  // Selected firm state — defaults to the default firm or first available
  const [selectedFirmId, setSelectedFirmId] = useState<string>("");

  // Derive the selected firm object
  const selectedFirm: FirmSettings | undefined =
    allFirmSettings.find((f) => f.id === selectedFirmId) ||
    allFirmSettings.find((f) => f.isDefault) ||
    allFirmSettings[0];

  // Keep firmSettings as alias for backward compatibility in the rest of the file
  const firmSettings = selectedFirm;

  // Generate invoice number
  const [generateInvoiceNumber] = useLazyGenerateInvoiceNumberQuery();

  // API mutations
  const [createInvoice, { isLoading: isCreating }] = useCreateInvoiceMutation();
  const [updateInvoice, { isLoading: isUpdating }] = useUpdateInvoiceMutation();

  const isSaving = isCreating || isUpdating;

  // Calculate invoicing status for each milestone
  const milestonesWithStatus: MilestoneWithInvoicing[] = milestonesData.map(
    (milestone) => {
      // Filter out the current invoice being edited to avoid double-counting
      const invoicesToConsider = existingInvoices.filter(
        (inv) => inv.id !== (invoiceId || "")
      );

      // Calculate based on existing finalized invoices
      const { status, totalBilled, remainingAmount } =
        calculateMilestoneInvoicingStatus(milestone, invoicesToConsider);

      return {
        ...milestone,
        invoicingStatus: status,
        totalBilled,
        remainingToBill: remainingAmount,
      };
    }
  );

  // Initialize form with generated invoice number
  useEffect(() => {
    const initForm = async () => {
      if (isEditMode && existingInvoice) {
        // Load existing invoice for editing
        // NOTE: Do NOT guard this with formInitializedRef — during Next.js
        // hydration useSearchParams() may initially return empty params,
        // causing the !isEditMode branch to fire RESET_FORM first.
        // LOAD_DRAFT must always be allowed to run so it can override
        // any stale RESET_FORM that occurred before search params hydrated.
        dispatch({ type: "LOAD_DRAFT", payload: existingInvoice });
        // Auto-expand selected milestones
        const selectedIds = new Set(
          existingInvoice.milestoneItems.map((item) => item.milestoneId)
        );
        setExpandedMilestones(selectedIds);
        formInitializedRef.current = true;
      } else if (!isEditMode) {
        // Check if we have saved state from a preview round-trip
        const savedState = loadFormStateFromSession();
        if (savedState) {
          dispatch({ type: "RESTORE_FROM_SESSION", payload: savedState });
          // Re-expand milestones that were selected
          const selectedIds = new Set(savedState.selectedMilestones.keys());
          setExpandedMilestones(selectedIds);
          clearFormStateSession();
          formInitializedRef.current = true;
        } else if (!formInitializedRef.current) {
          // Reset for new invoice (only on first initialization)
          dispatch({ type: "RESET_FORM" });
          setExpandedMilestones(new Set());

          // Generate invoice number
          try {
            const result = await generateInvoiceNumber(
              firmSettings?.id
            ).unwrap();
            dispatch({
              type: "SET_INVOICE_REFERENCE",
              payload: result.invoiceNumber,
            });
          } catch {
            // Use fallback invoice number
            const fallbackNumber = `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`;
            dispatch({
              type: "SET_INVOICE_REFERENCE",
              payload: fallbackNumber,
            });
          }
          formInitializedRef.current = true;
        }
      }
    };

    initForm();
  }, [isEditMode, existingInvoice, firmSettings?.id, generateInvoiceNumber]);

  // Set selected firm when firms load or when editing an invoice
  useEffect(() => {
    if (allFirmSettings.length > 0 && !selectedFirmId) {
      if (isEditMode && existingInvoice?.firmSettingsId) {
        setSelectedFirmId(existingInvoice.firmSettingsId);
      } else {
        const defaultFirm = allFirmSettings.find((f) => f.isDefault);
        setSelectedFirmId(defaultFirm?.id || allFirmSettings[0].id);
      }
    }
  }, [
    allFirmSettings,
    selectedFirmId,
    isEditMode,
    existingInvoice?.firmSettingsId,
  ]);

  const handleToggleExpand = (milestoneId: string) => {
    setExpandedMilestones((prev) => {
      const next = new Set(prev);
      if (next.has(milestoneId)) {
        next.delete(milestoneId);
      } else {
        next.add(milestoneId);
      }
      return next;
    });
  };

  const validateDraft = (): string | null => {
    if (!project?.clientId) {
      return "Project is missing a client. Please assign a client to the project before creating an invoice.";
    }
    if (!state.invoiceDate) {
      return "Invoice date is required";
    }
    if (state.selectedMilestones.size === 0 && state.lineItems.length === 0) {
      return "Please select at least one milestone or add a line item";
    }
    return null;
  };

  const validateFinalize = (): string | null => {
    const draftError = validateDraft();
    if (draftError) {
      return draftError;
    }

    // Check all milestone amounts are > 0
    for (const item of state.selectedMilestones.values()) {
      if (item.editableAmount <= 0) {
        return `Milestone "${item.milestoneTitle}" has invalid amount`;
      }
    }

    // Check all line items have valid data
    for (const item of state.lineItems) {
      if (!item.description.trim()) {
        return "All line items must have a description";
      }
      if (item.amount <= 0) {
        return `Line item "${item.description}" has invalid amount`;
      }
    }

    // Check discount validity
    if (state.discountValue < 0) {
      return "Discount value cannot be negative";
    }
    if (state.discountType === "percentage" && state.discountValue > 100) {
      return "Percentage discount cannot exceed 100%";
    }

    return null;
  };

  const buildInvoiceDto = (status: "draft" | "sent"): CreateInvoiceDto => {
    const milestoneItems: InvoiceMilestoneItem[] = Array.from(
      state.selectedMilestones.values()
    ).map((item) => ({
      milestoneId: item.milestoneId,
      milestoneTitle: item.milestoneTitle,
      milestoneStageNumber: item.milestoneStageNumber,
      rateType: item.rateType,
      rate: item.rate,
      quantity: item.quantity,
      calculatedAmount: item.calculatedAmount,
      editableAmount: item.editableAmount,
    }));

    const lineItems: InvoiceLineItem[] = state.lineItems
      .filter((item) => item.description.trim() || item.amount > 0)
      .map((item) => ({
        phase: item.phase,
        description: item.description,
        rateType: item.rateType,
        rate: item.rate,
        quantity: item.quantity,
        amount: item.amount,
      }));

    return {
      projectId,
      clientId: project!.clientId,
      invoiceDate: state.invoiceDate,
      dueDate: state.dueDate || undefined,
      milestoneItems,
      lineItems,
      subtotal: state.subtotal,
      discountType: state.discountType,
      discountValue: state.discountValue,
      discountAmount: state.discountAmount,
      netTotal: state.netTotal,
      paidAmount: state.paidAmount,
      notes: state.notes || undefined,
      defaultNotes: firmSettings?.defaultNotes,
      status,
      firmSettingsId: firmSettings?.id,
      createdBy: user
        ? `${user.firstName} ${user.lastName}`.trim() || user.email
        : "Unknown User",
      createdById: user?._id,
    };
  };

  const handleSaveDraft = async () => {
    const error = validateDraft();
    if (error) {
      toast.error(error);
      return;
    }

    try {
      const invoiceData = buildInvoiceDto("draft");

      if (isEditMode && invoiceId) {
        await updateInvoice({
          id: invoiceId,
          data: {
            invoiceDate: invoiceData.invoiceDate,
            dueDate: invoiceData.dueDate,
            milestoneItems: invoiceData.milestoneItems,
            lineItems: invoiceData.lineItems,
            subtotal: invoiceData.subtotal,
            discountType: invoiceData.discountType,
            discountValue: invoiceData.discountValue,
            discountAmount: invoiceData.discountAmount,
            netTotal: invoiceData.netTotal,
            paidAmount: invoiceData.paidAmount,
            notes: invoiceData.notes,
            defaultNotes: invoiceData.defaultNotes,
          },
        }).unwrap();
        toast.success("Invoice updated successfully");
      } else {
        await createInvoice(invoiceData).unwrap();
        toast.success("Invoice saved as draft");
      }

      clearFormStateSession();
      router.push(`${basePath}/${projectId}?tab=invoices`);
    } catch {
      toast.error("Failed to save invoice");
    }
  };

  const handleFinalize = async () => {
    const error = validateFinalize();
    if (error) {
      toast.error(error);
      return;
    }

    try {
      const invoiceData = buildInvoiceDto("sent");

      if (isEditMode && invoiceId) {
        await updateInvoice({
          id: invoiceId,
          data: {
            invoiceDate: invoiceData.invoiceDate,
            dueDate: invoiceData.dueDate,
            milestoneItems: invoiceData.milestoneItems,
            lineItems: invoiceData.lineItems,
            subtotal: invoiceData.subtotal,
            discountType: invoiceData.discountType,
            discountValue: invoiceData.discountValue,
            discountAmount: invoiceData.discountAmount,
            netTotal: invoiceData.netTotal,
            paidAmount: invoiceData.paidAmount,
            notes: invoiceData.notes,
            defaultNotes: invoiceData.defaultNotes,
            status: InvoiceStatus.SENT,
          },
        }).unwrap();
        toast.success("Invoice finalized successfully");
      } else {
        await createInvoice(invoiceData).unwrap();
        toast.success("Invoice finalized successfully");
      }

      clearFormStateSession();
      router.push(`${basePath}/${projectId}?tab=invoices`);
    } catch {
      toast.error("Failed to finalize invoice");
    }
  };

  const handleCancel = () => {
    clearFormStateSession();
    router.push(`${basePath}/${projectId}?tab=invoices`);
  };

  const handlePreview = () => {
    const error = validateDraft();
    if (error) {
      toast.error(error);
      return;
    }

    // Build URL params for preview with complete form state
    const params = new URLSearchParams();
    params.set("date", state.invoiceDate);
    if (state.dueDate) {
      params.set("dueDate", state.dueDate);
    }
    params.set("invoiceRef", state.invoiceReference);
    if (state.notes) {
      params.set("notes", state.notes.split("\n").join("|"));
    }

    // Serialize selected milestone items with custom rates/amounts
    const milestoneItems = Array.from(state.selectedMilestones.values()).map(
      (item) => ({
        milestoneId: item.milestoneId,
        milestoneTitle: item.milestoneTitle,
        milestoneStageNumber: item.milestoneStageNumber,
        rateType: item.rateType,
        rate: item.rate,
        quantity: item.quantity,
        calculatedAmount: item.calculatedAmount,
        editableAmount: item.editableAmount,
      })
    );
    params.set("items", btoa(JSON.stringify(milestoneItems)));

    // Serialize line items if any
    if (state.lineItems.length > 0) {
      const lineItemsData = state.lineItems
        .filter((item) => item.description.trim() || item.amount > 0)
        .map((item) => ({
          phase: item.phase,
          description: item.description,
          rateType: item.rateType,
          rate: item.rate,
          quantity: item.quantity,
          amount: item.amount,
        }));
      if (lineItemsData.length > 0) {
        params.set("lineItems", btoa(JSON.stringify(lineItemsData)));
      }
    }

    // Pass financial summary
    params.set("subtotal", String(state.subtotal));
    params.set("discountType", state.discountType);
    params.set("discountValue", String(state.discountValue));
    params.set("discountAmount", String(state.discountAmount));
    params.set("netTotal", String(state.netTotal));
    params.set("paidAmount", String(state.paidAmount));

    // Pass selected firm settings ID
    if (selectedFirm?.id) {
      params.set("firmSettingsId", selectedFirm.id);
    }

    // Persist form state so it survives the round-trip to the preview page
    saveFormStateToSession(state);

    router.push(
      `${basePath}/${projectId}/invoices/preview?${params.toString()}`
    );
  };

  // Prevent editing finalized invoices
  const isEditable = !existingInvoice || existingInvoice.status === "draft";

  const isLoading =
    isLoadingProject ||
    isLoadingMilestones ||
    isLoadingInvoices ||
    (isEditMode && isLoadingExistingInvoice);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
        <span className="ml-3 text-lg text-muted-foreground">Loading...</span>
      </div>
    );
  }

  const hasItems =
    state.selectedMilestones.size > 0 || state.lineItems.length > 0;

  return (
    <div className="space-y-6">
      <InvoiceHeaderSection
        isEditMode={isEditMode}
        projectName={project?.name}
        projectId={projectId}
        basePath={basePath}
        invoiceReference={state.invoiceReference}
        isEditable={isEditable}
        isSaving={isSaving}
        hasItems={hasItems}
        onCancel={handleCancel}
        onPreview={handlePreview}
        onSaveDraft={handleSaveDraft}
        onFinalize={handleFinalize}
      />

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-6">
          <FirmDetailsCard
            allFirmSettings={allFirmSettings}
            selectedFirm={selectedFirm}
            isEditable={isEditable}
            basePath={basePath}
            onSelectFirm={setSelectedFirmId}
          />

          <BasicInfoCard
            invoiceDate={state.invoiceDate}
            dueDate={state.dueDate}
            invoiceReference={state.invoiceReference}
            notes={state.notes}
            isEditable={isEditable}
            onSetDate={(date) =>
              dispatch({ type: "SET_INVOICE_DATE", payload: date })
            }
            onSetDueDate={(date) =>
              dispatch({ type: "SET_DUE_DATE", payload: date })
            }
            onSetNotes={(notes) =>
              dispatch({ type: "SET_NOTES", payload: notes })
            }
          />

          <MilestoneSelectionCard
            milestonesWithStatus={milestonesWithStatus}
            selectedMilestones={state.selectedMilestones}
            expandedMilestones={expandedMilestones}
            isEditable={isEditable}
            onToggleMilestone={(id, milestone) =>
              dispatch({
                type: "TOGGLE_MILESTONE",
                payload: { milestoneId: id, milestone },
              })
            }
            onUpdateRate={(id, data) =>
              dispatch({
                type: "UPDATE_MILESTONE_RATE",
                payload: { milestoneId: id, ...data },
              })
            }
            onUpdateAmount={(id, amount) =>
              dispatch({
                type: "UPDATE_MILESTONE_AMOUNT",
                payload: { milestoneId: id, amount },
              })
            }
            onToggleExpand={handleToggleExpand}
          />

          <LineItemsCard
            lineItems={state.lineItems}
            isEditable={isEditable}
            onAddItem={() => dispatch({ type: "ADD_LINE_ITEM" })}
            onUpdateItem={(id, field, value) =>
              dispatch({
                type: "UPDATE_LINE_ITEM",
                payload: { id, field, value },
              })
            }
            onRemoveItem={(id) =>
              dispatch({ type: "REMOVE_LINE_ITEM", payload: id })
            }
          />
        </div>

        <div className="lg:w-80">
          <InvoiceSummaryPanel
            subtotal={state.subtotal}
            discountType={state.discountType}
            discountValue={state.discountValue}
            discountAmount={state.discountAmount}
            netTotal={state.netTotal}
            paidAmount={state.paidAmount}
            balance={state.balance}
            onSetDiscount={(type, value) => {
              if (isEditable) {
                dispatch({ type: "SET_DISCOUNT", payload: { type, value } });
              }
            }}
            onSetPaidAmount={(amount) => {
              if (isEditable) {
                dispatch({ type: "SET_PAID_AMOUNT", payload: amount });
              }
            }}
          />
        </div>
      </div>

      <MobileActionButtons
        isEditable={isEditable}
        isSaving={isSaving}
        hasItems={hasItems}
        onCancel={handleCancel}
        onPreview={handlePreview}
        onSaveDraft={handleSaveDraft}
        onFinalize={handleFinalize}
      />
    </div>
  );
}
