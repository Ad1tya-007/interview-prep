'use client';

import { useAuth } from '@/context/AuthContext';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Skeleton,
} from '@/components/ui';
import { BadgeCheck, EllipsisVertical, Star, User } from 'lucide-react';

export default function UserProfile() {
  const { user, isLoading } = useAuth();
  const isPro = true;
  const interviewCount = 4;

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
          <div className="flex flex-row gap-2 items-end">
            <CardTitle className="text-2xl font-bold">
              {isLoading ? 'Loading..' : user?.email?.split('@')[0]}
            </CardTitle>
            {!isLoading && (
              <div className="flex flex-wrap gap-2 mt-1">
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
      <CardContent>
        {isLoading ? (
          <div className="grid grid-cols-3 gap-4 justify-center items-center">
            <div className="flex justify-center items-center">
              <Skeleton className="h-12 w-12" />
            </div>
            <div className="flex justify-center items-center">
              <Skeleton className="h-12 w-12" />
            </div>
            <div className="flex justify-center items-center">
              <Skeleton className="h-12 w-12" />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <p className="text-md md:text-lg lg:text-xl font-bold">5</p>
              <p className="text-xs text-muted-foreground">
                Interviews Completed
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-md md:text-lg lg:text-xl font-bold">8</p>
              <p className="text-xs text-muted-foreground">Hours Practiced</p>
            </div>
            <div className="space-y-1">
              <p className="text-md md:text-lg lg:text-xl font-bold">
                76.5 / 100
              </p>
              <p className="text-xs text-muted-foreground">
                Average Interview Rating
              </p>
            </div>
          </div>
        )}
      </CardContent>
      <div className="absolute top-0 right-0 p-4 hover:cursor-pointer">
        <EllipsisVertical className="h-5 w-5" />
      </div>
    </Card>
  );
}
