'use client';

import { useEffect } from 'react';
import { LoginPage } from '@/components/LoginPage';
import { getCookie } from '@/lib/cookies';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { getAuthDetails } from '@/store/slices/authSlice';

export default function Home() {
  const router = useRouter();

  // select actual auth state (avoid selecting entire store)
  const auth = useSelector(getAuthDetails);
  const isAuthenticated = Boolean(auth?.isAuthenticated); // or check auth.user too

  // read cookie if you still need to verify cookie presence
  const accessTokenCookie = getCookie('accessToken');

  useEffect(() => {
    // run redirect only after render (no setState in render)
    if (isAuthenticated && accessTokenCookie) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, accessTokenCookie, router]);

  // Keep rendering the login page while effect decides navigation.
  // Optionally show a small loading placeholder if redirecting to avoid flicker.
  if (isAuthenticated && accessTokenCookie) {
    // return null briefly; the effect will navigate
    return null;
  }

  return <LoginPage />;
}
