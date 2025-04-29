import { Banner, InterviewCards } from '@/components/shared';

export default function Dashboard() {
  return (
    <div>
      <div className="w-full px-8 space-y-4">
        <Banner />
        <InterviewCards />
      </div>
    </div>
  );
}
