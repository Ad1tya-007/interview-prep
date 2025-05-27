import { Interview } from '@/components/shared';

export default function CreateInterviewPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 md:py-8">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight mb-4 sm:mb-6 md:mb-8 text-center md:text-left">
        Interview Generation
      </h1>

      <Interview />
    </div>
  );
}
