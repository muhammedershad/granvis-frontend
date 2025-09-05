import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { 
  Mail, 
  ArrowLeft, 
  Building2,
  Check,
  X,
  Clock,
  RefreshCw,
  Shield,
  AlertCircle
} from "lucide-react";

interface VerifyEmailPageProps {
  email: string;
  onBackToLogin: () => void;
  onResendEmail: () => void;
  onVerificationComplete: () => void;
}

type VerificationStatus = 'pending' | 'success' | 'error' | 'expired';

export function VerifyEmailPage({ 
  email, 
  onBackToLogin, 
  onResendEmail, 
  onVerificationComplete 
}: VerifyEmailPageProps) {
  const [status, setStatus] = useState<VerificationStatus>('pending');
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Simulate email verification status check
  useEffect(() => {
    const timer = setTimeout(() => {
      // Randomly simulate verification for demo
      const random = Math.random();
      if (random > 0.7) {
        setStatus('success');
        setTimeout(() => {
          onVerificationComplete();
        }, 2000);
      } else if (random > 0.5) {
        setStatus('error');
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [onVerificationComplete]);

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleResendEmail = async () => {
    setIsResending(true);
    setCanResend(false);
    setCountdown(60);
    
    setTimeout(() => {
      onResendEmail();
      setIsResending(false);
    }, 1000);
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return <Check className="w-8 h-8 text-green-400" />;
      case 'error':
        return <X className="w-8 h-8 text-red-400" />;
      case 'expired':
        return <Clock className="w-8 h-8 text-yellow-400" />;
      default:
        return <Mail className="w-8 h-8 text-blue-400" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'from-green-500/10 to-emerald-500/10';
      case 'error':
        return 'from-red-500/10 to-pink-500/10';
      case 'expired':
        return 'from-yellow-500/10 to-orange-500/10';
      default:
        return 'from-blue-500/10 to-cyan-500/10';
    }
  };

  const getStatusTitle = () => {
    switch (status) {
      case 'success':
        return 'Email Verified!';
      case 'error':
        return 'Verification Failed';
      case 'expired':
        return 'Link Expired';
      default:
        return 'Check Your Email';
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'success':
        return 'Your email has been successfully verified. Redirecting to dashboard...';
      case 'error':
        return 'The verification link is invalid or has already been used. Please request a new one.';
      case 'expired':
        return 'The verification link has expired. Please request a new verification email.';
      default:
        return `We've sent a verification email to ${email}. Click the link in the email to verify your account.`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Subtle grid overlay */}
      <div className="fixed inset-0 opacity-5 pointer-events-none" style={{
        backgroundImage: `
          linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
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
          <h1 className="text-3xl text-white/90 mb-2">Architectural Pro</h1>
          <p className="text-white/60">Verify your email address</p>
        </div>

        {/* Verification Card */}
        <Card className="bg-black/20 border-white/10 backdrop-blur-xl relative overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-br ${getStatusColor()}`}></div>
          
          <CardHeader className="relative z-10 text-center pb-6">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
              status === 'success' ? 'bg-green-500/20' :
              status === 'error' ? 'bg-red-500/20' :
              status === 'expired' ? 'bg-yellow-500/20' :
              'bg-blue-500/20'
            }`}>
              {status === 'pending' ? (
                <div className="relative">
                  {getStatusIcon()}
                  <div className="absolute inset-0 rounded-full border-2 border-blue-400 border-t-transparent animate-spin"></div>
                </div>
              ) : (
                getStatusIcon()
              )}
            </div>
            <CardTitle className="text-white/90 text-xl">{getStatusTitle()}</CardTitle>
            <p className="text-white/60 text-sm">{getStatusMessage()}</p>
          </CardHeader>

          <CardContent className="relative z-10 space-y-6">
            {status === 'pending' && (
              <div className="space-y-4">
                {/* Email Address Display */}
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-white/60" />
                    <div>
                      <p className="text-white/80 text-sm">Email sent to:</p>
                      <p className="text-purple-400">{email}</p>
                    </div>
                  </div>
                </div>

                {/* Instructions */}
                <div className="space-y-3">
                  <h4 className="text-white/80 text-sm">What to do next:</h4>
                  <div className="space-y-2">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-purple-400 text-xs">1</span>
                      </div>
                      <p className="text-white/60 text-sm">Check your email inbox</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-purple-400 text-xs">2</span>
                      </div>
                      <p className="text-white/60 text-sm">Click the verification link</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-purple-400 text-xs">3</span>
                      </div>
                      <p className="text-white/60 text-sm">Return to complete setup</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {(status === 'error' || status === 'expired') && (
              <div className="space-y-4">
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-red-400 text-sm">Verification Issue</h4>
                    <p className="text-white/60 text-sm mt-1">
                      {status === 'expired' 
                        ? 'The verification link has expired for security reasons.'
                        : 'There was a problem verifying your email address.'
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}

            {status === 'success' && (
              <div className="space-y-4">
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-green-400" />
                  <div>
                    <h4 className="text-green-400 text-sm">Account Verified</h4>
                    <p className="text-white/60 text-sm">Your account is now secure and ready to use.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Resend Email Button */}
            {(status === 'pending' || status === 'error' || status === 'expired') && (
              <div className="space-y-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResendEmail}
                  disabled={!canResend || isResending}
                  className="w-full bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white disabled:opacity-50"
                >
                  {isResending ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : canResend ? (
                    <>
                      <Mail className="w-4 h-4 mr-2" />
                      Resend Verification Email
                    </>
                  ) : (
                    <>
                      <Clock className="w-4 h-4 mr-2" />
                      Resend in {countdown}s
                    </>
                  )}
                </Button>
                
                <p className="text-white/50 text-xs text-center">
                  Didn't receive the email? Check your spam folder.
                </p>
              </div>
            )}

            {/* Back to Login */}
            <div className="text-center pt-4 border-t border-white/10">
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
          <p className="text-white/50 text-xs">
            Need help? Contact{" "}
            <span className="text-purple-400">support@architecturalpro.com</span>
          </p>
        </div>
      </div>
    </div>
  );
}