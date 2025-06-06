/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Button,
  Badge,
} from '@/components/ui';

import { DataTableFilter } from './data-table-filter';
import { DataTableViewOptions } from './data-table-view-options';
import { DataTablePagination } from './data-table-pagination';
import { DownloadIcon, StarIcon } from 'lucide-react';
import { DataTableColumnHeader } from './data-table-column-header';
import RoleBadge from '../RoleBadge';
import DeleteButton from './DeleteButton';
import { useRouter } from 'next/navigation';

const categories = [
  { key: 'communication_skills' },
  { key: 'technical_knowledge' },
  { key: 'problem_solving' },
  { key: 'cultural_fit' },
  { key: 'confidence_and_clarity' },
];

interface DataTableProps<TData> {
  data: TData[];
}
// Column definitions for the data table
const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'role',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => {
      const interview = row.original.interviews;
      return <div className="capitalize">{interview.role}</div>;
    },
  },
  // {
  //   accessorKey: 'description',
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Description" />
  //   ),
  //   cell: ({ row }) => {
  //     const description: string = row.getValue('description');

  //     return (
  //       <div className="max-w-[500px] truncate" title={description}>
  //         {description}
  //       </div>
  //     );
  //   },
  // },
  {
    accessorKey: 'level',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Level" />
    ),
    cell: ({ row }) => {
      const interview = row.original.interviews;
      return <RoleBadge level={interview.level} />;
    },
  },
  {
    accessorKey: 'type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => {
      const interview = row.original.interviews;
      return <div className="capitalize">{interview.type}</div>;
    },
  },
  {
    accessorKey: 'techstack',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tech Stack" />
    ),
    cell: ({ row }) => {
      const interview = row.original.interviews;
      return (
        <div className="flex flex-wrap gap-1">
          {interview.techstack.map((tech: string) => (
            <Badge key={tech} className="capitalize">
              {tech}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: 'rating',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Rating" />
    ),
    cell: ({ row }) => {
      const averageScore =
        categories.reduce(
          (sum, category) => sum + row.original.feedback[category.key].score,
          0
        ) / categories.length;

      return (
        <div className="flex items-center gap-2">
          <StarIcon className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="font-medium">{averageScore * 10} %</span>
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
          <DeleteButton />
          <Button variant="outline" size="sm">
            <DownloadIcon className="w-3 h-3" />
          </Button>
        </div>
      );
    },
  },
];

export function DataTable<TData>({ data }: DataTableProps<TData>) {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
      pagination,
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DataTableFilter table={table} />
          <DataTableViewOptions table={table} />
        </div>
        <DataTablePagination table={table} />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      onClick={() =>
                        router.push(`/interview/results/${row.original.id}`)
                      }>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
