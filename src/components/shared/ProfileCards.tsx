'use client';

import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  Input,
  Badge,
  CardDescription,
  CardTitle,
} from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { CalendarIcon, Loader2Icon, Search } from 'lucide-react';
import { useState } from 'react';
import InterviewDialog from './InterviewDialog';
import InterviewCreateDialog from './InterviewCreateDialog';
import { Interview } from '@supabase/types';
import InterviewTypeBadge from './InterviewTypeBadge';
import LevelBadge from './LevelBadge';

interface ProfileCardsProps {
  interviews: Interview[];
}

export default function ProfileCards({ interviews }: ProfileCardsProps) {
  const { isLoading } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const isPro = true;

  const [isSelectedInterviewOpen, setIsSelectedInterviewOpen] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(
    null
  );
  const [isInterviewCreateModalOpen, setIsInterviewCreateModalOpen] =
    useState(false);

  if (isLoading) {
    return (
      <div className="h-[300] flex items-center justify-center">
        <Loader2Icon className="animate-spin h-10 w-10 text-muted-foreground" />
      </div>
    );
  }

  const filteredInterviews = interviews.filter((interview) =>
    interview.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewInterview = (interview: Interview) => {
    setSelectedInterview(interview);
    setIsSelectedInterviewOpen(true);
  };

  const handleCloseInterview = () => {
    setSelectedInterview(null);
    setIsSelectedInterviewOpen(false);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight mb-6">
        Your Interviews
      </h1>

      {isPro && (
        <div className="mb-6 flex flex-row justify-between gap-4">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search your interviews..."
              className="w-full pl-9 rounded-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={() => setIsInterviewCreateModalOpen(true)}>
            Generate Interview
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
        {filteredInterviews.map((interview) => (
          <Card key={interview.id} className="relative">
            <CardHeader>
              <CardTitle className="flex flex-row items-center gap-2 font-normal text-muted-foreground">
                <p className="line-clamp-1 font-semibold text-foreground hover:underline">
                  {interview.role}
                </p>
              </CardTitle>
              <CardDescription className="mt-2 flex flex-row justify-between">
                <div className="flex flex-row items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  <p>{new Date(interview.created_at).toDateString()}</p>
                </div>

                <div className="flex flex-row items-center gap-2">
                  <InterviewTypeBadge type={interview.type} />
                  {interview.level && <LevelBadge level={interview.level} />}
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="text-[15px] text-muted-foreground h-[150px] overflow-hidden space-y-2">
              <p className="text-sm text-muted-foreground line-clamp-4">
                {interview.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {interview.tags.map((tag) => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="w-full flex flex-row justify-center gap-2">
              <Button
                variant="outline"
                className="w-full text-muted-foreground"
                onClick={() => handleViewInterview(interview)}>
                View
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <InterviewDialog
        interview={selectedInterview}
        open={isSelectedInterviewOpen && selectedInterview !== null}
        setOpen={handleCloseInterview}
      />
      <InterviewCreateDialog
        open={isInterviewCreateModalOpen}
        setOpen={setIsInterviewCreateModalOpen}
      />
    </div>
  );
}
