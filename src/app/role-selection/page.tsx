'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setUser, IAuthRoles } from '@/store/slices/authSlice';
import {
  ShieldAlert,
  ShieldCheck,
  Users,
  Calculator,
  User,
  ArrowRight
} from 'lucide-react';

const roles = [
  {
    title: 'Super Admin',
    description: 'Full system access and configuration',
    icon: ShieldAlert,
    href: '/super-admin/dashboard',
    role: IAuthRoles.SUPER_ADMIN,
    color: 'text-red-500',
    bg: 'bg-red-500/10',
    border: 'hover:border-red-500/50',
    gradient: 'from-red-500/20 to-transparent'
  },
  {
    title: 'Admin',
    description: 'Manage users and platform settings',
    icon: ShieldCheck,
    href: '/admin/dashboard',
    role: IAuthRoles.ADMIN,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    border: 'hover:border-purple-500/50',
    gradient: 'from-purple-500/20 to-transparent'
  },
  {
    title: 'Manager',
    description: 'Oversee teams and project operations',
    icon: Users,
    href: '/manager/dashboard',
    role: IAuthRoles.MANAGER,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    border: 'hover:border-blue-500/50',
    gradient: 'from-blue-500/20 to-transparent'
  },
  {
    title: 'Accountant',
    description: 'Manage finances and transactions',
    icon: Calculator,
    href: '/accountant/dashboard',
    role: IAuthRoles.ACCOUNTANT,
    color: 'text-green-500',
    bg: 'bg-green-500/10',
    border: 'hover:border-green-500/50',
    gradient: 'from-green-500/20 to-transparent'
  },
  {
    title: 'Employee',
    description: 'View tasks and personal dashboard',
    icon: User,
    href: '/employee/dashboard',
    role: IAuthRoles.EMPLOYEE,
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
    border: 'hover:border-orange-500/50',
    gradient: 'from-orange-500/20 to-transparent'
  }
];

export default function RoleSelectionPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleRoleSelect = (roleData: typeof roles[0]) => {
    // Create a mock user object with the selected role
    const mockUser = {
      email: 'demo@example.com',
      firstName: 'Demo',
      lastName: 'User',
      isActive: true,
      role: roleData.role,
      _id: 'demo-user-id'
    };

    // Store the user with the selected role in Redux
    dispatch(setUser(mockUser));

    // Navigate to the role-specific dashboard
    router.push(roleData.href);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-5xl w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
            Select Your Role
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Welcome to Griha. Please select your role to access your dedicated dashboard.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-8">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <button
                key={role.title}
                onClick={() => handleRoleSelect(role)}
                className={`group relative overflow-hidden rounded-2xl border bg-card p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${role.border} text-left w-full`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${role.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />

                <div className="relative z-10 flex flex-col h-full justify-between space-y-4">
                  <div className="space-y-4">
                    <div className={`w-12 h-12 rounded-xl ${role.bg} flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${role.color}`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold tracking-tight">{role.title}</h3>
                      <p className="text-sm text-muted-foreground mt-2">{role.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center text-sm font-medium text-primary opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                    Enter Dashboard
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
