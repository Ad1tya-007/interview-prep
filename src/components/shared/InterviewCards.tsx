'use client';

import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  Input,
} from '@/components/ui';
import { ArrowRight, Search, Shapes } from 'lucide-react';
import { useState } from 'react';

export default function InterviewCards() {
  const [searchQuery, setSearchQuery] = useState('');

  const cards = [
    {
      title: 'Shadcn Interview',
      description:
        'Explore a collection of Shadcn UI blocks and components, ready to preview and copy.',
    },
    {
      title: 'React Interview',
      description:
        'Practice your React skills with a set of challenging questions and exercises.',
    },
    {
      title: 'Frontend Interview',
      description:
        'Test your knowledge of frontend development with a comprehensive set of questions and scenarios.',
    },
    {
      title: 'Backend Interview',
      description:
        'Improve your backend skills with a set of challenging questions and real-world scenarios.',
    },
    {
      title: 'Fullstack Interview',
      description:
        'Prepare for your fullstack interview with a comprehensive set of questions and exercises.',
    },
    {
      title: 'Data Science Interview',
      description:
        'Practice your data science skills with a set of challenging questions and real-world scenarios.',
    },
    {
      title: 'DevOps Interview',
      description:
        'Improve your DevOps skills with a set of challenging questions and real-world scenarios.',
    },
  ];

  const filteredCards = cards.filter(
    (card) =>
      card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {/* SEARCH */}
      <div className="mb-4 flex items-center gap-2">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search interviews..."
            className="w-full pl-9 rounded-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredCards.map((card, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center gap-3 font-semibold">
              <div className="h-8 w-8 flex items-center justify-center bg-primary text-primary-foreground rounded-full">
                <Shapes className="h-5 w-5" />
              </div>
              <p className="line-clamp-1">{card.title}</p>
            </CardHeader>
            <CardContent className="text-[15px] text-muted-foreground h-[100px] overflow-hidden">
              <p className="line-clamp-4">{card.description}</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                Start Interview <ArrowRight />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
