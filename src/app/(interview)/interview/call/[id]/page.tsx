import { Interview } from '@/components/shared';
import { getInterviewById } from './action';

export default async function CreateInterviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { interview } = await getInterviewById(id);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">
            AI Interview Session
          </h1>
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center px-4 py-2 rounded-full bg-card border">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse mr-2"></div>
              <span className="text-muted-foreground text-sm">
                Live Session
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 pb-8">
        <div className="bg-card rounded-xl shadow-sm border p-6">
          <Interview questions={interview.questions} interviewId={id} />
        </div>
      </div>
    </div>
  );
}
