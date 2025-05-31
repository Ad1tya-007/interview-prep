import { createClient } from '@supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface FeedbackItem {
  score: number;
  comments: string;
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
    techstack: string[];
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
        techstack
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
  if (score >= 8) return 'bg-green-100 text-green-800 border-green-200';
  if (score >= 6) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  return 'bg-red-100 text-red-800 border-red-200';
}

function getScoreText(score: number): string {
  if (score >= 8) return 'Excellent';
  if (score >= 6) return 'Good';
  return 'Needs Improvement';
}

export default async function InterviewResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const report = await getReport(id);

  const categories = [
    { key: 'communication_skills', label: 'Communication Skills' },
    { key: 'technical_knowledge', label: 'Technical Knowledge' },
    { key: 'problem_solving', label: 'Problem Solving' },
    { key: 'cultural_fit', label: 'Cultural Fit' },
    { key: 'confidence_and_clarity', label: 'Confidence & Clarity' },
  ];

  const averageScore =
    categories.reduce(
      (sum, category) =>
        sum + report.feedback[category.key as keyof Feedback].score,
      0
    ) / categories.length;

  return (
    <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 md:py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Interview Results
          </h1>
          <p className="text-muted-foreground">
            {report.interview.role} • {report.interview.type} •{' '}
            {report.interview.level}
          </p>
          <p className="text-sm text-muted-foreground">
            Completed on {new Date(report.created_at).toLocaleDateString()}
          </p>
        </div>

        <div className="grid gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Overall Performance
                <Badge className={getScoreColor(averageScore)}>
                  {averageScore.toFixed(1)}/10 - {getScoreText(averageScore)}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${(averageScore / 10) * 100}%` }}></div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Average score across all categories
              </p>
            </CardContent>
          </Card>

          {categories.map((category) => {
            const feedback = report.feedback[category.key as keyof Feedback];
            return (
              <Card key={category.key}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {category.label}
                    <Badge className={getScoreColor(feedback.score)}>
                      {feedback.score}/10
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${(feedback.score / 10) * 100}%`,
                      }}></div>
                  </div>
                  <p className="text-sm leading-relaxed">{feedback.comments}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="flex gap-4 justify-center">
          <Button asChild>
            <Link href="/explore">Take Another Interview</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard">View All Results</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
