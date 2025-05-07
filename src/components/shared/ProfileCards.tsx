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
import {
  CalendarIcon,
  Loader2Icon,
  Search,
  StarIcon,
  User2Icon,
} from 'lucide-react';
import { useState, useMemo } from 'react';

export default function ProfileCards() {
  const { isLoading } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const isPro = true;

  const interviews = useMemo(
    () => [
      {
        id: 1,
        title: 'Google Frontend Interview',
        description:
          "This frontend interview delves into the intricacies of JavaScript, React, and system design, providing a comprehensive assessment of a candidate's skills in these areas.",
        date: '2023-05-15',
        tags: ['Frontend', 'React', 'JavaScript'],
        rating: 82,
      },
      {
        id: 2,
        title: 'Amazon Backend Interview',
        description:
          'The backend focused interview at Amazon covers a wide range of topics including algorithms, system design, and AWS services, ensuring that candidates have a deep understanding of these critical areas.',
        date: '2023-06-22',
        tags: ['Backend', 'AWS', 'Algorithms'],
        rating: 85,
      },
      {
        id: 3,
        title: 'Microsoft Full Stack Interview',
        description:
          "Full stack interview with questions on React, .NET, and database design, evaluating a candidate's proficiency in both frontend and backend technologies.",
        date: '2023-07-10',
        tags: ['Fullstack', 'React', '.NET'],
        rating: 78,
      },
      {
        id: 4,
        title: 'Facebook Interview',
        description:
          'System design interview focusing on scalable architectures for social media platforms.',
        date: '2023-08-05',
        tags: ['System Design', 'Scalability'],
        rating: 89,
      },
      {
        id: 5,
        title: 'Netflix UI Engineer Interview',
        description:
          'UI engineering interview with focus on responsive design and performance optimization.',
        date: '2023-09-12',
        tags: ['UI', 'Frontend', 'Performance'],
        rating: 72,
      },
      {
        id: 6,
        title: 'Twitter Backend Interview',
        description:
          'Backend interview covering distributed systems and real-time processing.',
        date: '2023-10-08',
        tags: ['Backend', 'Distributed Systems'],
        rating: 81,
      },
    ],
    []
  );

  if (isLoading) {
    return (
      <div className="h-[300] flex items-center justify-center">
        <Loader2Icon className="animate-spin h-10 w-10 text-muted-foreground" />
      </div>
    );
  }

  const filteredInterviews = interviews.filter(
    (interview) =>
      interview.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      interview.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-muted-foreground">
        Your Interviews
      </h1>

      {isPro && (
        <div className="mb-6">
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
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredInterviews.map((interview) => (
          <Card key={interview.id}>
            <CardHeader>
              <CardTitle className="flex flex-row items-center gap-2 font-normal text-muted-foreground">
                <div className="h-8 w-8 flex items-center justify-center bg-primary text-primary-foreground rounded-full">
                  <User2Icon className="h-5 w-5" />
                </div>
                <p className="line-clamp-1">{interview.title}</p>
              </CardTitle>
              <CardDescription className="grid grid-cols-3">
                <div className="flex flex-row items-center gap-2 col-span-2">
                  <CalendarIcon className="h-4 w-4" />
                  <p>{interview.date}</p>
                </div>

                <div className="flex flex-row items-center gap-2">
                  <StarIcon className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <p>{interview.rating} / 100</p>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="text-[15px] text-muted-foreground h-[150px] overflow-hidden">
              <p className="line-clamp-4 text-sm">{interview.description}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                {interview.tags.map((tag, index) => (
                  <Badge key={index}>{tag}</Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="w-full flex flex-row justify-center gap-2">
              <Button variant="outline" className="w-1/2 text-muted-foreground">
                View
              </Button>
              <Button className="w-1/2">Start</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
