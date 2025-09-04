import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getExpandedRowModel,
  ColumnDef,
  flexRender,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  ExpandedState,
  Row,
} from '@tanstack/react-table';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TableFilters } from './TableFilters';
import { TableRow } from './TableRow';
import { TablePagination } from './TablePagination';
import { ColumnResizer } from './ColumnResizer';
import { ChevronRight, ChevronDown, GripVertical } from 'lucide-react';

interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  onDataChange?: (data: TData[]) => void;
  renderExpandedRow?: (row: Row<TData>) => React.ReactNode;
}

export function DataTable<TData>({
  data: initialData,
  columns: initialColumns,
  onDataChange,
  renderExpandedRow,
}: DataTableProps<TData>) {
  const [data, setData] = useState(initialData);
  const [columns, setColumns] = useState(initialColumns);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [globalFilter, setGlobalFilter] = useState('');

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Enhanced columns with drag handle and expand button
  const enhancedColumns = useMemo(() => {
    const dragColumn: ColumnDef<TData> = {
      id: 'drag',
      header: '',
      cell: () => (
        <div className="flex items-center justify-center w-4">
          <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab hover:text-foreground" />
        </div>
      ),
      size: 40,
      enableSorting: false,
      enableHiding: false,
    };

    const expandColumn: ColumnDef<TData> = {
      id: 'expand',
      header: '',
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => row.toggleExpanded()}
          className="p-0 h-4 w-4"
        >
          {row.getIsExpanded() ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      ),
      size: 40,
      enableSorting: false,
      enableHiding: false,
    };

    return [dragColumn, expandColumn, ...columns];
  }, [columns]);

  const table = useReactTable({
    data,
    columns: enhancedColumns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
      expanded,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (active.id !== over?.id) {
      const activeIndex = data.findIndex((item: any) => item.id === active.id);
      const overIndex = data.findIndex((item: any) => item.id === over?.id);
      
      const newData = arrayMove(data, activeIndex, overIndex);
      setData(newData);
      onDataChange?.(newData);
    }
  };

  const handleColumnReorder = (columnId: string, newIndex: number) => {
    const currentColumns = [...columns];
    const columnIndex = currentColumns.findIndex(col => col.id === columnId);
    if (columnIndex !== -1) {
      const [movedColumn] = currentColumns.splice(columnIndex, 1);
      currentColumns.splice(newIndex, 0, movedColumn);
      setColumns(currentColumns);
    }
  };

  return (
    <div className="space-y-4 p-6 bg-background rounded-lg border border-table-border shadow-sm">
      {/* Global Search and Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search all columns..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <TableFilters table={table} />
      </div>

      {/* Data Table */}
      <div className="rounded-md border border-table-border overflow-hidden">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis]}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              {/* Table Header */}
              <thead className="bg-table-header">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className="border-b border-table-border">
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-4 py-3 text-left text-sm font-semibold text-table-header-foreground relative"
                        style={{ width: header.getSize() }}
                      >
                        <div className="flex items-center space-x-2">
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                          {header.column.getCanSort() && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-0 h-4 w-4"
                              onClick={header.column.getToggleSortingHandler()}
                            >
                              {{
                                asc: '↑',
                                desc: '↓',
                              }[header.column.getIsSorted() as string] ?? '↕'}
                            </Button>
                          )}
                        </div>
                        {header.column.getCanResize() && (
                          <ColumnResizer
                            header={header}
                            onReorder={handleColumnReorder}
                          />
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>

              {/* Table Body */}
              <tbody>
                <SortableContext
                  items={data.map((item: any) => item.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {table.getRowModel().rows.map((row) => (
                    <React.Fragment key={row.id}>
                      <TableRow
                        row={row}
                        id={(row.original as any).id}
                        isExpanded={row.getIsExpanded()}
                      />
                      {row.getIsExpanded() && renderExpandedRow && (
                        <tr>
                          <td
                            colSpan={row.getVisibleCells().length}
                            className="px-4 py-3 bg-muted/30"
                          >
                            {renderExpandedRow(row)}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </SortableContext>
              </tbody>
            </table>
          </div>
        </DndContext>
      </div>

      {/* Pagination */}
      <TablePagination table={table} />
    </div>
  );
}