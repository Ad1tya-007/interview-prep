import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { SidebarProvider, SidebarTrigger } from '@/components/ui';
import { AppSidebar } from '@/components/shared';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'InterviewPrep',
  description: 'InterviewPrep',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SidebarProvider>
          <main className="flex h-screen w-screen">
            <AppSidebar />
            <main className="p-5">
              <SidebarTrigger className="-ml-1" />
              {children}
            </main>
          </main>
        </SidebarProvider>
      </body>
    </html>
  );
}
