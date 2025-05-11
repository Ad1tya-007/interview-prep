'use client';

import { ColumnDef } from '@tanstack/react-table';

import { DataTable, DataTableColumnHeader } from '@/components/shared';
import { EyeIcon, StarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import RoleBadge from '@/components/shared/RoleBadge';

type Interview = {
  id: number;
  title: string;
  rating: number;
  description: string;
  role: string;
};

// Sample data for the table
const interviews: Interview[] = [
  {
    id: 1,
    title: 'Senior React Developer',
    rating: 85,
    description:
      'Candidate showed strong knowledge of React hooks and performance optimization techniques. They struggled a bit with system design questions.',
    role: 'senior',
  },
  {
    id: 2,
    title: 'Full Stack Engineer',
    rating: 92,
    description:
      'Excellent communication skills and technical knowledge. Performed well on both frontend and backend questions. Very strong candidate.',
    role: 'senior',
  },
  {
    id: 3,
    title: 'DevOps Engineer',
    rating: 78,
    description:
      'Good understanding of CI/CD pipelines and containerization. Needs to improve on cloud infrastructure knowledge.',
    role: 'mid',
  },
  {
    id: 4,
    title: 'Product Manager',
    rating: 88,
    description:
      'Strong product sense and leadership qualities. Provided clear examples of past product launches and how they measured success.',
    role: 'senior',
  },
  {
    id: 5,
    title: 'UI/UX Designer',
    rating: 94,
    description:
      'Exceptional portfolio and design thinking process. Demonstrated excellent understanding of user research and accessibility concerns.',
    role: 'senior',
  },
  {
    id: 6,
    title: 'Junior Software Engineer',
    rating: 72,
    description:
      'Shows promise but needs more practical experience. Strong computer science fundamentals but lacks industry experience.',
    role: 'junior',
  },
  {
    id: 7,
    title: 'Data Scientist',
    rating: 90,
    description:
      'Very strong statistical knowledge and machine learning expertise. Well-versed in Python and data visualization techniques.',
    role: 'senior',
  },
  {
    id: 8,
    title: 'Senior React Developer',
    rating: 85,
    description:
      'Candidate showed strong knowledge of React hooks and performance optimization techniques. They struggled a bit with system design questions.',
    role: 'senior',
  },
  {
    id: 9,
    title: 'Full Stack Engineer',
    rating: 92,
    description:
      'Excellent communication skills and technical knowledge. Performed well on both frontend and backend questions. Very strong candidate.',
    role: 'senior',
  },
  {
    id: 10,
    title: 'DevOps Engineer',
    rating: 78,
    description:
      'Good understanding of CI/CD pipelines and containerization. Needs to improve on cloud infrastructure knowledge.',
    role: 'mid',
  },
  {
    id: 11,
    title: 'Product Manager',
    rating: 88,
    description:
      'Strong product sense and leadership qualities. Provided clear examples of past product launches and how they measured success.',
    role: 'senior',
  },
  {
    id: 12,
    title: 'UI/UX Designer',
    rating: 94,
    description:
      'Exceptional portfolio and design thinking process. Demonstrated excellent understanding of user research and accessibility concerns.',
    role: 'senior',
  },
  {
    id: 13,
    title: 'Junior Software Engineer',
    rating: 72,
    description:
      'Shows promise but needs more practical experience. Strong computer science fundamentals but lacks industry experience.',
    role: 'junior',
  },
  {
    id: 14,
    title: 'Data Scientist',
    rating: 90,
    description:
      'Very strong statistical knowledge and machine learning expertise. Well-versed in Python and data visualization techniques.',
    role: 'senior',
  },
  {
    id: 15,
    title: 'Product Manager',
    rating: 88,
    description:
      'Strong product sense and leadership qualities. Provided clear examples of past product launches and how they measured success.',
    role: 'senior',
  },
  {
    id: 16,
    title: 'UI/UX Designer',
    rating: 94,
    description:
      'Exceptional portfolio and design thinking process. Demonstrated excellent understanding of user research and accessibility concerns.',
    role: 'senior',
  },
  {
    id: 17,
    title: 'Junior Software Engineer',
    rating: 72,
    description:
      'Shows promise but needs more practical experience. Strong computer science fundamentals but lacks industry experience.',
    role: 'junior',
  },
  {
    id: 18,
    title: 'Data Scientist',
    rating: 90,
    description:
      'Very strong statistical knowledge and machine learning expertise. Well-versed in Python and data visualization techniques.',
    role: 'senior',
  },
  {
    id: 19,
    title: 'Junior Software Engineer',
    rating: 72,
    description:
      'Shows promise but needs more practical experience. Strong computer science fundamentals but lacks industry experience.',
    role: 'junior',
  },
  {
    id: 20,
    title: 'Data Scientist',
    rating: 90,
    description:
      'Very strong statistical knowledge and machine learning expertise. Well-versed in Python and data visualization techniques.',
    role: 'senior',
  },
];

// Column definitions for the data table
const columns: ColumnDef<Interview>[] = [
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
  },

  {
    accessorKey: 'description',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => {
      const description: string = row.getValue('description');

      return (
        <div className="max-w-[500px] truncate" title={description}>
          {description}
        </div>
      );
    },
  },
  {
    accessorKey: 'role',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => {
      const role: string = row.getValue('role');

      return <RoleBadge type={role} />;
    },
  },
  {
    accessorKey: 'rating',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Rating" />
    ),
    cell: ({ row }) => {
      const rating = parseInt(row.getValue('rating'));

      return (
        <div className="flex items-center gap-2">
          <StarIcon className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="font-medium">{rating} %</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'actions',
    header: () => <div>Actions</div>,
    cell: () => {
      return (
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <EyeIcon className="w-4 h-4" />
          </Button>
        </div>
      );
    },
  },
];

export default function ReportsPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Reports</h1>
      <DataTable columns={columns} data={interviews} />
    </div>
  );
}
