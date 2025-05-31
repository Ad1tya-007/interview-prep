import { ProfileCards, UserProfile } from '@/components/shared';
import { getInterviewsOfCurrentUser } from './actions';

export default async function InterviewsPage() {
  const { interviews } = await getInterviewsOfCurrentUser();
  return (
    <div className="w-full px-8 pb-4 space-y-4">
      <UserProfile />
      <ProfileCards interviews={interviews} />
    </div>
  );
}
