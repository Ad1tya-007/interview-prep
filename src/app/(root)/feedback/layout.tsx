import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Feedback',
  description: 'Share your feedback about our interview preparation platform',
};

export default function FeedbackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="px-6 py-1">{children}</div>;
}
