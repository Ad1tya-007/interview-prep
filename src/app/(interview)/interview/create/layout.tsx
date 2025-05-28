import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Interview',
  description: 'Create Interview',
};

export default function CreateInterviewLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div>{children}</div>;
}
