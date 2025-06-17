'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Button,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Textarea,
} from '@/components/ui';
import { useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

const formSchema = z.object({
  info: z
    .string()
    .min(10, {
      message:
        'Please provide more details about the interview you want to prepare for.',
    })
    .max(500, {
      message: 'Please keep the description under 500 characters.',
    }),
});

type FormSchema = z.infer<typeof formSchema>;

interface InterviewCreateDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function InterviewCreateDialog({
  open,
  setOpen,
}: InterviewCreateDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      info: '',
    },
  });

  async function onSubmit(values: FormSchema) {
    try {
      setIsLoading(true);
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          info: values.info,
          userid: user?.id,
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Failed to generate interview');
      }

      toast.success('Your interview has been generated.');
      form.reset();
      setOpen(false);

      // Navigate to the interview call page
      if (data.interview?.id) {
        router.push(`/interview/call/${data.interview.id}`);
      } else {
        router.refresh();
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(
        error instanceof Error ? error.message : 'Something went wrong'
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex flex-row gap-2 items-center">
            Create Interview
          </DialogTitle>
          <DialogDescription>
            Describe the interview you want to prepare for. Include details like
            the role, company (if any), level, and any specific areas you want
            to focus on.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="info"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interview Details</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Example: I'm preparing for a Senior Frontend Engineer position at Amazon. I want to focus on system design and React performance optimization."
                      className="h-32"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Include the role, level, company (if applicable), and any
                    specific areas you want to focus on.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Generating...' : 'Generate Interview'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
