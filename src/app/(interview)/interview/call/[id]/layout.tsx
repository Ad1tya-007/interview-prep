import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Call Interview',
  description: 'Call Interview',
};

export default function CallInterviewLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div>{children}</div>;
}
