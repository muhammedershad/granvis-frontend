import { useState } from "react";
import {
  FieldErrors,
  UseFormClearErrors,
  UseFormRegister,
  UseFormSetError,
  UseFormSetValue,
  UseFormTrigger,
} from "react-hook-form";
import NextImage from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type CreateClientFormData } from "@/lib/validations/client";
import {
  AlertCircle,
  Edit2,
  Image as ImageIcon,
  Loader2,
  X,
} from "lucide-react";
import { ImageCropDialog } from "@/components/ui/ImageCropDialog";
import { useImageCrop } from "@/hooks/useImageCrop";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { clientsApi } from "@/lib/api/clientsApi";

interface PersonalSectionProps {
  register: UseFormRegister<CreateClientFormData>;
  setValue: UseFormSetValue<CreateClientFormData>;
  trigger: UseFormTrigger<CreateClientFormData>;
  setError: UseFormSetError<CreateClientFormData>;
  clearErrors: UseFormClearErrors<CreateClientFormData>;
  errors: FieldErrors<CreateClientFormData>;
  genderValue: string;
  formData: CreateClientFormData;
  onGenderChange: (value: string) => void;
  onImageChange?: (
    file: File | null,
    preview: string | null,
    blob: Blob | null
  ) => void;
}

export function PersonalSectionWithCrop({
  register,
  setValue,
  trigger,
  setError,
  clearErrors,
  errors,
  genderValue,
  formData,
  onGenderChange,
  onImageChange,
}: PersonalSectionProps) {
  const [isCheckingPhone, setIsCheckingPhone] = useState(false);

  // Use lazy query hook for phone availability check
  const [checkPhoneTrigger] = clientsApi.useLazyCheckPhoneAvailabilityQuery();

  // Handle phone blur - validate and check uniqueness
  const handlePhoneBlur = async () => {
    // First validate with Zod schema
    const isValid = await trigger("phone");

    if (!isValid || !formData.phone) {
      return;
    }

    // If Zod validation passes, check phone availability in database
    setIsCheckingPhone(true);

    try {
      const result = await checkPhoneTrigger(formData.phone).unwrap();

      if (!result.available) {
        setError("phone", {
          type: "manual",
          message: result.message || "Phone number already exists",
        });
      } else {
        // Clear any previous phone errors if phone is available
        clearErrors("phone");
      }
    } catch (error) {
      console.error("Error checking phone availability:", error);
    } finally {
      setIsCheckingPhone(false);
    }
  };

  // Use the image crop hook
  const {
    originalImage,
    croppedImage,
    croppedBlob,
    imageFile,
    isDialogOpen,
    error: imageError,
    handleInputChange,
    handleCropComplete,
    setIsDialogOpen,
    removeCroppedImage,
    openCropDialog,
  } = useImageCrop({
    maxSizeInMB: 1,
    allowedFormats: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
    onError: (error) => {
      console.error("Image validation error:", error);
    },
  });

  const handleRemoveImage = () => {
    removeCroppedImage();
    if (onImageChange) {
      onImageChange(null, null, null);
    }
    setValue("avatar", "");
  };

  const handleCropCompleteWrapper = (blob: Blob, url: string) => {
    handleCropComplete(blob, url);
    // Notify parent component with blob for S3 upload
    if (imageFile && onImageChange) {
      onImageChange(imageFile, url, blob);
    }
    // Store the preview URL for display
    setValue("avatar", url);
  };

  return (
    <div className="p-4 pt-2 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
      {/* Image Crop Dialog */}
      {originalImage && (
        <ImageCropDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          imageSrc={originalImage}
          onCropComplete={handleCropCompleteWrapper}
          aspectRatio={1}
          circularCrop={false}
          title="Crop Client Photo"
          description="Adjust the crop area and zoom to get the perfect client photo"
        />
      )}

      {/* Personal Information Fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">
            First Name *
          </Label>
          <Input
            {...register("firstName")}
            placeholder="e.g. Liam"
            className="h-10"
            maxLength={50}
          />
          {errors.firstName && (
            <p className="text-[10px] text-red-500">
              {errors.firstName.message}
            </p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">
            Middle Name
          </Label>
          <Input
            {...register("middleName")}
            placeholder="e.g. James"
            className="h-10"
            maxLength={50}
          />
          {errors.middleName && (
            <p className="text-[10px] text-red-500">
              {errors.middleName.message}
            </p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">
            Last Name *
          </Label>
          <Input
            {...register("lastName")}
            placeholder="e.g. Chen"
            className="h-10"
            maxLength={50}
          />
          {errors.lastName && (
            <p className="text-[10px] text-red-500">
              {errors.lastName.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">
            Email Address
          </Label>
          <Input
            type="email"
            {...register("email")}
            placeholder="liam.chen@example.com"
            className="h-10"
          />
          {errors.email && (
            <p className="text-[10px] text-red-500">{errors.email.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">
            Phone Number *
          </Label>
          <div className="relative">
            <Input
              {...register("phone")}
              placeholder="+919876543210"
              className="h-10"
              onBlur={handlePhoneBlur}
            />
            {isCheckingPhone && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            )}
          </div>
          {errors.phone && (
            <p className="text-[10px] text-red-500">{errors.phone.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">
            Gender
          </Label>
          <Select value={genderValue} onValueChange={onGenderChange}>
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Select Identity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">
            Date of Birth
          </Label>
          <Input type="date" {...register("dateOfBirth")} className="h-10" />
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-xs font-medium text-muted-foreground">
          Client Photo
        </Label>

        {imageError && (
          <Alert variant="destructive" className="mb-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{imageError}</AlertDescription>
          </Alert>
        )}

        {!croppedImage ? (
          <div className="relative">
            <input
              id="clientPhoto"
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleInputChange}
              className="hidden"
            />
            <label
              htmlFor="clientPhoto"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-lg cursor-pointer bg-gray-50/50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-300 group"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <ImageIcon className="h-8 w-8 text-muted-foreground mb-2 group-hover:text-orange-500 transition-colors" />
                <p className="text-xs text-muted-foreground">
                  <span className="font-semibold">Click to upload</span>
                </p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  JPG, PNG, WebP (Max 1MB)
                </p>
              </div>
            </label>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="relative w-full h-48 border-2 border-gray-200 dark:border-white/10 rounded-lg overflow-hidden bg-gray-50/50 dark:bg-white/5">
              <NextImage
                src={croppedImage}
                alt="Client preview"
                fill
                className="object-contain"
              />
              <div className="absolute top-2 right-2 flex gap-2 z-10">
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={openCropDialog}
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
            </div>
            {croppedBlob && (
              <p className="text-[10px] text-muted-foreground">
                Image size: {(croppedBlob.size / 1024).toFixed(2)} KB
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
