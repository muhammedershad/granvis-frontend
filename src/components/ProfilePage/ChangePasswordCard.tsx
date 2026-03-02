"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  Check,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  X,
} from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useChangeMyPasswordMutation } from "@/lib/api/profileApi";
import {
  type ChangePasswordFormData,
  changePasswordSchema,
} from "@/lib/validations/profile";
import { toast } from "sonner";

function getPasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  let score = 0;
  if (password.length >= 8) {
    score++;
  }
  if (/[A-Z]/.test(password)) {
    score++;
  }
  if (/[a-z]/.test(password)) {
    score++;
  }
  if (/[0-9]/.test(password)) {
    score++;
  }
  if (/[^A-Za-z0-9]/.test(password)) {
    score++;
  }

  if (score <= 2) {
    return { score, label: "Weak", color: "bg-red-500" };
  }
  if (score <= 3) {
    return { score, label: "Fair", color: "bg-yellow-500" };
  }
  if (score <= 4) {
    return { score, label: "Good", color: "bg-blue-500" };
  }
  return { score, label: "Strong", color: "bg-green-500" };
}

const PASSWORD_RULES = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "One lowercase letter", test: (p: string) => /[a-z]/.test(p) },
  { label: "One number", test: (p: string) => /[0-9]/.test(p) },
  {
    label: "One special character",
    test: (p: string) => /[^A-Za-z0-9]/.test(p),
  },
];

export function ChangePasswordCard() {
  const [changePassword, { isLoading }] = useChangeMyPasswordMutation();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<ChangePasswordFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- zodResolver type compatibility with react-hook-form
    resolver: zodResolver(changePasswordSchema) as any,
    mode: "onBlur",
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = watch("newPassword") || "";
  const strength = getPasswordStrength(newPassword);

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }).unwrap();

      toast.success("Password changed successfully");
      reset();
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      const message = err?.data?.message || "Failed to change password";
      toast.error(message);
    }
  };

  return (
    <Card className="relative overflow-hidden backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 shadow-xl shadow-gray-200/50 dark:shadow-black/50">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 via-indigo-50/40 to-purple-50/60 opacity-100 dark:opacity-0 transition-opacity duration-300" />
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-cyan-500/5 opacity-0 dark:opacity-100 transition-opacity duration-300" />

      <CardContent className="relative z-10 p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 border border-purple-200/50 dark:border-purple-800/30">
            <Lock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground tracking-tight">
              Change Password
            </h3>
            <p className="text-xs text-muted-foreground">
              Update your account password
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Current Password */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">
                Current Password *
              </Label>
              <div className="relative">
                <Input
                  type={showCurrentPassword ? "text" : "password"}
                  {...register("currentPassword")}
                  placeholder="Enter current password"
                  className={`h-10 pr-10 ${errors.currentPassword ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showCurrentPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3 flex-shrink-0" />
                  {errors.currentPassword.message}
                </p>
              )}
            </div>

            {/* New Password */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">
                New Password *
              </Label>
              <div className="relative">
                <Input
                  type={showNewPassword ? "text" : "password"}
                  {...register("newPassword")}
                  placeholder="Enter new password"
                  className={`h-10 pr-10 ${errors.newPassword ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showNewPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3 flex-shrink-0" />
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">
                Confirm Password *
              </Label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirmPassword")}
                  placeholder="Confirm new password"
                  className={`h-10 pr-10 ${errors.confirmPassword ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3 flex-shrink-0" />
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          {/* Password Strength */}
          {newPassword.length > 0 && (
            <div className="space-y-3 rounded-lg bg-gray-50/80 dark:bg-white/5 border border-gray-100 dark:border-white/5 p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Password Strength
                </span>
                <span className="text-xs font-medium text-foreground">
                  {strength.label}
                </span>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className={`h-1.5 flex-1 rounded-full transition-colors ${
                      level <= strength.score
                        ? strength.color
                        : "bg-gray-200 dark:bg-white/10"
                    }`}
                  />
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                {PASSWORD_RULES.map((rule) => {
                  const passed = rule.test(newPassword);
                  return (
                    <div key={rule.label} className="flex items-center gap-1.5">
                      {passed ? (
                        <Check className="w-3 h-3 text-green-500" />
                      ) : (
                        <X className="w-3 h-3 text-muted-foreground" />
                      )}
                      <span
                        className={`text-xs ${
                          passed
                            ? "text-green-600 dark:text-green-400"
                            : "text-muted-foreground"
                        }`}
                      >
                        {rule.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 border-0 shadow-lg shadow-purple-200/50 dark:shadow-purple-500/25"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Changing...
                </>
              ) : (
                "Change Password"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
