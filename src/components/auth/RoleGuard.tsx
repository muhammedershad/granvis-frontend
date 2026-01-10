'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { getAuthDetails, IAuthRoles } from '@/store/slices/authSlice';
import { Loader2 } from 'lucide-react';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: IAuthRoles[];
}

export default function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const router = useRouter();
  const { user, isAuthenticated } = useSelector(getAuthDetails);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/sign-in');
      return;
    }

    if (user && !allowedRoles.includes(user.role as IAuthRoles)) {
      // Redirect based on role
      switch (user.role) {
        case IAuthRoles.SUPER_ADMIN:
          router.push('/super-admin/dashboard');
          break;
        case IAuthRoles.ADMIN:
          router.push('/admin/dashboard');
          break;
        case IAuthRoles.MANAGER:
          router.push('/manager/dashboard');
          break;
        case IAuthRoles.ACCOUNTANT:
          router.push('/accountant/dashboard');
          break;
        case IAuthRoles.EMPLOYEE:
          router.push('/employee/dashboard');
          break;
        default:
          router.push('/');
      }
    }
  }, [isAuthenticated, user, router, allowedRoles]);

  if (!isAuthenticated || (user && !allowedRoles.includes(user.role as IAuthRoles))) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin" />
        </div>
    );
  }

  return <>{children}</>;
}
