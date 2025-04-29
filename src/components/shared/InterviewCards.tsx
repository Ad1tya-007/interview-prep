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
import {
  ArrowDown,
  ArrowUp,
  CalendarIcon,
  Search,
  User2Icon,
  X,
} from 'lucide-react';
import { useState, useMemo } from 'react';

export default function InterviewCards() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showAllTags, setShowAllTags] = useState(false);

  const cards = useMemo(
    () => [
      {
        title: 'Shadcn Interview',
        description:
          'Explore a collection of Shadcn UI blocks and components, ready to preview and copy.',
        tags: ['UI', 'Components', 'Preview'],
        date: '2022-01-01',
      },
      {
        title: 'React Interview',
        description:
          'Practice your React skills with a set of challenging questions and exercises.',
        tags: ['React', 'Frontend', 'JavaScript'],
        date: '2022-02-01',
      },
      {
        title: 'Frontend Interview',
        description:
          'Test your knowledge of frontend development with a comprehensive set of questions and scenarios.',
        tags: ['Frontend', 'HTML', 'JavaScript'],
        date: '2022-03-01',
      },
      {
        title: 'Backend Interview',
        description:
          'Improve your backend skills with a set of challenging questions and real-world scenarios.',
        tags: ['Backend', 'Server', 'API'],
        date: '2022-04-01',
      },
      {
        title: 'Fullstack Interview',
        description:
          'Prepare for your fullstack interview with a comprehensive set of questions and exercises.',
        tags: ['Fullstack', 'Frontend', 'Backend'],
        date: '2022-05-01',
      },
      {
        title: 'Data Science Interview',
        description:
          'Practice your data science skills with a set of challenging questions and real-world scenarios.',
        tags: ['Machine Learning', 'Statistics'],
        date: '2022-06-01',
      },
      {
        title: 'DevOps Interview',
        description:
          'Improve your DevOps skills with a set of challenging questions and real-world scenarios.',
        tags: ['DevOps', 'Cloud', 'Automation'],
        date: '2022-07-01',
      },
      {
        title: 'Cybersecurity Interview',
        description:
          'Test your cybersecurity skills with a set of challenging questions and real-world scenarios.',
        tags: ['Security', 'Networking', 'Threat Analysis'],
        date: '2022-08-01',
      },
      {
        title: 'Artificial Intelligence Interview',
        description:
          'Prepare for your artificial intelligence interview with a comprehensive set of questions and exercises.',
        tags: ['AI', 'Machine Learning', 'Deep Learning'],
        date: '2022-09-01',
      },
      {
        title: 'Cloud Computing Interview',
        description:
          'Improve your cloud computing skills with a set of challenging questions and real-world scenarios.',
        tags: ['Cloud', 'AWS', 'Azure'],
        date: '2022-10-01',
      },
      {
        title: 'Database Administration Interview',
        description:
          'Practice your database administration skills with a set of challenging questions and real-world scenarios.',
        tags: ['Database', 'SQL', 'NoSQL'],
        date: '2022-11-01',
      },
    ],
    []
  );

  // Extract all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    cards.forEach((card) => {
      card.tags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [cards]);

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

  const filteredCards = cards.filter((card) => {
    // Filter by search query (title or description)
    const matchesSearch =
      card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.description.toLowerCase().includes(searchQuery.toLowerCase());

    // Filter by tags if any are selected
    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.some((tag) => card.tags.includes(tag));

    return matchesSearch && matchesTags;
  });

  return (
    <div>
      {/* SEARCH */}
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

        {/* TAG FILTERS */}
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
        {filteredCards.map((card, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex flex-row items-center gap-3 font-semibold">
                <div className="h-8 w-8 flex items-center justify-center bg-primary text-primary-foreground rounded-full">
                  <User2Icon className="h-5 w-5" />
                </div>
                <p className="line-clamp-1">{card.title}</p>
              </CardTitle>
              <CardDescription className="flex flex-row items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                <p>{card.date}</p>
              </CardDescription>
            </CardHeader>
            <CardContent className="text-[15px] text-muted-foreground h-[150px] overflow-hidden">
              <p className="line-clamp-4">{card.description}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                {card.tags.map((tag, index) => (
                  <Badge key={index}>{tag}</Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="w-full flex flex-row justify-center gap-2">
              <Button variant="outline" className="w-1/2">
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
