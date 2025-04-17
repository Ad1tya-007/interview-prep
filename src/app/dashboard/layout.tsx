import type { Metadata } from 'next';
import { SidebarProvider, SidebarTrigger } from '@/components/ui';
import { AppSidebar } from '@/components/shared';

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
        <div className="p-5">
          <SidebarTrigger className="-ml-1" />
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
}
