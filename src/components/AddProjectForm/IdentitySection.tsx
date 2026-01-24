import {
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import NextImage from "next/image";
import { ImageIcon, X } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
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
  imagePreview: string | null;
  onImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
}

export function IdentitySection({
  register,
  errors,
  setValue,
  watch,
  imagePreview,
  onImageSelect,
  onRemoveImage,
}: IdentitySectionProps) {
  const formData = {
    type: watch("type"),
    category: watch("category"),
    status: watch("status"),
    priority: watch("priority"),
  };

  return (
    <div className="p-4 pt-2 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
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
        </div>

        <div className="space-y-3">
          <Label className="text-xs font-medium text-muted-foreground">
            Cover Image
          </Label>
          <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg bg-muted/20 overflow-hidden group">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="cover-image"
              onChange={onImageSelect}
            />
            {!imagePreview ? (
              <label
                htmlFor="cover-image"
                className="flex flex-col items-center justify-center h-64 cursor-pointer hover:bg-muted/40 transition-colors"
              >
                <div className="p-3 bg-muted rounded-full mb-3 group-hover:scale-110 transition-transform">
                  <ImageIcon className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground mb-1">
                  Upload cover image
                </p>
                <p className="text-xs text-muted-foreground/60">
                  PNG, JPG up to 5MB
                </p>
              </label>
            ) : (
              <div className="relative h-64">
                <NextImage
                  src={imagePreview}
                  alt="Project preview"
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={onRemoveImage}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors shadow-lg z-10"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
    </div>
  );
}
