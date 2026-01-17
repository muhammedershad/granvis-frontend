'use client';

import { useEffect } from 'react';
import { getCookie } from '@/lib/cookies';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { getAuthDetails } from '@/store/slices/authSlice';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  // select actual auth state (avoid selecting entire store)
  const auth = useSelector(getAuthDetails);
  const isAuthenticated = Boolean(auth?.isAuthenticated);

  // read cookie if you still need to verify cookie presence
  const accessTokenCookie = getCookie('accessToken');

  useEffect(() => {
    // Give a small delay to ensure Redux state is fully rehydrated
    const timer = setTimeout(() => {
      // Redirect based on authentication status and role
      if (isAuthenticated && accessTokenCookie && auth.user) {
        switch (auth.user.role) {
          case 'super_admin':
            router.push('/super-admin/dashboard');
            break;
          case 'admin':
            router.push('/admin/dashboard');
            break;
          case 'manager':
            router.push('/manager/dashboard');
            break;
          case 'accountant':
            router.push('/accountant/dashboard');
            break;
          case 'employee':
            router.push('/employee/dashboard');
            break;
          default:
            router.push('/sign-in');
        }
      } else {
        router.push('/sign-in');
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isAuthenticated, accessTokenCookie, router, auth.user]);

  // Show loading screen while checking authentication
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background dark:from-gray-900 dark:via-black dark:to-gray-900 flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="w-12 h-12 text-purple-500 dark:text-purple-400 mx-auto animate-spin" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}
