import { DataTable } from '@/components/shared';
import { getReportsOfCurrentUser } from './actions';

export default async function ReportsPage() {
  const { reports } = await getReportsOfCurrentUser();

  return (
    <div className="container mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground mt-2 text-md">
          View and analyze all interview reports. Use the pagination to navigate
          between pages and adjust how many interviews you see at once.
        </p>
      </div>
      <DataTable data={reports} />
    </div>
  );
}
