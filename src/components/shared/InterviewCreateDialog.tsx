'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { X } from 'lucide-react';
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
  Input,
  Badge,
  Textarea,
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui';
import { useState, KeyboardEvent } from 'react';
import { toast } from 'sonner';

const formSchema = z.object({
  role: z.string().min(2, {
    message: 'Role must be at least 2 characters.',
  }),
  type: z.enum(['technical', 'behavioral', 'mixed'], {
    required_error: 'Please select an interview type.',
  }),
  level: z.enum(['entry', 'mid', 'senior'], {
    required_error: 'Please select an experience level.',
  }),
  techstack: z.array(z.string()).min(1, {
    message: 'Please add at least one technology.',
  }),
  amount: z
    .number()
    .min(1, {
      message: 'Please specify at least 1 question.',
    })
    .max(10, {
      message: 'Maximum 10 questions allowed.',
    }),
  additionalInfo: z.string().max(100).optional(),
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

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: '',
      type: 'mixed',
      level: 'mid',
      techstack: [],
      amount: 5,
      additionalInfo: '',
    },
  });

  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (
    event: KeyboardEvent<HTMLInputElement>,
    field: { onChange: (value: string[]) => void; value: string[] }
  ) => {
    if (
      (event.key === 'Enter' || event.key === ' ') &&
      inputValue.trim() !== ''
    ) {
      event.preventDefault();
      if (!field.value.includes(inputValue.trim())) {
        field.onChange([...field.value, inputValue.trim()]);
      }
      setInputValue('');
    } else if (event.key === 'Backspace' && inputValue === '') {
      event.preventDefault();
      const newValue = [...field.value];
      newValue.pop();
      field.onChange(newValue);
    }
  };

  async function onSubmit(values: FormSchema) {
    try {
      setIsLoading(true);
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...values,
          techstack: values.techstack.map((tech) => tech.trim()),
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Failed to generate interview');
      }

      toast.success('Your interview has been generated.');
      form.reset();
      setOpen(false);
      router.refresh();
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
            Create an interview to help you prepare for your next job interview.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Frontend Developer" {...field} />
                  </FormControl>
                  <FormDescription>
                    What role are you interviewing for?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Interview Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-row space-x-1">
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="technical" />
                        </FormControl>
                        <FormLabel className="font-normal">Technical</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="behavioral" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Behavioral
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="mixed" />
                        </FormControl>
                        <FormLabel className="font-normal">Mixed</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormDescription>
                    Choose the type of interview questions you want to practice
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Experience Level</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-row space-x-1">
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="entry" />
                        </FormControl>
                        <FormLabel className="font-normal">Entry</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="mid" />
                        </FormControl>
                        <FormLabel className="font-normal">Mid</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="senior" />
                        </FormControl>
                        <FormLabel className="font-normal">Senior</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormDescription>
                    Select your experience level
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="techstack"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tech Stack</FormLabel>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {field.value.map((tech) => (
                      <Badge
                        key={tech}
                        className="flex items-center gap-1 pr-1">
                        {tech}
                        <button
                          type="button"
                          onClick={() => {
                            const newValue = field.value.filter(
                              (t) => t !== tech
                            );
                            field.onChange(newValue);
                          }}
                          className="ml-1 rounded-full outline-none focus:outline-none">
                          <X className="h-3 w-3 cursor-pointer hover:text-destructive" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <FormControl>
                    <Input
                      placeholder="Type and press Enter or Space to add technologies"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, field)}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the technologies you want to be tested on
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field: { onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>Number of Questions</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      onChange={(e) => onChange(Number(e.target.value))}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    How many questions would you like? (1-10)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="additionalInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Information</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Textarea
                        placeholder="Any additional information you'd like to add..."
                        className="min-h-[100px] resize-none"
                        maxLength={100}
                        {...field}
                      />
                      <div className="absolute bottom-2 right-2 text-sm text-muted-foreground">
                        {field.value?.length || 0}/100
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Optional: Add any specific requirements or preferences
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                type="button">
                Cancel
              </Button>
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
