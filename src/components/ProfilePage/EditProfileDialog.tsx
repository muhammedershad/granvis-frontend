"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader2, UserCog } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import {
  type UserProfile,
  useUpdateMyProfileMutation,
} from "@/lib/api/profileApi";
import {
  type UpdateProfileFormData,
  updateProfileSchema,
} from "@/lib/validations/profile";
import { useDispatch } from "react-redux";
import { type IAuthRoles, setUser } from "@/store/slices/authSlice";
import { toast } from "sonner";

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: UserProfile;
}

export function EditProfileDialog({
  open,
  onOpenChange,
  profile,
}: EditProfileDialogProps) {
  const dispatch = useDispatch();
  const [updateProfile, { isLoading }] = useUpdateMyProfileMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateProfileFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- zodResolver type compatibility with react-hook-form
    resolver: zodResolver(updateProfileSchema) as any,
    mode: "onBlur",
    defaultValues: {
      firstName: profile.firstName,
      lastName: profile.lastName,
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        firstName: profile.firstName,
        lastName: profile.lastName,
      });
    }
  }, [open, profile, reset]);

  const onSubmit = async (data: UpdateProfileFormData) => {
    try {
      const result = await updateProfile({
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
      }).unwrap();

      // Update Redux auth state
      if (result.user) {
        dispatch(
          setUser({
            _id: result.user._id,
            email: result.user.email,
            firstName: result.user.firstName,
            lastName: result.user.lastName,
            avatar: result.user.avatar,
            avatarKey: result.user.avatarKey,
            isActive: result.user.isActive,
            role: result.user.role as IAuthRoles,
            username: result.user.username,
          })
        );
      }

      toast.success("Profile updated successfully");
      onOpenChange(false);
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      const message = err?.data?.message || "Failed to update profile";
      toast.error(message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="top-1/2 -translate-y-1/2 sm:top-1/2 sm:max-w-[500px] max-h-[calc(100%-2rem)] sm:max-h-[85vh] overflow-hidden p-0 gap-0 flex flex-col">
        {/* Header */}
        <div className="relative overflow-hidden p-4 sm:p-6 bg-gradient-to-br from-purple-50/50 to-blue-50/50 dark:from-white/5 dark:to-white/10 border-b border-purple-100/50 dark:border-white/10 flex-shrink-0">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-500/10 to-blue-500/10 dark:from-purple-400/10 dark:to-blue-400/10 blur-3xl -mr-16 -mt-16 rounded-full pointer-events-none" />
          <DialogHeader className="relative">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 shadow-lg shadow-purple-500/20">
                <UserCog className="w-6 h-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
                  Edit Profile
                </DialogTitle>
                <DialogDescription className="text-xs text-gray-500 dark:text-muted-foreground font-medium">
                  Update your personal information
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col flex-1 overflow-hidden"
        >
          {/* Form body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="space-y-4">
              {/* First Name */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">
                  First Name *
                </Label>
                <Input
                  {...register("firstName")}
                  placeholder="Enter first name"
                  className={`h-10 ${errors.firstName ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                />
                {errors.firstName && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 flex-shrink-0" />
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">
                  Last Name *
                </Label>
                <Input
                  {...register("lastName")}
                  placeholder="Enter last name"
                  className={`h-10 ${errors.lastName ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                />
                {errors.lastName && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 flex-shrink-0" />
                    {errors.lastName.message}
                  </p>
                )}
              </div>

              <Separator className="bg-gray-100 dark:bg-white/5" />

              {/* Non-editable fields info */}
              <div className="rounded-lg bg-gray-50/80 dark:bg-white/5 border border-gray-100 dark:border-white/5 p-3">
                <p className="text-xs text-muted-foreground">
                  Email, phone, role, and account status cannot be changed from
                  here. Contact an administrator for these changes.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-4 sm:px-6 py-3 sm:py-4 border-t flex-shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 border-0 shadow-lg shadow-purple-200/50 dark:shadow-purple-500/25"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
