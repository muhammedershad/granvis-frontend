'use client';
import MainLayout from "@/components/MainLayout";

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <MainLayout>
            {children}
        </MainLayout>
    );
}

export default Layout;