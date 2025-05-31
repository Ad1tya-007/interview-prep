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
    <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 md:py-8">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight mb-4 sm:mb-6 md:mb-8 text-center md:text-left">
        Live Interview
      </h1>

      <Interview questions={interview.questions} interviewId={id} />
    </div>
  );
}
