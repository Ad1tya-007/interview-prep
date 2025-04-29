import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui';

export default function Banner() {
  return (
    <Card className="w-full text-center shadow-none py-4">
      <CardHeader>
        <CardTitle className="mb-2 text-3xl font-bold">
          Power up your interview skills
        </CardTitle>
        <CardDescription className="text-base text-muted-foreground">
          Unlock your interview potential with our comprehensive preparation
          tools and expert insights.
        </CardDescription>
      </CardHeader>
      <CardContent className="mt-2 flex flex-row gap-2 justify-center">
        <Button>Create an Interview</Button>
        <Button variant="secondary">Get a demo</Button>
      </CardContent>
    </Card>
  );
}
