import { DataTable } from '@/components/shared';

const interviews = [
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
    role: 'entry',
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
    role: 'entry',
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
    role: 'entry',
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
    role: 'entry',
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

export default function ReportsPage() {
  return (
    <div className="container mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground mt-2 text-md">
          View and analyze all interview reports. Use the pagination to navigate
          between pages and adjust how many interviews you see at once.
        </p>
      </div>
      <DataTable data={interviews} />
    </div>
  );
}
