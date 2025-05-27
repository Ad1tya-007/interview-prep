import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Explore',
  description: 'Explore',
};

export default function ExploreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div>{children}</div>;
}
