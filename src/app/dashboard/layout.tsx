import type { Metadata } from 'next';
import { SidebarProvider } from '@/components/ui';
import { AppSidebar, AppSidebarTrigger } from '@/components/shared';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Dashboard',
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen">
        <AppSidebar />
        <div className="relative p-5">
          <AppSidebarTrigger />
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
}
