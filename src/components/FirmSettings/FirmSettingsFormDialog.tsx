"use client";

import { useEffect, useRef, useState } from "react";
import NextImage from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  Building2,
  ChevronDown,
  ChevronRight,
  Edit2,
  FileText,
  Image as ImageIcon,
  Loader2,
  MapPin,
  Plus,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { cn } from "../ui/utils";
import { Dialog, DialogContent } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { ImageCropDialog } from "../ui/ImageCropDialog";
import { useImageCrop } from "@/hooks/useImageCrop";
import {
  useCreateFirmSettingsMutation,
  useUpdateFirmSettingsMutation,
} from "@/lib/api/firmSettingsApi";
import { useGetPresignedUrlMutation } from "@/lib/api/uploadApi";
import { uploadToS3 } from "@/lib/utils/uploadToS3";
import { CreateFirmSettingsDto, FirmSettings } from "@/types/firm-settings";
import {
  type CreateFirmSettingsFormData,
  createFirmSettingsSchema,
} from "@/lib/validations/firm-settings";
import { getCloudFrontUrl } from "@/lib/utils/cloudfront";
import { toast } from "sonner";

interface FirmSettingsFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingFirm?: FirmSettings | null;
}

const FIRM_LOGOS_FOLDER = "griha-local/firm-logos";

const BASIC_FIELDS = [
  "name",
  "email",
  "phone",
  "alternatePhone",
  "website",
] as const;
const ADDRESS_FIELDS = ["address", "city", "state", "country"] as const;
const INVOICE_FIELDS = ["invoicePrefix", "invoiceStartNumber"] as const;

function getFirstErrorSection(errors: Record<string, unknown>): string | null {
  for (const field of BASIC_FIELDS) {
    if (errors[field]) {
      return "basic";
    }
  }
  for (const field of ADDRESS_FIELDS) {
    if (errors[field]) {
      return "address";
    }
  }
  for (const field of INVOICE_FIELDS) {
    if (errors[field]) {
      return "invoice";
    }
  }
  return null;
}

export function FirmSettingsFormDialog({
  open,
  onOpenChange,
  editingFirm,
}: FirmSettingsFormDialogProps) {
  const isEditMode = !!editingFirm;

  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<CreateFirmSettingsFormData>({
    resolver: zodResolver(createFirmSettingsSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      alternatePhone: "",
      website: "",
      address: "",
      city: "",
      state: "",
      country: "India",
      invoicePrefix: "INV",
      invoiceStartNumber: 1,
      defaultNotes: [],
      isDefault: false,
      logoKey: "",
    },
  });

  // Watch fields that need manual control
  const defaultNotes = watch("defaultNotes") || [];
  const isDefault = watch("isDefault") || false;

  // Section error checks
  const hasBasicErrors = !!(
    errors.name ||
    errors.email ||
    errors.phone ||
    errors.alternatePhone ||
    errors.website
  );
  const hasAddressErrors = !!(
    errors.address ||
    errors.city ||
    errors.state ||
    errors.country
  );
  const hasInvoiceErrors = !!(
    errors.invoicePrefix || errors.invoiceStartNumber
  );

  // Expanded sections
  const [expandedSection, setExpandedSection] = useState<string>("basic");

  // Image crop
  const imageCrop = useImageCrop({
    maxSizeInMB: 1,
    allowedFormats: ["image/jpeg", "image/png", "image/webp"],
    onError: (error) => toast.error(error),
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // API
  const [createFirm, { isLoading: isCreating }] =
    useCreateFirmSettingsMutation();
  const [updateFirm, { isLoading: isUpdating }] =
    useUpdateFirmSettingsMutation();
  const [getPresignedUrl] = useGetPresignedUrlMutation();

  const isSaving = isCreating || isUpdating;

  // Populate form for editing or reset on open
  useEffect(() => {
    if (open && editingFirm) {
      reset({
        name: editingFirm.name,
        email: editingFirm.email,
        phone: editingFirm.phone,
        alternatePhone: editingFirm.alternatePhone || "",
        website: editingFirm.website || "",
        address: editingFirm.address,
        city: editingFirm.city,
        state: editingFirm.state,
        country: editingFirm.country || "India",
        invoicePrefix: editingFirm.invoicePrefix || "INV",
        invoiceStartNumber: editingFirm.invoiceStartNumber || 1,
        defaultNotes: editingFirm.defaultNotes || [],
        isDefault: editingFirm.isDefault,
        logoKey: editingFirm.logoKey || "",
      });
    } else if (open && !editingFirm) {
      reset({
        name: "",
        email: "",
        phone: "",
        alternatePhone: "",
        website: "",
        address: "",
        city: "",
        state: "",
        country: "India",
        invoicePrefix: "INV",
        invoiceStartNumber: 1,
        defaultNotes: [],
        isDefault: false,
        logoKey: "",
      });
      imageCrop.reset();
    }
    if (open) {
      setExpandedSection("basic");
    }
  }, [open, editingFirm, reset]);

  const onSubmit = async (data: CreateFirmSettingsFormData) => {
    try {
      let logoKey = data.logoKey || undefined;

      // Upload logo if a new one was cropped
      if (imageCrop.croppedBlob) {
        const fileName = `firm-logo-${Date.now()}.jpg`;
        const presignedResponse = await getPresignedUrl({
          fileName,
          contentType: "image/jpeg",
          folder: FIRM_LOGOS_FOLDER,
        }).unwrap();

        await uploadToS3(
          presignedResponse.uploadUrl,
          imageCrop.croppedBlob,
          "image/jpeg"
        );

        logoKey = presignedResponse.objectKey;
      }

      const dto: CreateFirmSettingsDto = {
        name: data.name.trim(),
        phone: data.phone.trim(),
        alternatePhone: data.alternatePhone?.trim() || undefined,
        email: data.email.trim(),
        website: data.website?.trim() || undefined,
        address: data.address.trim(),
        city: data.city.trim(),
        state: data.state.trim(),
        country: data.country?.trim() || "India",
        invoicePrefix: data.invoicePrefix?.trim() || undefined,
        invoiceStartNumber: data.invoiceStartNumber || undefined,
        defaultNotes: (data.defaultNotes || []).filter((n) => n.trim()),
        isDefault: data.isDefault,
        logoKey,
      };

      if (isEditMode && editingFirm) {
        await updateFirm({ id: editingFirm.id, data: dto }).unwrap();
        toast.success("Firm settings updated");
      } else {
        await createFirm(dto).unwrap();
        toast.success("Firm settings created");
      }

      onOpenChange(false);
    } catch (error: unknown) {
      console.error("Firm settings API error:", error);
      const fallback = isEditMode
        ? "Failed to update firm settings"
        : "Failed to create firm settings";
      let errorMessage = fallback;

      // RTK Query .unwrap() throws { status, data } where data is the response body
      const err = error as Record<string, unknown>;
      const data = err?.data as Record<string, unknown> | undefined;
      if (data && typeof data === "object") {
        const details = data.details as Record<string, unknown> | undefined;
        const msg = details?.message || data.message;
        if (Array.isArray(msg)) {
          errorMessage = msg[0];
        } else if (typeof msg === "string") {
          errorMessage = msg;
        }
      } else if (typeof err?.message === "string") {
        errorMessage = err.message;
      }
      toast.error(errorMessage);
    }
  };

  const onFormError = () => {
    const section = getFirstErrorSection(errors);
    if (section) {
      setExpandedSection(section);
    }
    toast.error("Please fix the errors in the form");
  };

  const handleAddNote = () => {
    setValue("defaultNotes", [...defaultNotes, ""]);
  };

  const handleUpdateNote = (index: number, value: string) => {
    const updated = [...defaultNotes];
    updated[index] = value;
    setValue("defaultNotes", updated);
  };

  const handleRemoveNote = (index: number) => {
    setValue(
      "defaultNotes",
      defaultNotes.filter((_, i) => i !== index)
    );
  };

  const handleRemoveImage = () => {
    imageCrop.removeCroppedImage();
    setValue("logoKey", "");
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? "" : section);
  };

  const existingLogoUrl =
    editingFirm?.logo || getCloudFrontUrl(watch("logoKey"));
  const displayLogo = imageCrop.croppedImage || existingLogoUrl;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[700px] max-h-[calc(100%-2rem)] sm:max-h-[85vh] md:max-h-[85vh] overflow-hidden p-0 gap-0 flex flex-col">
          {/* Header - pinned */}
          <div className="relative overflow-hidden p-4 sm:p-6 bg-gradient-to-br from-orange-50/50 to-pink-50/50 dark:from-white/5 dark:to-white/10 border-b border-orange-100/50 dark:border-white/10 flex-shrink-0">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-500/10 to-pink-500/10 dark:from-orange-400/10 dark:to-pink-400/10 blur-3xl -mr-16 -mt-16 rounded-full pointer-events-none"></div>
            <div className="relative flex items-center gap-3 sm:gap-4">
              <div className="p-2.5 sm:p-3 rounded-2xl bg-gradient-to-br from-orange-500 to-pink-600 shadow-lg shadow-orange-500/20">
                <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                  {isEditMode ? "Edit Firm" : "New Firm"}
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-muted-foreground font-medium">
                  {isEditMode
                    ? "Update firm details"
                    : "Add firm details for invoices"}
                </p>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit, onFormError)}
            className="flex flex-col flex-1 overflow-hidden"
          >
            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
              <div className="space-y-3 bg-white dark:bg-black/40 p-3 sm:p-4 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm dark:shadow-none">
                {/* Section 1: Basic Information */}
                <div className="space-y-3">
                  <SectionHeader
                    id="basic"
                    icon={Building2}
                    title="Basic Information"
                    subtitle="Firm name, contact, and logo"
                    isActive={expandedSection === "basic"}
                    hasErrors={hasBasicErrors}
                    onClick={toggleSection}
                  />
                  {expandedSection === "basic" && (
                    <div className="p-4 pt-2 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                      {/* Logo Upload */}
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium text-muted-foreground">
                          Firm Logo
                        </Label>
                        {!displayLogo ? (
                          <div className="relative">
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/jpeg,image/png,image/webp"
                              onChange={imageCrop.handleInputChange}
                              className="hidden"
                            />
                            <label
                              onClick={() => fileInputRef.current?.click()}
                              className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-300 group ${
                                imageCrop.error
                                  ? "border-red-300 dark:border-red-500/30 bg-red-50/50 dark:bg-red-500/5"
                                  : "border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10"
                              }`}
                            >
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <ImageIcon
                                  className={`h-8 w-8 mb-2 transition-colors ${
                                    imageCrop.error
                                      ? "text-red-400"
                                      : "text-muted-foreground group-hover:text-orange-500"
                                  }`}
                                />
                                <p className="text-xs text-muted-foreground">
                                  <span className="font-semibold">
                                    Click to upload
                                  </span>
                                </p>
                                <p className="text-[10px] text-muted-foreground mt-1">
                                  JPG, PNG, WebP (Max 1MB)
                                </p>
                              </div>
                            </label>
                            {imageCrop.error && (
                              <p className="text-xs text-red-500 dark:text-red-400 mt-1.5 flex items-center gap-1">
                                <AlertCircle className="h-3 w-3 flex-shrink-0" />
                                {imageCrop.error}
                              </p>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="relative w-full h-32 border-2 border-gray-200 dark:border-white/10 rounded-lg overflow-hidden bg-gray-50/50 dark:bg-white/5">
                              {imageCrop.croppedImage ? (
                                <NextImage
                                  src={imageCrop.croppedImage}
                                  alt="Firm logo preview"
                                  fill
                                  className="object-contain"
                                />
                              ) : (
                                <img
                                  src={existingLogoUrl || ""}
                                  alt="Firm logo"
                                  className="w-full h-full object-contain"
                                />
                              )}
                              <div className="absolute top-2 right-2 flex gap-2 z-10">
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => fileInputRef.current?.click()}
                                  className="h-8 px-2 shadow-lg"
                                >
                                  <Edit2 className="h-3 w-3" />
                                </Button>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="destructive"
                                  onClick={handleRemoveImage}
                                  className="h-8 px-2 shadow-lg"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                              <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={imageCrop.handleInputChange}
                                className="hidden"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label className="text-xs font-medium text-muted-foreground">
                            Firm Name *
                          </Label>
                          <Input
                            {...register("name")}
                            placeholder="e.g. Griha Architects"
                            className={`h-10 ${errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                          />
                          {errors.name && (
                            <p className="text-xs text-red-500 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3 flex-shrink-0" />
                              {errors.name.message}
                            </p>
                          )}
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs font-medium text-muted-foreground">
                            Email *
                          </Label>
                          <Input
                            type="email"
                            {...register("email")}
                            placeholder="firm@example.com"
                            className={`h-10 ${errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                          />
                          {errors.email && (
                            <p className="text-xs text-red-500 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3 flex-shrink-0" />
                              {errors.email.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label className="text-xs font-medium text-muted-foreground">
                            Phone *
                          </Label>
                          <Input
                            {...register("phone")}
                            placeholder="+91 98765 43210"
                            className={`h-10 ${errors.phone ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                          />
                          {errors.phone && (
                            <p className="text-xs text-red-500 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3 flex-shrink-0" />
                              {errors.phone.message}
                            </p>
                          )}
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs font-medium text-muted-foreground">
                            Alternate Phone
                          </Label>
                          <Input
                            {...register("alternatePhone")}
                            placeholder="+91 98765 43211"
                            className={`h-10 ${errors.alternatePhone ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                          />
                          {errors.alternatePhone && (
                            <p className="text-xs text-red-500 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3 flex-shrink-0" />
                              {errors.alternatePhone.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium text-muted-foreground">
                          Website
                        </Label>
                        <Input
                          {...register("website")}
                          placeholder="https://www.example.com"
                          className={`h-10 ${errors.website ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                        />
                        {errors.website && (
                          <p className="text-xs text-red-500 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3 flex-shrink-0" />
                            {errors.website.message}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <Separator className="bg-gray-100 dark:bg-white/5" />

                {/* Section 2: Address */}
                <div className="space-y-3">
                  <SectionHeader
                    id="address"
                    icon={MapPin}
                    title="Address & Location"
                    subtitle="Firm address details"
                    isActive={expandedSection === "address"}
                    hasErrors={hasAddressErrors}
                    onClick={toggleSection}
                  />
                  {expandedSection === "address" && (
                    <div className="p-4 pt-2 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium text-muted-foreground">
                          Address *
                        </Label>
                        <Input
                          {...register("address")}
                          placeholder="Street address"
                          className={`h-10 ${errors.address ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                        />
                        {errors.address && (
                          <p className="text-xs text-red-500 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3 flex-shrink-0" />
                            {errors.address.message}
                          </p>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label className="text-xs font-medium text-muted-foreground">
                            City *
                          </Label>
                          <Input
                            {...register("city")}
                            placeholder="City"
                            className={`h-10 ${errors.city ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                          />
                          {errors.city && (
                            <p className="text-xs text-red-500 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3 flex-shrink-0" />
                              {errors.city.message}
                            </p>
                          )}
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs font-medium text-muted-foreground">
                            State *
                          </Label>
                          <Input
                            {...register("state")}
                            placeholder="State"
                            className={`h-10 ${errors.state ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                          />
                          {errors.state && (
                            <p className="text-xs text-red-500 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3 flex-shrink-0" />
                              {errors.state.message}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium text-muted-foreground">
                          Country
                        </Label>
                        <Input
                          {...register("country")}
                          placeholder="India"
                          className="h-10"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <Separator className="bg-gray-100 dark:bg-white/5" />

                {/* Section 3: Invoice Settings */}
                <div className="space-y-3">
                  <SectionHeader
                    id="invoice"
                    icon={FileText}
                    title="Invoice Settings"
                    subtitle="Prefix, numbering, and default notes"
                    isActive={expandedSection === "invoice"}
                    hasErrors={hasInvoiceErrors}
                    onClick={toggleSection}
                  />
                  {expandedSection === "invoice" && (
                    <div className="p-4 pt-2 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label className="text-xs font-medium text-muted-foreground">
                            Invoice Prefix
                          </Label>
                          <Input
                            {...register("invoicePrefix")}
                            placeholder="INV"
                            className="h-10"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs font-medium text-muted-foreground">
                            Start Number
                          </Label>
                          <Input
                            type="number"
                            min={1}
                            {...register("invoiceStartNumber")}
                            className={`h-10 ${errors.invoiceStartNumber ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                          />
                          {errors.invoiceStartNumber && (
                            <p className="text-xs text-red-500 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3 flex-shrink-0" />
                              {errors.invoiceStartNumber.message}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Default Notes */}
                      <div className="space-y-3">
                        <Label className="text-xs font-medium text-muted-foreground">
                          Default Invoice Notes
                        </Label>
                        {defaultNotes.map((note, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground w-5 text-right flex-shrink-0">
                              {index + 1}.
                            </span>
                            <Input
                              value={note}
                              onChange={(e) =>
                                handleUpdateNote(index, e.target.value)
                              }
                              placeholder="Enter note..."
                              className="flex-1 h-10 text-sm"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 flex-shrink-0 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                              onClick={() => handleRemoveNote(index)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleAddNote}
                          className="text-xs"
                        >
                          <Plus className="h-3.5 w-3.5 mr-1" />
                          Add Note
                        </Button>
                      </div>

                      {/* Is Default */}
                      <div className="flex items-center space-x-2 pt-2">
                        <Checkbox
                          id="firmIsDefault"
                          checked={isDefault}
                          onCheckedChange={(checked) =>
                            setValue("isDefault", checked === true)
                          }
                        />
                        <Label
                          htmlFor="firmIsDefault"
                          className="text-xs font-medium text-muted-foreground cursor-pointer"
                        >
                          Set as default firm for invoices
                        </Label>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer - pinned */}
            <div className="flex items-center justify-end gap-3 px-4 sm:px-6 py-3 sm:py-4 border-t flex-shrink-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {isEditMode ? "Updating..." : "Creating..."}
                  </>
                ) : isEditMode ? (
                  "Update Firm"
                ) : (
                  "Create Firm"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Image Crop Dialog */}
      {imageCrop.originalImage && (
        <ImageCropDialog
          open={imageCrop.isDialogOpen}
          onOpenChange={imageCrop.setIsDialogOpen}
          imageSrc={imageCrop.originalImage}
          onCropComplete={imageCrop.handleCropComplete}
          aspectRatio={1}
          title="Crop Firm Logo"
          description="Adjust the crop area for your firm logo"
        />
      )}
    </>
  );
}

// Section Header matching AddClientForm SectionHeader style
function SectionHeader({
  id,
  icon: Icon,
  title,
  subtitle,
  isActive,
  hasErrors,
  onClick,
}: {
  id: string;
  icon: React.ElementType;
  title: string;
  subtitle: string;
  isActive: boolean;
  hasErrors?: boolean;
  onClick: (id: string) => void;
}) {
  const getContainerClass = () => {
    if (hasErrors) {
      return "bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-900/50";
    }
    if (isActive) {
      return "bg-white/70 dark:bg-white/5 border-orange-500/20 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_0_20px_rgba(0,0,0,0.3)]";
    }
    return "border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5";
  };

  const getIconClass = () => {
    if (hasErrors) {
      return "bg-red-500/10 dark:bg-red-500/20 border-red-500/30 text-red-600 dark:text-red-400";
    }
    if (isActive) {
      return "bg-orange-500/10 dark:bg-orange-500/20 border-orange-500/30 text-orange-600 dark:text-orange-400";
    }
    return "bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/10 text-muted-foreground";
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between p-4 cursor-pointer transition-all border rounded-xl",
        getContainerClass()
      )}
      onClick={() => onClick(id)}
    >
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "p-2.5 rounded-xl border transition-all",
            getIconClass()
          )}
        >
          {hasErrors ? (
            <AlertCircle className="w-5 h-5" />
          ) : (
            <Icon className="w-5 h-5" />
          )}
        </div>
        <div>
          <h3 className="font-semibold text-foreground text-sm tracking-tight">
            {title}
          </h3>
          <p
            className={cn(
              "text-xs",
              hasErrors
                ? "text-red-600 dark:text-red-400"
                : "text-muted-foreground"
            )}
          >
            {hasErrors ? "Please fix errors" : subtitle}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {hasErrors && (
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
            <AlertCircle className="w-3 h-3 text-red-600 dark:text-red-400" />
            Error
          </div>
        )}
        {isActive ? (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        )}
      </div>
    </div>
  );
}
