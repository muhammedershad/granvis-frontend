'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Home, 
  RefreshCcw, 
  AlertTriangle,
  Mail
} from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background dark:from-gray-900 dark:via-black dark:to-gray-900 relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated background elements - only show in dark theme */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-0 dark:opacity-100 transition-opacity duration-500">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Light theme background pattern */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-100 dark:opacity-0 transition-opacity duration-500 bg-gradient-to-br from-red-50/50 via-orange-50/30 to-yellow-50/50"></div>

      {/* Subtle grid overlay */}
      <div className="fixed inset-0 opacity-5 dark:opacity-5 pointer-events-none" style={{
        backgroundImage: `
          linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px'
      }}></div>

      {/* Main Content */}
      <div className="w-full max-w-2xl relative z-10">
        <Card className="bg-card/20 dark:bg-black/20 border-border backdrop-blur-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-orange-500/5"></div>
          
          <CardContent className="relative z-10 p-12 text-center space-y-6">
            {/* Error Icon */}
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-3xl mb-4 relative">
              <AlertTriangle className="w-12 h-12 text-red-400" />
              <div className="absolute inset-0 bg-gradient-to-br from-red-400/20 to-orange-400/20 rounded-3xl blur-xl animate-pulse"></div>
            </div>

            {/* Error Text */}
            <div className="space-y-3">
              <h1 className="text-7xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                500
              </h1>
              <h2 className="text-3xl font-semibold text-foreground">
                Something Went Wrong
              </h2>
              <p className="text-muted-foreground text-lg max-w-md mx-auto">
                We encountered an unexpected error. Don&apos;t worry, our team has been notified
                and we&apos;re working on fixing it.
              </p>
              
              {/* Error Details (only in development) */}
              {process.env.NODE_ENV === 'development' && (
                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-left">
                  <p className="text-xs font-mono text-red-400 break-all">
                    {error.message}
                  </p>
                  {error.digest && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Error ID: {error.digest}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
              <Button
                onClick={reset}
                className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white border-0 h-11 px-8 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-orange-400/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="relative flex items-center space-x-2">
                  <RefreshCcw className="w-4 h-4" />
                  <span>Try Again</span>
                </span>
              </Button>
              
              <Link href="/">
                <Button variant="outline" className="bg-card/50 border-border text-foreground hover:bg-card h-11 px-8">
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
                </Button>
              </Link>
            </div>

            {/* Support Contact */}
            <div className="pt-6 border-t border-border/50">
              <p className="text-muted-foreground text-sm mb-3">
                If this problem persists, please contact our support team
              </p>
              <Link href="mailto:support@architecturalpro.com">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  <Mail className="w-4 h-4 mr-2" />
                  support@architecturalpro.com
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}