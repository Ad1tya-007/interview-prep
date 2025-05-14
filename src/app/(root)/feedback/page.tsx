import { SmileIcon } from 'lucide-react';
import { FeedbackForm } from '@/components/shared';

export default function FeedbackPage() {
  return (
    <div className="container mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Feedback</h1>
        <p className="text-muted-foreground mt-2 text-md">
          We value your input to help us improve your interview preparation
          experience
        </p>
      </div>

      <div className="border rounded-lg p-6 bg-muted/30 mb-6">
        <h2 className="text-lg font-semibold mb-4">Feedback Guidelines</h2>
        <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5">
          <li>Be specific about what you liked or what could be improved</li>
          <li>
            For bug reports, include steps to reproduce the issue and what you
            expected to happen
          </li>
          <li>
            For feature requests, explain the use case and how it would benefit
            your interview preparation
          </li>
          <li>
            We read all feedback but may not be able to respond to every
            submission individually
          </li>
        </ul>
      </div>

      <div className="flex items-center gap-2 text-green-400">
        <SmileIcon className="h-5 w-5" />
        <h2 className="text-lg font-semibold">General Feedback</h2>
      </div>
      <p className="text-muted-foreground text-sm mb-6">
        Share your thoughts about your experience with our platform. What do you
        like? What could be improved?
      </p>
      <FeedbackForm />
    </div>
  );
}
