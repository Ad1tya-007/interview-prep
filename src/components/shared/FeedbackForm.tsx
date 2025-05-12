'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

// Define form schema with validation
const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  subject: z.string().min(5, {
    message: 'Subject must be at least 5 characters.',
  }),
  message: z
    .string()
    .min(10, {
      message: 'Message must be at least 10 characters.',
    })
    .max(500, {
      message: 'Message must not exceed 500 characters.',
    }),
});

// Type for form values
type FeedbackFormValues = z.infer<typeof formSchema>;

export default function FeedbackForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Define the form
  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  // Submit handler
  function onSubmit(values: FeedbackFormValues) {
    // In a real app, this would send the form data to a server
    console.log('Feedback submitted:', values);
    setIsSubmitted(true);

    // Reset form after submission
    setTimeout(() => {
      form.reset({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
      setIsSubmitted(false);
    }, 3000);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Your email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <FormControl>
                <Input placeholder="Subject of your feedback" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={
                    'Please share what you like about our platform and what could be improved.'
                  }
                  className="min-h-[120px] resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                &quot;Your general feedback helps us understand what&apos;s
                working and what needs improvement.&quot;
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitted}>
            {isSubmitted ? 'Feedback Sent!' : 'Send Feedback'}
          </Button>
        </div>

        {isSubmitted && (
          <div className="text-sm text-green-600 dark:text-green-400 font-medium">
            Thank you for your feedback. We appreciate your input!
          </div>
        )}
      </form>
    </Form>
  );
}
