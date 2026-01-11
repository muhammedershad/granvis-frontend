'use client';
import MainLayout from "@/components/MainLayout";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <MainLayout>
      {children}
    </MainLayout>
  );
}
