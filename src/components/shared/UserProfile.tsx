'use client';

import { useAuth } from '@/context/AuthContext';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  Skeleton,
} from '@/components/ui';
import { BadgeCheck, EllipsisVertical, Star, User } from 'lucide-react';

interface UserProfileProps {
  interviewCount: number;
}

export default function UserProfile({ interviewCount }: UserProfileProps) {
  const { user, isLoading } = useAuth();
  const isPro = true;

  return (
    <Card className="w-full relative">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <Avatar className="h-16 w-16 border-2 border-primary">
          {isLoading ? (
            <>
              <Skeleton className="h-16 w-16" />
            </>
          ) : (
            <>
              <AvatarImage
                src={user?.user_metadata?.avatar_url || ''}
                alt="User avatar"
              />
              <AvatarFallback className="bg-primary/10 text-primary text-xl">
                {user?.email ? (
                  user.email.charAt(0).toUpperCase()
                ) : (
                  <User className="h-8 w-8" />
                )}
              </AvatarFallback>
            </>
          )}
        </Avatar>
        <div className="space-y-1">
          <div className="flex flex-row gap-2 items-center">
            <CardTitle className="text-2xl font-bold">
              {isLoading ? 'Loading..' : user?.email?.split('@')[0]}
            </CardTitle>
            {!isLoading && (
              <div className="flex flex-wrap gap-2">
                {isPro && (
                  <Badge
                    variant="outline"
                    className="flex items-center gap-1 text-primary border-primary">
                    <BadgeCheck className="h-3 w-3 fill-primary text-background" />
                    <p>Premium</p>
                  </Badge>
                )}
                {interviewCount > 0 && (
                  <Badge
                    variant="outline"
                    className="flex items-center gap-1 text-yellow-500 border-yellow-500">
                    <Star className="h-3 w-3 fill-yellow-500" />{' '}
                    {interviewCount} Interviews
                  </Badge>
                )}
              </div>
            )}
          </div>

          <CardDescription className="text-sm">{user?.email}</CardDescription>
        </div>
      </CardHeader>
      <div className="absolute top-0 right-0 p-4 hover:cursor-pointer">
        <EllipsisVertical className="h-5 w-5" />
      </div>
    </Card>
  );
}
