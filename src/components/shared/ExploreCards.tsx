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
  CardTitle,
} from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import {
  ArrowDown,
  ArrowUp,
  Loader2Icon,
  Search,
  User2Icon,
  X,
} from 'lucide-react';
import { useState, useMemo } from 'react';
import InterviewDialog from './InterviewDialog';

export default function ExploreCards() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showAllTags, setShowAllTags] = useState(false);
  const { isLoading } = useAuth();

  const [selectedInterview, setSelectedInterview] = useState<any | null>(null);
  const [open, setOpen] = useState(false);

  const handleViewInterview = (interview: any) => {
    setSelectedInterview(interview);
    setOpen(true);
  };

  const handleCloseInterview = () => {
    setSelectedInterview(null);
    setOpen(false);
  };

  type Interview = {
    id: number;
    role: string;
    level: 'Junior' | 'Mid' | 'Senior';
    description: string;
    tags: string[];
    type: 'Behavioral' | 'Technical' | 'Mixed';
    questions: string[];
  };

  const interviews: Interview[] = useMemo(
    () => [
      {
        id: 1,
        role: 'Google Frontend Interview',
        level: 'Junior',
        description:
          "This frontend interview delves into the intricacies of JavaScript, React, and system design, providing a comprehensive assessment of a candidate's skills in these areas.",

        tags: ['Frontend', 'React', 'JavaScript'],
        type: 'Technical',
        questions: [
          'Explain the virtual DOM in React and how it improves performance.',
          'What are React hooks? Explain useState and useEffect.',
          'Implement a debounce function from scratch.',
          'How would you optimize the performance of a React application?',
        ],
      },
      {
        id: 2,
        role: 'Amazon Backend Interview',
        level: 'Mid',
        description:
          'The backend focused interview at Amazon covers a wide range of topics including algorithms, system design, and AWS services, ensuring that candidates have a deep understanding of these critical areas.',
        tags: ['Backend', 'AWS', 'Algorithms'],
        type: 'Technical',
        questions: [
          'Design a scalable URL shortening service.',
          'Explain the CAP theorem and its implications in distributed systems.',
          'How would you handle race conditions in a distributed system?',
          'Describe the architecture of a real-time notification system using AWS services.',
        ],
      },
      {
        id: 3,
        role: 'Microsoft Full Stack Interview',
        level: 'Senior',
        description:
          'Full stack interview with questions on React, .NET, and database design.',

        tags: ['Fullstack', 'React', '.NET'],
        type: 'Mixed',
        questions: [
          'How would you design a real-time collaboration feature like Google Docs?',
          'Explain dependency injection in .NET Core and its benefits.',
          'Design a database schema for a social media platform.',
          'How would you implement authentication and authorization in a full-stack application?',
        ],
      },
      {
        id: 4,
        role: 'Facebook Interview',
        level: 'Senior',
        description:
          'System design interview focusing on scalable architectures for social media platforms.',

        tags: ['System Design', 'Scalability'],
        type: 'Behavioral',
        questions: [
          'Design the news feed system of Facebook.',
          'How would you handle consistent hashing in a distributed cache?',
          'Explain how you would implement a real-time chat system at scale.',
          'Design a content delivery network (CDN) from scratch.',
        ],
      },
      {
        id: 5,
        role: 'Netflix UI Engineer',
        level: 'Junior',
        description:
          'UI engineering interview with focus on responsive design and performance optimization.',

        tags: ['UI', 'Frontend', 'Performance'],
        type: 'Technical',
        questions: [
          'How would you implement infinite scrolling in a video catalog?',
          'Explain CSS Grid and Flexbox. When would you use one over the other?',
          'How would you optimize the loading performance of a web application?',
          'Implement a responsive navigation menu without using any framework.',
        ],
      },
      {
        id: 6,
        role: 'Twitter Backend',
        level: 'Mid',
        description:
          'Backend interview covering distributed systems and real-time processing.',

        tags: ['Backend', 'Distributed Systems'],
        type: 'Technical',
        questions: [
          "Design Twitter's trending topics feature.",
          'How would you implement rate limiting in a distributed system?',
          'Explain how you would handle data partitioning in a large-scale system?',
          'Design a system that can handle millions of concurrent WebSocket connections.',
        ],
      },
    ],
    []
  );

  // Extract all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    interviews.forEach((interview) => {
      interview.tags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [interviews]);

  if (isLoading) {
    return (
      <div className="h-[300] flex items-center justify-center">
        <Loader2Icon className="animate-spin h-10 w-10 text-muted-foreground" />
      </div>
    );
  }

  // Toggle tag selection
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Clear all selected tags
  const clearTags = () => setSelectedTags([]);

  // Display limited tags or all tags based on state
  const displayedTags = showAllTags ? allTags : allTags.slice(0, 8);

  const filteredInterviews = interviews.filter((interview) => {
    // Filter by search query (title or description)
    const matchesSearch =
      interview.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      interview.description.toLowerCase().includes(searchQuery.toLowerCase());

    // Filter by tags if any are selected
    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.some((tag) => interview.tags.includes(tag));

    return matchesSearch && matchesTags;
  });

  return (
    <div>
      <div className="space-y-4 mb-6">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search interviews..."
            className="w-full pl-9 rounded-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Filter by tags</h3>
            {selectedTags.length > 0 && (
              <button
                onClick={clearTags}
                className="text-xs flex items-center text-muted-foreground hover:text-foreground">
                <X className="h-3 w-3 mr-1" /> Clear filters
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {displayedTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => toggleTag(tag)}>
                {tag}
              </Badge>
            ))}
            {allTags.length > 8 && (
              <Badge
                variant="secondary"
                className="cursor-pointer"
                onClick={() => setShowAllTags(!showAllTags)}>
                {showAllTags ? (
                  <>
                    <span className="ml-1">Collapse</span>
                    <ArrowUp />
                  </>
                ) : (
                  <>
                    <span className="ml-1">Expand</span>
                    <ArrowDown />
                  </>
                )}
              </Badge>
            )}
          </div>
        </div>
      </div>

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
        open={open}
        setOpen={handleCloseInterview}
      />
    </div>
  );
}
