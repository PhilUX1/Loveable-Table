import React, { useState } from 'react';
import { Header } from '@tanstack/react-table';

interface ColumnResizerProps<TData> {
  header: Header<TData, unknown>;
  onReorder?: (columnId: string, newIndex: number) => void;
}

export function ColumnResizer<TData>({ header }: ColumnResizerProps<TData>) {
  const [isResizing, setIsResizing] = useState(false);

  return (
    <div
      className="absolute right-0 top-0 h-full w-1 cursor-col-resize select-none touch-none hover:bg-primary/50 active:bg-primary"
      style={{
        userSelect: 'none',
      }}
      onMouseDown={(e) => {
        setIsResizing(true);
        header.getResizeHandler()(e);
      }}
      onTouchStart={(e) => {
        setIsResizing(true);
        header.getResizeHandler()(e);
      }}
      onMouseUp={() => setIsResizing(false)}
      onTouchEnd={() => setIsResizing(false)}
    >
      <div
        className={`h-full w-full transition-colors ${
          isResizing ? 'bg-primary' : ''
        }`}
      />
    </div>
  );
}