'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Home, 
  RefreshCcw, 
  AlertTriangle,
} from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global Error:', error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden flex items-center justify-center p-4">
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>

          <div className="w-full max-w-2xl relative z-10">
            <Card className="bg-black/20 border-gray-800 backdrop-blur-xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-orange-500/5"></div>
              
              <CardContent className="relative z-10 p-12 text-center space-y-6">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-3xl mb-4">
                  <AlertTriangle className="w-12 h-12 text-red-400" />
                </div>

                <div className="space-y-3">
                  <h1 className="text-7xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                    Error
                  </h1>
                  <h2 className="text-3xl font-semibold text-white">
                    Critical Application Error
                  </h2>
                  <p className="text-gray-400 text-lg max-w-md mx-auto">
                    A critical error has occurred. Please try refreshing the page.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
                  <Button
                    onClick={reset}
                    className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white border-0 h-11 px-8"
                  >
                    <RefreshCcw className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                  
                  <Link href="/">
                    <Button variant="outline" className="bg-gray-800/50 border-gray-700 text-white hover:bg-gray-800 h-11 px-8">
                      <Home className="w-4 h-4 mr-2" />
                      Go Home
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </body>
    </html>
  );
}