"use client";

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  Mail,
  ShieldOff,
  Timer,
  UserX,
  X,
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import {
  useForgotPasswordMutation,
  useResetPasswordMutation,
} from "@/lib/api/apiSlice";
import {
  type ForgotPasswordFormData,
  type ResetPasswordFormData,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "@/lib/validations/auth";
import { Alert, AlertDescription } from "./ui/alert";

type Step = "EMAIL" | "RESET" | "SUCCESS";

function getErrorIcon(errorType: string | null) {
  switch (errorType) {
    case "not_found":
      return <UserX className="h-4 w-4" />;
    case "deactivated":
      return <ShieldOff className="h-4 w-4" />;
    case "throttled":
      return <Timer className="h-4 w-4" />;
    default:
      return <AlertCircle className="h-4 w-4" />;
  }
}

// --- EmailForm ---
const EmailForm = memo(
  ({ onSuccess }: { onSuccess: (email: string) => void }) => {
    const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
    const errorTypeRef = useRef<
      "not_found" | "deactivated" | "throttled" | "generic" | null
    >(null);

    const {
      register,
      handleSubmit,
      formState: { errors },
      setError,
      clearErrors,
    } = useForm<ForgotPasswordFormData>({
      resolver: zodResolver(forgotPasswordSchema),
      defaultValues: { email: "" },
    });

    const onSubmit = async (data: ForgotPasswordFormData) => {
      clearErrors("root");
      errorTypeRef.current = null;
      try {
        await forgotPassword(data).unwrap();
        onSuccess(data.email);
      } catch (err: unknown) {
        const error = err as { status?: number; data?: { message?: string } };
        const status = error?.status;
        const message = error?.data?.message;

        if (status === 404) {
          errorTypeRef.current = "not_found";
          setError("root", {
            type: "manual",
            message: message || "User with this email does not exist.",
          });
        } else if (status === 403) {
          errorTypeRef.current = "deactivated";
          setError("root", {
            type: "manual",
            message:
              message ||
              "Your account is deactivated. Please contact your administrator.",
          });
        } else if (status === 429) {
          errorTypeRef.current = "throttled";
          setError("root", {
            type: "manual",
            message:
              "Too many attempts. Please wait a minute before trying again.",
          });
        } else {
          errorTypeRef.current = "generic";
          setError("root", {
            type: "manual",
            message: message || "Failed to send OTP. Please try again.",
          });
        }
      }
    };

    return (
      <>
        <CardHeader className="relative z-10 text-center pb-6">
          <CardTitle className="text-card-foreground text-xl">
            Forgot Password
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            Enter your email to receive a verification code
          </p>
        </CardHeader>

        <CardContent className="relative z-10 space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div
              className={`grid transition-all duration-300 ease-in-out ${
                errors.root
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <Alert variant="destructive" className="mb-0">
                  {getErrorIcon(errorTypeRef.current)}
                  <AlertDescription>
                    {errors.root?.message}
                    {errorTypeRef.current === "deactivated" && (
                      <span className="block mt-1 text-xs">
                        Please contact your administrator to reactivate your
                        account.
                      </span>
                    )}
                  </AlertDescription>
                </Alert>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-muted-foreground">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="john@architecturalpro.com"
                  className={`pl-10 bg-card/50 border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 ${
                    errors.email
                      ? "border-red-500 focus:ring-red-500/50 focus:border-red-500/50"
                      : ""
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.email.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border-0 h-11 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="relative flex items-center justify-center space-x-2">
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Sending OTP...</span>
                  </>
                ) : (
                  <>
                    <span>Send OTP</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </span>
            </Button>
          </form>

          <div className="text-center">
            <Link
              href="/sign-in"
              className="text-sm text-purple-400 hover:text-purple-300 transition-colors inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3 h-3" />
              Back to Login
            </Link>
          </div>
        </CardContent>
      </>
    );
  }
);
EmailForm.displayName = "EmailForm";

// --- ResetForm (OTP + New Password) ---
const ResetForm = memo(
  ({
    email,
    onSuccess,
    onBack,
  }: {
    email: string;
    onSuccess: () => void;
    onBack: () => void;
  }) => {
    const [resetPassword, { isLoading }] = useResetPasswordMutation();
    const [forgotPassword, { isLoading: isResending }] =
      useForgotPasswordMutation();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [resendCountdown, setResendCountdown] = useState(30);

    useEffect(() => {
      if (resendCountdown <= 0) {
        return;
      }
      const timer = setInterval(() => {
        setResendCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }, [resendCountdown]);

    const handleResend = async () => {
      try {
        await forgotPassword({ email }).unwrap();
        setResendCountdown(30);
      } catch {
        // Silently fail resend — user can try again
      }
    };

    const {
      register,
      handleSubmit,
      control,
      watch,
      formState: { errors },
      setError,
    } = useForm<ResetPasswordFormData>({
      resolver: zodResolver(resetPasswordSchema),
      defaultValues: { otp: "", password: "", confirmPassword: "" },
    });

    const passwordValue = watch("password", "");

    const passwordRules = [
      { label: "At least 8 characters", met: passwordValue.length >= 8 },
      { label: "One uppercase letter", met: /[A-Z]/.test(passwordValue) },
      { label: "One lowercase letter", met: /[a-z]/.test(passwordValue) },
      { label: "One number", met: /[0-9]/.test(passwordValue) },
      {
        label: "One special character",
        met: /[^A-Za-z0-9]/.test(passwordValue),
      },
    ];

    const onSubmit = async (data: ResetPasswordFormData) => {
      try {
        await resetPassword({
          email,
          otp: data.otp,
          password: data.password,
        }).unwrap();
        onSuccess();
      } catch (err: unknown) {
        const error = err as { data?: { message?: string } };
        setError("root", {
          type: "manual",
          message:
            error?.data?.message ||
            "Failed to reset password. Please try again.",
        });
      }
    };

    return (
      <>
        <CardHeader className="relative z-10 text-center pb-6">
          <CardTitle className="text-card-foreground text-xl">
            Reset Password
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            Enter the OTP sent to{" "}
            <span className="text-foreground font-medium">{email}</span> and set
            your new password
          </p>
        </CardHeader>

        <CardContent className="relative z-10 space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div
              className={`grid transition-all duration-300 ease-in-out ${
                errors.root
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <Alert variant="destructive" className="mb-0">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.root?.message}</AlertDescription>
                </Alert>
              </div>
            </div>

            {/* OTP Field */}
            <div className="space-y-2">
              <Label className="text-muted-foreground">Verification Code</Label>
              <div className="flex justify-center">
                <Controller
                  name="otp"
                  control={control}
                  render={({ field }) => (
                    <InputOTP
                      maxLength={6}
                      value={field.value}
                      onChange={field.onChange}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  )}
                />
              </div>
              {errors.otp && (
                <p className="text-red-500 text-sm flex items-center justify-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.otp.message}
                </p>
              )}
              <div className="text-center">
                {resendCountdown > 0 ? (
                  <p className="text-muted-foreground text-sm">
                    Resend OTP in {resendCountdown}s
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={isResending}
                    className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    {isResending ? "Sending..." : "Resend OTP"}
                  </button>
                )}
              </div>
            </div>

            {/* New Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-muted-foreground">
                New Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="Enter new password"
                  className={`pl-10 pr-10 bg-card/50 border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 ${
                    errors.password
                      ? "border-red-500 focus:ring-red-500/50 focus:border-red-500/50"
                      : ""
                  }`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground h-8 w-8"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Password Rules Checklist */}
            {passwordValue.length > 0 && (
              <div className="space-y-1">
                {passwordRules.map((rule) => (
                  <div
                    key={rule.label}
                    className="flex items-center gap-2 text-sm"
                  >
                    {rule.met ? (
                      <Check className="w-3 h-3 text-green-500" />
                    ) : (
                      <X className="w-3 h-3 text-muted-foreground" />
                    )}
                    <span
                      className={
                        rule.met ? "text-green-500" : "text-muted-foreground"
                      }
                    >
                      {rule.label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-muted-foreground"
              >
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirmPassword")}
                  placeholder="Confirm new password"
                  className={`pl-10 pr-10 bg-card/50 border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 ${
                    errors.confirmPassword
                      ? "border-red-500 focus:ring-red-500/50 focus:border-red-500/50"
                      : ""
                  }`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground h-8 w-8"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border-0 h-11 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="relative flex items-center justify-center space-x-2">
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Resetting Password...</span>
                  </>
                ) : (
                  <>
                    <span>Reset Password</span>
                    <KeyRound className="w-4 h-4" />
                  </>
                )}
              </span>
            </Button>
          </form>

          <div className="text-center">
            <button
              type="button"
              onClick={onBack}
              className="text-sm text-purple-400 hover:text-purple-300 transition-colors inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3 h-3" />
              Back
            </button>
          </div>
        </CardContent>
      </>
    );
  }
);
ResetForm.displayName = "ResetForm";

// --- SuccessView ---
const SuccessView = memo(() => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/sign-in");
    }, 5000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <>
      <CardHeader className="relative z-10 text-center pb-6">
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl relative">
            <CheckCircle2 className="w-8 h-8 text-white" />
            <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-2xl blur-lg"></div>
          </div>
        </div>
        <CardTitle className="text-card-foreground text-xl">
          Password Reset Successful
        </CardTitle>
        <p className="text-muted-foreground text-sm">
          Your password has been reset successfully. You can now sign in with
          your new password.
        </p>
      </CardHeader>

      <CardContent className="relative z-10 space-y-6">
        <Button
          onClick={() => router.push("/sign-in")}
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border-0 h-11 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <span className="relative flex items-center justify-center space-x-2">
            <span>Go to Login</span>
            <ArrowRight className="w-4 h-4" />
          </span>
        </Button>
        <p className="text-center text-muted-foreground text-xs">
          You will be redirected automatically in a few seconds...
        </p>
      </CardContent>
    </>
  );
});
SuccessView.displayName = "SuccessView";

// --- Static background (never re-renders) ---
const PageBackground = memo(() => {
  return (
    <>
      {/* Theme toggle positioned in top-right */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      {/* Animated background elements - only show in dark theme */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-0 dark:opacity-100 transition-opacity duration-500">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute top-3/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Light theme background pattern */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-100 dark:opacity-0 transition-opacity duration-500 bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-purple-50/50"></div>

      {/* Subtle grid overlay */}
      <div
        className="fixed inset-0 opacity-5 dark:opacity-5 pointer-events-none"
        style={{
          backgroundImage: `
          linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px)
        `,
          backgroundSize: "50px 50px",
        }}
      ></div>
    </>
  );
});
PageBackground.displayName = "PageBackground";

// --- Static logo/brand (never re-renders) ---
const PageHeader = memo(() => {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl mb-4 relative">
        <Building2 className="w-8 h-8 text-white" />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-2xl blur-lg"></div>
      </div>
      <h1 className="text-3xl text-foreground mb-2">Griha Architects</h1>
      <p className="text-muted-foreground">Reset your password</p>
    </div>
  );
});
PageHeader.displayName = "PageHeader";

// --- Main ResetPasswordPage ---
export function ResetPasswordPage() {
  const [step, setStep] = useState<Step>("EMAIL");
  const [email, setEmail] = useState("");

  const handleEmailSuccess = useCallback((submittedEmail: string) => {
    setEmail(submittedEmail);
    setStep("RESET");
  }, []);

  const handleResetSuccess = useCallback(() => {
    setStep("SUCCESS");
  }, []);

  const handleBack = useCallback(() => {
    setStep("EMAIL");
  }, []);

  const stepContent = useMemo(() => {
    switch (step) {
      case "EMAIL":
        return <EmailForm onSuccess={handleEmailSuccess} />;
      case "RESET":
        return (
          <ResetForm
            email={email}
            onSuccess={handleResetSuccess}
            onBack={handleBack}
          />
        );
      case "SUCCESS":
        return <SuccessView />;
    }
  }, [step, email, handleEmailSuccess, handleResetSuccess, handleBack]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background dark:from-gray-900 dark:via-black dark:to-gray-900 relative overflow-hidden flex items-center justify-center p-4">
      <PageBackground />

      {/* Main Content */}
      <div className="w-full max-w-md relative z-10">
        <PageHeader />

        {/* Reset Password Card */}
        <Card className="bg-card/20 dark:bg-black/20 border-border backdrop-blur-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5"></div>
          {stepContent}
        </Card>
      </div>
    </div>
  );
}
