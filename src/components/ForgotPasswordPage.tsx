import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { 
  Mail, 
  ArrowLeft, 
  ArrowRight,
  Building2,
  Check,
  Clock,
  Send
} from "lucide-react";

interface ForgotPasswordPageProps {
  onBackToLogin: () => void;
  onResetPassword: (email: string) => void;
}

export function ForgotPasswordPage({ onBackToLogin, onResetPassword }: ForgotPasswordPageProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate sending email
    setTimeout(() => {
      onResetPassword(email);
      setIsEmailSent(true);
      setIsLoading(false);
    }, 1500);
  };

  const handleResendEmail = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background dark:from-gray-900 dark:via-black dark:to-gray-900 relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated background elements - only show in dark theme */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-0 dark:opacity-100 transition-opacity duration-500">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Light theme background pattern */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-100 dark:opacity-0 transition-opacity duration-500 bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-purple-50/50"></div>

      {/* Subtle grid overlay */}
      <div className="fixed inset-0 opacity-5 dark:opacity-5 pointer-events-none" style={{
        backgroundImage: `
          linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px'
      }}></div>

      {/* Main Content */}
      <div className="w-full max-w-md relative z-10">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl mb-4 relative">
            <Building2 className="w-8 h-8 text-white" />
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-2xl blur-lg"></div>
          </div>
          <h1 className="text-3xl text-foreground mb-2">Architectural Pro</h1>
          <p className="text-muted-foreground">Reset your password</p>
        </div>

        {/* Reset Password Card */}
        <Card className="bg-card/20 dark:bg-black/20 border-border backdrop-blur-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5"></div>
          
          <CardHeader className="relative z-10 text-center pb-6">
            {!isEmailSent ? (
              <>
                <CardTitle className="text-card-foreground text-xl">Forgot Password?</CardTitle>
                <p className="text-muted-foreground text-sm">
                  No worries! Enter your email address and we'll send you a reset link.
                </p>
              </>
            ) : (
              <>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
                  <Check className="w-8 h-8 text-green-400" />
                </div>
                <CardTitle className="text-card-foreground text-xl">Check Your Email</CardTitle>
                <p className="text-muted-foreground text-sm">
                  We've sent a password reset link to{" "}
                  <span className="text-purple-400">{email}</span>
                </p>
              </>
            )}
          </CardHeader>

          <CardContent className="relative z-10 space-y-6">
            {!isEmailSent ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-muted-foreground">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john@architecturalpro.com"
                      className="pl-10 bg-card/50 border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
                      required
                    />
                  </div>
                </div>

                {/* Send Reset Link Button */}
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
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Reset Link</span>
                      </>
                    )}
                  </span>
                </Button>
              </form>
            ) : (
              <div className="space-y-4">
                {/* Instructions */}
                <div className="space-y-3 text-center">
                  <div className="flex items-center justify-center space-x-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Link expires in 15 minutes</span>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Didn't receive the email? Check your spam folder or click below to resend.
                  </p>
                </div>

                {/* Resend Button */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResendEmail}
                  disabled={isLoading}
                  className="w-full bg-card/50 border-border text-muted-foreground hover:bg-card hover:text-foreground"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin mr-2"></div>
                      Resending...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 mr-2" />
                      Resend Email
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Back to Login */}
            <div className="text-center pt-4 border-t border-border">
              <Button
                type="button"
                variant="link"
                onClick={onBackToLogin}
                className="text-purple-400 hover:text-purple-300 p-0 h-auto group"
              >
                <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                Back to Sign In
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-muted-foreground/70 text-xs">
            Still having trouble? Contact our support team at{" "}
            <span className="text-purple-400">support@architecturalpro.com</span>
          </p>
        </div>
      </div>
    </div>
  );
}