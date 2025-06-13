/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { CalendarIcon, Loader2Icon, Search, User2Icon } from 'lucide-react';
import { useState } from 'react';
import InterviewDialog from './InterviewDialog';
import RoleBadge from './RoleBadge';
import InterviewCreateDialog from './InterviewCreateDialog';
import { Interview } from '@supabase/types';

interface ProfileCardsProps {
  interviews: Interview[];
}

export default function ProfileCards({ interviews }: ProfileCardsProps) {
  const { isLoading } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const isPro = true;

  const [open, setOpen] = useState(false);
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

  const handleViewInterview = (interview: any) => {
    setSelectedInterview(interview);
    setOpen(true);
  };

  const handleCloseInterview = () => {
    setSelectedInterview(null);
    setOpen(false);
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
                <div className="h-8 w-8 flex items-center justify-center bg-primary text-primary-foreground rounded-full">
                  <User2Icon className="h-5 w-5" />
                </div>
                <p className="line-clamp-1">{interview.role}</p>
              </CardTitle>
              <CardDescription className="grid grid-cols-3">
                <div className="flex flex-row items-center gap-2 col-span-2">
                  <CalendarIcon className="h-4 w-4" />
                  <p>{new Date(interview.created_at).toDateString()}</p>
                </div>

                <div className="flex flex-row items-center gap-2">
                  <p>{interview.type}</p>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="text-[15px] text-muted-foreground h-[150px] overflow-hidden">
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
            <div className="absolute -top-0.5 right-0">
              <Badge>{interview.level}</Badge>
            </div>
          </Card>
        ))}
      </div>

      <InterviewDialog
        interview={selectedInterview as Interview}
        open={open}
        setOpen={handleCloseInterview}
      />
      <InterviewCreateDialog
        open={isInterviewCreateModalOpen}
        setOpen={setIsInterviewCreateModalOpen}
      />
    </div>
  );
}
