/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Button,
  Badge,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui';
import {
  CalendarIcon,
  EditIcon,
  TrashIcon,
  EllipsisVerticalIcon,
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import InterviewTypeBadge from './InterviewTypeBadge';
import { useState } from 'react';
import InterviewDeleteDialog from './InterviewDeleteDialog';
import InterviewEditDialog from './InterviewEditDialog';

interface Interview {
  id: string;
  role: string;
  level: string;
  type: string;
  created_at: string;
  tags: string[];
  description: string;
  questions: string[];
}

interface InterviewDialogProps {
  interview: Interview;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function InterviewDialog({
  interview,
  open,
  setOpen,
}: InterviewDialogProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const isExplore = pathname === '/explore';

  if (!interview) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[600px]">
          <DialogHeader className="relative">
            <DialogTitle className="flex flex-row gap-2 items-center">
              {interview.role}
              <Badge>{interview.level}</Badge>
            </DialogTitle>
            <div className="flex flex-row gap-4 text-sm">
              <div className="flex flex-row items-center gap-2">
                <InterviewTypeBadge type={interview.type} />
              </div>
              {!isExplore && (
                <div className="flex flex-row items-center gap-2 ">
                  <CalendarIcon className="h-4 w-4" />
                  <p>{new Date(interview.created_at).toDateString()}</p>
                </div>
              )}
            </div>
            <div className="flex flex-row items-center gap-2 text-sm text-muted-foreground">
              <p>Tags: </p>
              <div className="flex flex-row items-center gap-2">
                {interview.tags.map((tag: string) => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <p>Description</p>
              <DialogDescription>{interview.description}</DialogDescription>
            </div>

            {!isExplore && (
              <div className="absolute top-0 right-0">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <EllipsisVerticalIcon className="h-6 w-6" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      className="cursor-pointer hover:bg-muted"
                      onClick={() => setIsEditDialogOpen(true)}>
                      <EditIcon className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer hover:bg-muted text-destructive"
                      onClick={() => setIsDeleteDialogOpen(true)}>
                      <TrashIcon className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => router.push(`/interview/call/${interview.id}`)}>
              Start Interview
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <InterviewDeleteDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        interviewId={interview.id}
        onDeleteSuccess={() => setOpen(false)}
      />

      <InterviewEditDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        interview={interview as Interview | any}
      />
    </>
  );
}
