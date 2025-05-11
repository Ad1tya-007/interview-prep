import * as React from 'react';
import { Table } from '@tanstack/react-table';
import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface DataTableFilterProps<TData> {
  table: Table<TData>;
  placeholder?: string;
}

export function DataTableFilter<TData>({
  table,
  placeholder = 'Filter...',
}: DataTableFilterProps<TData>) {
  const [value, setValue] = React.useState<string>('');

  const onFilterChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      table.setGlobalFilter(event.target.value);
      setValue(event.target.value);
    },
    [table]
  );

  return (
    <div className="flex items-center gap-2">
      <Input
        placeholder={placeholder}
        value={value}
        onChange={onFilterChange}
        className="h-8 w-[150px] lg:w-[250px]"
      />
      {value && (
        <Button
          variant="ghost"
          onClick={() => {
            table.setGlobalFilter('');
            setValue('');
          }}
          className="h-8 px-2 lg:px-3">
          <X className="h-4 w-4" />
          <span className="sr-only">Clear filter</span>
        </Button>
      )}
    </div>
  );
}
