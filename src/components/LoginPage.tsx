"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { useLoginMutation } from "@/lib/api/apiSlice";
import { setCredentials } from "@/store/slices/authSlice";
import { setCookie } from "@/lib/cookies";
import { type LoginFormData, loginSchema } from "@/lib/validations/auth";
import { Alert, AlertDescription } from "./ui/alert";

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const isSubmitting = isLoading || isNavigating;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await login(data).unwrap();

      // Keep loading state seamlessly through post-login steps
      setIsNavigating(true);

      // Store tokens in cookies
      setCookie("accessToken", response?.tokens?.accessToken, 1); // 1 day
      setCookie("refreshToken", response?.tokens?.refreshToken, 7); // 7 days

      // Store user in Redux
      dispatch(
        setCredentials({
          user: response.user,
        })
      );

      // Small delay to ensure Redux persist saves the state before navigation
      await new Promise((resolve) => setTimeout(resolve, 150));

      // Role-based navigation
      const userRole = response.user?.role;
      let dashboardRoute = "/dashboard";

      switch (userRole) {
        case "super_admin":
          dashboardRoute = "/super-admin/dashboard";
          break;
        case "admin":
          dashboardRoute = "/admin/dashboard";
          break;
        case "manager":
          dashboardRoute = "/manager/dashboard";
          break;
        case "accountant":
          dashboardRoute = "/accountant/dashboard";
          break;
        case "employee":
          dashboardRoute = "/employee/dashboard";
          break;
        default:
          dashboardRoute = "/dashboard";
      }

      // Navigate to role-specific dashboard
      router.push(dashboardRoute);
    } catch (err: unknown) {
      console.error("Login failed:", err);

      // Handle specific error messages from backend
      const error = err as { data?: { message?: string } };
      if (error?.data?.message) {
        setError("root", {
          type: "manual",
          message: error.data.message,
        });
      } else {
        setError("root", {
          type: "manual",
          message: "Login failed. Please check your credentials and try again.",
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background dark:from-gray-900 dark:via-black dark:to-gray-900 relative overflow-hidden flex items-center justify-center p-4">
      {/* Theme toggle positioned in top-right */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      {/* Animated background elements - dark theme */}
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

      {/* Animated background elements - light theme */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-100 dark:opacity-0 transition-opacity duration-500 bg-gradient-to-br from-purple-100/80 via-blue-50/60 to-indigo-100/80">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-300/40 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute top-3/4 right-1/4 w-96 h-96 bg-blue-300/40 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-cyan-300/30 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-md relative z-10">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="inline-block mb-4 relative">
            {/* Dark theme logo (white version) */}
            <Image
              src="/logo-dark-theme.png"
              alt="Griha Architects"
              width={200}
              height={200}
              className="hidden dark:block"
              priority
            />
            {/* Light theme logo (dark version) */}
            <Image
              src="/logo-light-theme.png"
              alt="Griha Architects"
              width={200}
              height={200}
              className="block dark:hidden"
              priority
            />
          </div>
          <h1 className="text-3xl text-foreground mb-1">
            Griha Architects and Builders
          </h1>
          <p className="text-muted-foreground">
            Welcome back to your application
          </p>
        </div>

        {/* Login Card */}
        <Card className="bg-card/20 dark:bg-black/20 border-border backdrop-blur-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5"></div>

          <CardHeader className="relative z-10 text-center pb-6">
            <CardTitle className="text-card-foreground text-xl">
              Sign In
            </CardTitle>
            <p className="text-muted-foreground text-sm">
              Enter your credentials to access your account
            </p>
          </CardHeader>

          <CardContent className="relative z-10 space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Root Error Alert */}
              {errors.root && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.root.message}</AlertDescription>
                </Alert>
              )}

              {/* Email Field */}
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

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-muted-foreground">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    placeholder="Enter your password"
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

              {/* Forgot Password Link */}
              <div className="flex justify-end">
                <Link
                  href="/reset-password"
                  className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border-0 h-11 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="relative flex items-center justify-center space-x-2">
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </span>
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="space-y-2">
            <div className="inline-flex items-center justify-center w-8 h-8 bg-purple-500/20 rounded-lg">
              <Shield className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-muted-foreground text-xs">Secure</p>
          </div>
          <div className="space-y-2">
            <div className="inline-flex items-center justify-center w-8 h-8 bg-blue-500/20 rounded-lg">
              <Zap className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-muted-foreground text-xs">Fast</p>
          </div>
          <div className="space-y-2">
            <div className="inline-flex items-center justify-center w-8 h-8 bg-cyan-500/20 rounded-lg">
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-muted-foreground text-xs">Modern</p>
          </div>
        </div>
      </div>
    </div>
  );
}
