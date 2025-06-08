import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, MessageCircleCode } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background px-4">
      <div className="w-full max-w-3xl mx-auto text-center space-y-8">
        {/* Logo/Icon */}
        <div className="mb-8">
          <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <MessageCircleCode className="h-8 w-8 text-primary" />
          </div>
        </div>

        {/* Main Content */}
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
          Practice Interviews with AI
        </h1>

        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Get instant feedback, improve your confidence, and master your
          interview skills with our AI-powered practice platform.
        </p>

        {/* Example Bubbles */}
        <div className="space-y-4 my-12">
          <div className="bg-accent/50 p-4 rounded-lg max-w-md mx-auto text-left">
            <p className="text-sm text-muted-foreground">Example question</p>
            <p className="text-foreground">
              &ldquo;Tell me about a challenging project you worked on.&rdquo;
            </p>
          </div>
          <div className="bg-primary/10 p-4 rounded-lg max-w-md mx-auto text-left ml-8">
            <p className="text-sm text-muted-foreground">AI feedback</p>
            <p className="text-foreground">
              &ldquo;Good start! Try to include more specific metrics about your
              impact.&rdquo;
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <div>
          <Link href="/auth">
            <Button size="lg" className="px-8 py-6 text-lg">
              Start Practicing <ArrowRight className="ml-2" />
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-12 text-sm text-muted-foreground">
          <div>
            <p className="font-medium text-foreground">10,000+</p>
            <p>Practice Sessions</p>
          </div>
          <div className="hidden sm:block">
            <p className="font-medium text-foreground">24/7</p>
            <p>Availability</p>
          </div>
          <div>
            <p className="font-medium text-foreground">95%</p>
            <p>Success Rate</p>
          </div>
        </div>
      </div>
    </div>
  );
}
