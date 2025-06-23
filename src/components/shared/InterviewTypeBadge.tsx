import { Badge } from '@/components/ui';

const typeStyles: Record<string, string> = {
  Behavioral:
    'bg-emerald-600/10 dark:bg-emerald-600/20 hover:bg-emerald-600/10 text-emerald-500',
  Technical:
    'bg-amber-600/10 dark:bg-amber-600/20 hover:bg-amber-600/10 text-amber-500',
  Mixed: 'bg-red-600/10 dark:bg-red-600/20 hover:bg-red-600/10 text-red-500',
};

export default function InterviewTypeBadge({ type }: { type: string }) {
  const baseClasses = 'shadow-none rounded-full';
  const typeClass = typeStyles[type];
  return <Badge className={`${typeClass} ${baseClasses}`}>{type}</Badge>;
}
