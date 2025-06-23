import { Badge } from '@/components/ui';

export default function LevelBadge({ level }: { level: string }) {
  return (
    <Badge className="rounded-full border-none bg-gradient-to-r from-sky-700 to-indigo-600 text-white">
      {level}
    </Badge>
  );
}
