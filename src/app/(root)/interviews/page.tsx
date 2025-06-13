import { ProfileCards, UserProfile } from '@/components/shared';
import { getInterviewsOfCurrentUser } from './actions';

export default async function InterviewsPage() {
  const { interviews } = await getInterviewsOfCurrentUser();
  console.log(interviews);
  return (
    <div className="w-full px-8 pb-4 space-y-4">
      <UserProfile interviewCount={interviews.length} />
      <ProfileCards interviews={interviews} />
    </div>
  );
}
