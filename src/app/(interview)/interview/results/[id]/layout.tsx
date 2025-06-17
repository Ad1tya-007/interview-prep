import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Interview Results',
  description: 'Interview Results',
};

export default function ResultsInterviewLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div>{children}</div>;
}
