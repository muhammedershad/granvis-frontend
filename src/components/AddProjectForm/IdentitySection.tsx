import {
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import NextImage from "next/image";
import { AlertCircle, Edit2, ImageIcon, X } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Alert, AlertDescription } from "../ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ProjectFormData } from "./schemas";
import { getCategoryOptions } from "./utils";

interface IdentitySectionProps {
  register: UseFormRegister<ProjectFormData>;
  errors: FieldErrors<ProjectFormData>;
  setValue: UseFormSetValue<ProjectFormData>;
  watch: UseFormWatch<ProjectFormData>;
  croppedImage: string | null;
  croppedBlob: Blob | null;
  imageError: string | null;
  onImageInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
  onOpenCropDialog: () => void;
}

export function IdentitySection({
  register,
  errors,
  setValue,
  watch,
  croppedImage,
  croppedBlob,
  imageError,
  onImageInputChange,
  onRemoveImage,
  onOpenCropDialog,
}: IdentitySectionProps) {
  const formData = {
    type: watch("type"),
    category: watch("category"),
    status: watch("status"),
    priority: watch("priority"),
  };

  return (
    <div className="p-4 pt-2 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
      {/* Project Name and Description */}
      <div className="space-y-6">
        <div className="space-y-3">
          <Label
            htmlFor="name"
            className="text-xs font-medium text-muted-foreground"
          >
            Project Name *
          </Label>
          <Input
            id="name"
            {...register("name")}
            placeholder="Modern Villa Residence"
            className="text-lg font-semibold bg-background"
          />
          {errors.name && (
            <p className="text-[10px] text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-3">
          <Label
            htmlFor="description"
            className="text-xs font-medium text-muted-foreground"
          >
            Project Description *
          </Label>
          <Textarea
            id="description"
            {...register("description")}
            placeholder="Describe the vision and key aspects..."
            className="min-h-[120px] bg-background"
          />
          {errors.description && (
            <p className="text-[10px] text-red-500">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <Label
              htmlFor="type"
              className="text-xs font-medium text-muted-foreground"
            >
              Project Type *
            </Label>
            <Select
              value={formData.type}
              onValueChange={(value) =>
                setValue(
                  "type",
                  value as "Villa" | "Commercial" | "Interior" | "Landscape"
                )
              }
            >
              <SelectTrigger className="bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Villa">Villa</SelectItem>
                <SelectItem value="Commercial">Commercial</SelectItem>
                <SelectItem value="Interior">Interior</SelectItem>
                <SelectItem value="Landscape">Landscape</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-3">
            <Label
              htmlFor="category"
              className="text-xs font-medium text-muted-foreground"
            >
              Category
            </Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setValue("category", value)}
            >
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {getCategoryOptions(formData.type).map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-3">
          <Label
            htmlFor="sqft"
            className="text-xs font-medium text-muted-foreground"
          >
            Area (Sqft)
          </Label>
          <Input
            id="sqft"
            type="number"
            {...register("sqft")}
            placeholder="Enter area in square feet"
            className="bg-background"
          />
          {errors.sqft && (
            <p className="text-[10px] text-red-500">{errors.sqft.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <Label
            htmlFor="priority"
            className="text-xs font-medium text-muted-foreground"
          >
            Priority
          </Label>
          <Select
            value={formData.priority}
            onValueChange={(value) =>
              setValue(
                "priority",
                value as "Low" | "Medium" | "High" | "Critical"
              )
            }
          >
            <SelectTrigger className="bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-3">
          <Label
            htmlFor="status"
            className="text-xs font-medium text-muted-foreground"
          >
            Status
          </Label>
          <Select
            value={formData.status}
            onValueChange={(value) =>
              setValue(
                "status",
                value as
                  | "Planning"
                  | "In Progress"
                  | "On Hold"
                  | "Completed"
                  | "Cancelled"
              )
            }
          >
            <SelectTrigger className="bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Planning">Planning</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="On Hold">On Hold</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Cover Image Section - At Bottom */}
      <div className="space-y-2">
        <Label className="text-xs font-medium text-muted-foreground">
          Cover Image
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
              id="cover-image"
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={onImageInputChange}
              className="hidden"
            />
            <label
              htmlFor="cover-image"
              className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-lg cursor-pointer bg-gray-50/50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-300 group"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <ImageIcon className="h-8 w-8 text-muted-foreground mb-2 group-hover:text-orange-500 transition-colors" />
                <p className="text-xs text-muted-foreground">
                  <span className="font-semibold">Click to upload cover image</span>
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
                alt="Project cover preview"
                fill
                className="object-contain"
              />
              <div className="absolute top-2 right-2 flex gap-2 z-10">
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={onOpenCropDialog}
                  className="h-8 px-2 shadow-lg"
                >
                  <Edit2 className="h-3 w-3" />
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  onClick={onRemoveImage}
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
