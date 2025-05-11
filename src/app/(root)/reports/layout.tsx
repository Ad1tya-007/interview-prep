import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reports',
  description: 'Reports',
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div>{children}</div>;
}
