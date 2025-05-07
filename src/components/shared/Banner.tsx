import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui';

export default function Banner() {
  return (
    <Card className="w-full text-left shadow-none py-4">
      <CardHeader>
        <CardTitle className="mb-2 text-3xl font-bold">
          Power up your interview skills
        </CardTitle>
        <CardDescription className="text-base text-muted-foreground">
          Unlock your interview potential with our comprehensive preparation
          tools and expert insights.
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
