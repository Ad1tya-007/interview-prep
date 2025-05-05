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
  ArrowDown,
  ArrowUp,
  CalendarIcon,
  Loader2Icon,
  Search,
  StarIcon,
  User2Icon,
  X,
} from 'lucide-react';
import { useState, useMemo } from 'react';

export default function DashboardCards() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showAllTags, setShowAllTags] = useState(false);
  const { isLoading } = useAuth();

  const interviews = useMemo(
    () => [
      {
        id: 1,
        title: 'Google Frontend Interview',
        description:
          'Frontend interview focusing on JavaScript, React, and system design.',
        date: '2023-05-15',
        tags: ['Frontend', 'React', 'JavaScript'],
      },
      {
        id: 2,
        title: 'Amazon Backend Interview',
        description:
          'Backend focused interview covering algorithms, system design, and AWS services.',
        date: '2023-06-22',
        tags: ['Backend', 'AWS', 'Algorithms'],
        rating: 85,
      },
      {
        id: 3,
        title: 'Microsoft Full Stack Interview',
        description:
          'Full stack interview with questions on React, .NET, and database design.',
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
      },
      {
        id: 6,
        title: 'Twitter Backend Interview',
        description:
          'Backend interview covering distributed systems and real-time processing.',
        date: '2023-10-08',
        tags: ['Backend', 'Distributed Systems'],
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
      interview.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
                {interview.rating && (
                  <div className="flex flex-row items-center gap-2">
                    <StarIcon className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <p>{interview.rating} / 100</p>
                  </div>
                )}
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
