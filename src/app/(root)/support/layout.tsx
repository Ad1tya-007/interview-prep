import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Support',
  description: 'Get help with your interview preparation journey',
};

export default function SupportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="px-6 py-1">{children}</div>;
}
