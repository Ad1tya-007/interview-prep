import { Badge } from '@/components/ui/badge';

const roleDetails = {
  junior: {
    bg: 'bg-emerald-600/10 dark:bg-emerald-600/20 hover:bg-emerald-600/10',
    text: 'text-emerald-500',
    dot: 'bg-emerald-500',
    label: 'Junior',
  },
  mid: {
    bg: 'bg-amber-600/10 dark:bg-amber-600/20 hover:bg-amber-600/10',
    text: 'text-amber-500',
    dot: 'bg-amber-500',
    label: 'Mid',
  },
  senior: {
    bg: 'bg-red-600/10 dark:bg-red-600/20 hover:bg-red-600/10',
    text: 'text-red-500',
    dot: 'bg-red-500',
    label: 'Senior',
  },
};

interface RoleBadgeProps {
  type: string;
}

const RoleBadge = ({ type }: RoleBadgeProps) => {
  const { bg, text, dot, label } =
    roleDetails[type as keyof typeof roleDetails];

  return (
    <Badge className={`${bg} ${text} shadow-none rounded-full gap-2`}>
      <div className={`h-1.5 w-1.5 rounded-full ${dot}`} /> {label}
    </Badge>
  );
};

export default RoleBadge;
