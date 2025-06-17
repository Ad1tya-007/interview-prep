import { createClient } from '@supabase/server';
import { redirect } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import Link from 'next/link';
import {
  BriefcaseIcon,
  GraduationCapIcon,
  CodeIcon,
  TrendingUpIcon,
  BarChart3Icon,
  AlertTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChevronUpIcon,
  ClockIcon,
  Share2Icon,
  InfoIcon,
} from 'lucide-react';

interface FeedbackItem {
  score: number;
  comments: string;
  areas_for_improvement: string[];
}

interface Feedback {
  communication_skills: FeedbackItem;
  technical_knowledge: FeedbackItem;
  problem_solving: FeedbackItem;
  cultural_fit: FeedbackItem;
  confidence_and_clarity: FeedbackItem;
}

interface Report {
  id: string;
  created_at: string;
  feedback: Feedback;
  interview: {
    role: string;
    type: string;
    level: string;
    tags: string[];
  };
}

async function getReport(reportId: string): Promise<Report> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: report, error } = await supabase
    .from('reports')
    .select(
      `
      id,
      created_at,
      feedback,
      interviews!inner (
        role,
        type,
        level,
        tags
      )
    `
    )
    .eq('id', reportId)
    .eq('user_id', user.id)
    .single();

  if (error || !report || !report.interviews) {
    redirect('/explore');
  }

  // Transform the data to match our interface
  return {
    id: report.id,
    created_at: report.created_at,
    feedback: report.feedback,
    interview: Array.isArray(report.interviews)
      ? report.interviews[0]
      : report.interviews,
  };
}

function getScoreColor(score: number): string {
  if (score >= 8)
    return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
  if (score >= 6)
    return 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 border-amber-200 dark:border-amber-800';
  return 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300 border-rose-200 dark:border-rose-800';
}

function getScoreText(score: number): string {
  if (score >= 8) return 'Excellent';
  if (score >= 6) return 'Good';
  return 'Needs Improvement';
}

function getScoreIndicator(score: number) {
  if (score >= 8)
    return {
      icon: CheckCircleIcon,
      color: 'text-emerald-600 dark:text-emerald-400',
    };
  if (score >= 6)
    return {
      icon: AlertTriangleIcon,
      color: 'text-amber-600 dark:text-amber-400',
    };
  return { icon: XCircleIcon, color: 'text-rose-600 dark:text-rose-400' };
}

function getPerformanceInsights(score: number): string[] {
  if (score >= 8) {
    return [
      'Exceptional performance across key areas',
      'Strong candidate for immediate consideration',
      'Demonstrates advanced expertise',
    ];
  }
  if (score >= 6) {
    return [
      'Solid foundation with room for growth',
      'Potential for development in specific areas',
      'Consider for junior to mid-level positions',
    ];
  }
  return [
    'Requires significant improvement',
    'Additional training recommended',
    'Consider reassessment after preparation',
  ];
}

export default async function InterviewResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const report = await getReport(id);

  const categories = [
    {
      key: 'communication_skills',
      label: 'Communication Skills',
      icon: '🗣️',
      description: 'Ability to articulate ideas clearly and effectively',
    },
    {
      key: 'technical_knowledge',
      label: 'Technical Knowledge',
      icon: '💻',
      description: 'Understanding of core technical concepts and practices',
    },
    {
      key: 'problem_solving',
      label: 'Problem Solving',
      icon: '🧩',
      description: 'Approach to analyzing and solving complex problems',
    },
    {
      key: 'cultural_fit',
      label: 'Cultural Fit',
      icon: '🤝',
      description: 'Alignment with company values and team dynamics',
    },
    {
      key: 'confidence_and_clarity',
      label: 'Confidence & Clarity',
      icon: '✨',
      description: 'Self-assurance and clear communication under pressure',
    },
  ];

  const averageScore =
    categories.reduce(
      (sum, category) =>
        sum + report.feedback[category.key as keyof Feedback].score,
      0
    ) / categories.length;

  const insights = getPerformanceInsights(averageScore);
  const scoreIndicator = getScoreIndicator(averageScore);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-4">
            <Badge variant="outline" className="text-primary border-2">
              Interview Assessment
            </Badge>
            <Badge variant="secondary" className="font-mono">
              REF: {report.id.slice(0, 8)}
            </Badge>
            <div className="flex-grow" />
            <Button variant="outline" size="sm" className="gap-2">
              <Share2Icon className="w-4 h-4" /> Share Report
            </Button>
            <Button size="sm" asChild className="gap-2">
              <Link href="/reports">
                <BarChart3Icon className="w-4 h-4" />
                View All Results
              </Link>
            </Button>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-2">
                Performance Analysis
              </h1>
              <p className="text-muted-foreground text-lg">
                Comprehensive interview evaluation report
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ClockIcon className="w-4 h-4" />
              Generated {new Date(report.created_at).toLocaleString()}
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-2">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="detailed">Detailed Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card className="">
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pb-6 border-b">
                  <div className="flex flex-col gap-1.5">
                    <div className="text-sm text-muted-foreground">
                      Position
                    </div>
                    <div className="flex items-center gap-2">
                      <BriefcaseIcon className="w-4 h-4 text-primary" />
                      <span className="font-medium">
                        {report.interview.role}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <div className="text-sm text-muted-foreground">
                      Interview Type
                    </div>
                    <div className="flex items-center gap-2">
                      <CodeIcon className="w-4 h-4 text-primary" />
                      <span className="font-medium">
                        {report.interview.type}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <div className="text-sm text-muted-foreground">
                      Seniority
                    </div>
                    <div className="flex items-center gap-2">
                      <GraduationCapIcon className="w-4 h-4 text-primary" />
                      <span className="font-medium">
                        {report.interview.level}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <div className="text-sm text-muted-foreground">
                      Tech Stack
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {report.interview.tags.map((tag) => (
                        <Badge key={tag} className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">
                      Overall Performance
                    </CardTitle>
                    <CardDescription>
                      Aggregated assessment score
                    </CardDescription>
                  </div>
                  <scoreIndicator.icon
                    className={`w-8 h-8 ${scoreIndicator.color}`}
                  />
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-6xl font-bold text-primary tracking-tighter">
                        {averageScore.toFixed(1)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Performance Score
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge
                        className={`${getScoreColor(
                          averageScore
                        )} text-lg px-4 py-2 border`}>
                        {getScoreText(averageScore)}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Score Range</span>
                      <span className="font-medium">0-10</span>
                    </div>
                    <Progress
                      value={(averageScore / 10) * 100}
                      className="h-3"
                    />
                  </div>

                  <div className="space-y-2 pt-2">
                    <h4 className="font-semibold flex items-center gap-2">
                      <TrendingUpIcon className="w-4 h-4" />
                      Key Insights
                    </h4>
                    <ul className="space-y-2">
                      {insights.map((insight, index) => (
                        <li
                          key={index}
                          className="flex items-center gap-2 text-sm text-muted-foreground">
                          <ChevronUpIcon className="w-4 h-4 text-primary" />
                          {insight}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3Icon className="w-5 h-5" />
                    Strength Areas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[200px] pr-4">
                    {categories
                      .filter(
                        (category) =>
                          report.feedback[category.key as keyof Feedback]
                            .score >= 7
                      )
                      .map((category) => {
                        const score =
                          report.feedback[category.key as keyof Feedback].score;
                        return (
                          <div key={category.key} className="mb-4 last:mb-0">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="text-xl">{category.icon}</span>
                                <span className="font-medium">
                                  {category.label}
                                </span>
                              </div>
                              <Badge variant="outline">{score}/10</Badge>
                            </div>
                            <Progress
                              value={(score / 10) * 100}
                              className="h-2"
                            />
                          </div>
                        );
                      })}
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangleIcon className="w-5 h-5" />
                    Areas for Improvement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[200px] pr-4">
                    {categories
                      .filter(
                        (category) =>
                          report.feedback[category.key as keyof Feedback]
                            .score < 7
                      )
                      .map((category) => {
                        const score =
                          report.feedback[category.key as keyof Feedback].score;
                        return (
                          <div key={category.key} className="mb-4 last:mb-0">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="text-xl">{category.icon}</span>
                                <span className="font-medium">
                                  {category.label}
                                </span>
                              </div>
                              <Badge variant="outline">{score}/10</Badge>
                            </div>
                            <Progress
                              value={(score / 10) * 100}
                              className="h-2"
                            />
                          </div>
                        );
                      })}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="detailed" className="space-y-6">
            {/* Detailed Category Analysis */}
            {categories.map((category) => {
              const feedback = report.feedback[category.key as keyof Feedback];

              return (
                <Card key={category.key} className="overflow-hidden">
                  <CardHeader>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{category.icon}</span>
                          <CardTitle>{category.label}</CardTitle>
                        </div>
                        <Badge className={getScoreColor(feedback.score)}>
                          {feedback.score}/10
                        </Badge>
                      </div>

                      <CardDescription>{category.description}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Performance
                        </span>
                        <span className="font-medium">
                          {getScoreText(feedback.score)}
                        </span>
                      </div>
                      <Progress
                        value={(feedback.score / 10) * 100}
                        className="h-2"
                      />
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">
                        Detailed Feedback
                      </h4>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {feedback.comments}
                      </p>
                    </div>
                  </CardContent>
                  {feedback?.areas_for_improvement?.length > 0 && (
                    <CardFooter>
                      <div className="bg-muted/50 w-full px-4 py-3 border-muted-foreground/10 rounded-lg border space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2 font-semibold text-foreground">
                          <AlertTriangleIcon className="w-4 h-4" />
                          Areas for Improvement
                        </div>
                        <div className="flex flex-col gap-2">
                          {feedback.areas_for_improvement.map((area) => (
                            <div key={area} className="flex items-center gap-2">
                              <InfoIcon className="w-4 h-4" />
                              {area}
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardFooter>
                  )}
                </Card>
              );
            })}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
