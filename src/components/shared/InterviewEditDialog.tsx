'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Button,
  Badge,
  Textarea,
} from '@/components/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Interview } from '@supabase/types';
import { updateInterview } from '@/app/(root)/interviews/actions';

const formSchema = z.object({
  role: z.string().min(2, {
    message: 'Role must be at least 2 characters.',
  }),
  description: z
    .string()
    .min(10, {
      message: 'Description must be at least 10 characters.',
    })
    .max(250, {
      message: 'Description cannot exceed 250 characters.',
    }),
  tags: z
    .array(z.string())
    .min(1, {
      message: 'Please add at least one tag.',
    })
    .max(4, {
      message: 'You can only add up to 4 tags.',
    }),
});

interface InterviewEditDialogProps {
  interview: Interview;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function InterviewEditDialog({
  interview,
  isOpen,
  onOpenChange,
}: InterviewEditDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: interview.role,
      description: interview.description,
      tags: interview.tags,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);
      await updateInterview(interview.id, {
        ...values,
        level: interview.level || '',
        type: interview.type,
      });
      toast.success('Interview updated successfully');
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      console.error('Error updating interview:', error);
      toast.error('Failed to update interview');
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleTagRemove = (tagToRemove: string) => {
    const currentTags = form.getValues('tags');
    form.setValue(
      'tags',
      currentTags.filter((tag) => tag !== tagToRemove)
    );
  };

  const handleTagAdd = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && event.currentTarget.value) {
      event.preventDefault();
      const newTag = event.currentTarget.value.trim();
      const currentTags = form.getValues('tags');

      if (currentTags.length >= 4) {
        toast.error('You can only add up to 4 tags');
        event.currentTarget.value = '';
        return;
      }

      if (newTag && !currentTags.includes(newTag)) {
        form.setValue('tags', [...currentTags, newTag]);
        event.currentTarget.value = '';
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Interview</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <Input placeholder="Software Engineer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Textarea
                        placeholder="Describe the interview and role requirements..."
                        className="resize-y min-h-[120px]"
                        maxLength={250}
                        {...field}
                      />
                      <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                        {field.value?.length || 0}/250
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags (max 4)</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        {field.value.map((tag) => (
                          <Badge
                            key={tag}
                            className="cursor-pointer"
                            onClick={() => handleTagRemove(tag)}>
                            {tag} ×
                          </Badge>
                        ))}
                      </div>
                      <Input
                        placeholder="Press Enter to add tags"
                        onKeyDown={handleTagAdd}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
