import { SidebarProvider } from '@/components/ui';
import { AppSidebar, AppSidebarTrigger } from '@/components/shared';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen">
        <AppSidebar />
        <div className="relative p-5 w-full h-full">
          <AppSidebarTrigger />
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
}
