import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Separator } from "./ui/separator";
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  Building2, 
  Github, 
  Chrome,
  ArrowRight,
  Shield,
  Zap,
  Sparkles
} from "lucide-react";
import { cn } from "./ui/utils";

interface LoginPageProps {
  onLogin: (email: string, password: string) => void;
  onForgotPassword: () => void;
  onSignUp: () => void;
}

export function LoginPage({ onLogin, onForgotPassword, onSignUp }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login delay
    setTimeout(() => {
      onLogin(email, password);
      setIsLoading(false);
    }, 1000);
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`);
    // Handle social login
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
          <p className="text-white/60">Welcome back to your dashboard</p>
        </div>

        {/* Login Card */}
        <Card className="bg-black/20 border-white/10 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5"></div>
          
          <CardHeader className="relative z-10 text-center pb-6">
            <CardTitle className="text-white/90 text-xl">Sign In</CardTitle>
            <p className="text-white/60 text-sm">Enter your credentials to access your account</p>
          </CardHeader>

          <CardContent className="relative z-10 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white/70">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@architecturalpro.com"
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white/70">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/70 h-8 w-8"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="remember" 
                    checked={rememberMe}
                    onCheckedChange={setRememberMe}
                    className="border-white/30 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                  />
                  <Label htmlFor="remember" className="text-white/70 text-sm">Remember me</Label>
                </div>
                <Button
                  type="button"
                  variant="link"
                  onClick={onForgotPassword}
                  className="text-purple-400 hover:text-purple-300 text-sm p-0 h-auto"
                >
                  Forgot password?
                </Button>
              </div>

              {/* Login Button */}
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

            {/* Divider */}
            <div className="relative">
              <Separator className="bg-white/10" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="px-4 bg-black/20 text-white/60 text-sm">or continue with</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleSocialLogin("google")}
                className="bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
              >
                <Chrome className="w-4 h-4 mr-2" />
                Google
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleSocialLogin("github")}
                className="bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
              >
                <Github className="w-4 h-4 mr-2" />
                GitHub
              </Button>
            </div>

            {/* Sign Up Link */}
            <div className="text-center pt-4 border-t border-white/10">
              <p className="text-white/60 text-sm">
                Don't have an account?{" "}
                <Button
                  type="button"
                  variant="link"
                  onClick={onSignUp}
                  className="text-purple-400 hover:text-purple-300 p-0 h-auto"
                >
                  Create one here
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="space-y-2">
            <div className="inline-flex items-center justify-center w-8 h-8 bg-purple-500/20 rounded-lg">
              <Shield className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-white/60 text-xs">Secure</p>
          </div>
          <div className="space-y-2">
            <div className="inline-flex items-center justify-center w-8 h-8 bg-blue-500/20 rounded-lg">
              <Zap className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-white/60 text-xs">Fast</p>
          </div>
          <div className="space-y-2">
            <div className="inline-flex items-center justify-center w-8 h-8 bg-cyan-500/20 rounded-lg">
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-white/60 text-xs">Modern</p>
          </div>
        </div>
      </div>
    </div>
  );
}