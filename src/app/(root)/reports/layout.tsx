import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reports',
  description: 'Reports',
};

export default function ReportsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="px-6 py-1">{children}</div>;
}
