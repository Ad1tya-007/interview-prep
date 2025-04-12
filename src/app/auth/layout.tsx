import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authenticate',
  description: 'Authenticate',
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="flex h-screen w-screen border">{children}</div>;
}
