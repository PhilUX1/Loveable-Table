import React from 'react';
import { flexRender, Row } from '@tanstack/react-table';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';

interface TableRowProps<TData> {
  row: Row<TData>;
  id: string;
  isExpanded?: boolean;
}

export function TableRow<TData>({ row, id, isExpanded }: TableRowProps<TData>) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={cn(
        'border-b border-table-border hover:bg-table-row-hover transition-colors',
        isDragging && 'opacity-50 z-50',
        isExpanded && 'bg-table-selected',
        row.getIsSelected() && 'bg-table-selected'
      )}
    >
      {row.getVisibleCells().map((cell, index) => (
        <td
          key={cell.id}
          className={cn(
            'px-4 py-3 text-sm text-foreground',
            index === 0 && 'cursor-grab active:cursor-grabbing'
          )}
          {...(index === 0 ? listeners : {})}
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </tr>
  );
}