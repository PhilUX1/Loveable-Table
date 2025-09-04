import React from 'react';
import { Table } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Settings2, Filter, X } from 'lucide-react';

interface TableFiltersProps<TData> {
  table: Table<TData>;
}

export function TableFilters<TData>({ table }: TableFiltersProps<TData>) {
  const columnFilters = table.getState().columnFilters;

  return (
    <div className="flex items-center space-x-2">
      {/* Column Filters */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            Filters
            {columnFilters.length > 0 && (
              <span className="ml-1 rounded-full bg-primary text-primary-foreground px-2 py-1 text-xs">
                {columnFilters.length}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Column Filters</h4>
              {columnFilters.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => table.resetColumnFilters()}
                  className="h-8 px-2 lg:px-3"
                >
                  Clear all
                  <X className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="space-y-3">
              {table
                .getAllColumns()
                .filter((column) => column.getCanFilter() && column.id !== 'drag' && column.id !== 'expand')
                .map((column) => (
                  <div key={column.id} className="space-y-2">
                    <Label className="text-sm font-medium">
                      {typeof column.columnDef.header === 'string'
                        ? column.columnDef.header
                        : column.id}
                    </Label>
                    <Input
                      placeholder={`Filter ${column.id}...`}
                      value={(column.getFilterValue() as string) ?? ''}
                      onChange={(e) => column.setFilterValue(e.target.value)}
                      className="h-8"
                    />
                  </div>
                ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Column Visibility */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Settings2 className="h-4 w-4" />
            Columns
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {table
            .getAllColumns()
            .filter((column) => column.getCanHide())
            .map((column) => (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {typeof column.columnDef.header === 'string'
                  ? column.columnDef.header
                  : column.id}
              </DropdownMenuCheckboxItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}