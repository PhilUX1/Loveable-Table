import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/DataTable';
import { Employee, sampleEmployees } from '@/data/sampleData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Mail, Phone } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Index = () => {
  const columns: ColumnDef<Employee>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.getValue('name')}</span>
          <span className="text-sm text-muted-foreground">{row.original.position}</span>
        </div>
      ),
    },
    {
      accessorKey: 'department',
      header: 'Department',
      cell: ({ row }) => (
        <Badge variant="secondary" className="font-normal">
          {row.getValue('department')}
        </Badge>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        return (
          <Badge
            variant={status === 'Active' ? 'default' : status === 'On Leave' ? 'secondary' : 'destructive'}
          >
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'salary',
      header: 'Salary',
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue('salary'));
        const formatted = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(amount);
        return <span className="font-medium">{formatted}</span>;
      },
    },
    {
      accessorKey: 'location',
      header: 'Location',
    },
    {
      accessorKey: 'hireDate',
      header: 'Hire Date',
      cell: ({ row }) => {
        const date = new Date(row.getValue('hireDate'));
        return date.toLocaleDateString();
      },
    },
    {
      accessorKey: 'performance',
      header: 'Performance',
      cell: ({ row }) => {
        const rating = row.getValue('performance') as number;
        return (
          <div className="flex items-center space-x-2">
            <span className="font-medium">{rating}</span>
            <div className="flex space-x-1">
              {Array.from({ length: 5 }, (_, i) => (
                <div
                  key={i}
                  className={`h-2 w-2 rounded-full ${
                    i < Math.floor(rating) ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>
        );
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const employee = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(employee.id)}
              >
                Copy employee ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View employee</DropdownMenuItem>
              <DropdownMenuItem>View payment details</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const renderExpandedRow = (row: any) => {
    const employee = row.original as Employee;
    return (
      <div className="p-4 bg-muted/20 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <h4 className="font-semibold mb-2">Contact Information</h4>
            <div className="space-y-1 text-sm">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{employee.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{employee.phone}</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Manager</h4>
            <p className="text-sm">{employee.manager}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Skills</h4>
            <div className="flex flex-wrap gap-1">
              {employee.skills.map((skill) => (
                <Badge key={skill} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Employee Data Table</h1>
          <p className="text-muted-foreground mt-2">
            A comprehensive data table with filtering, sorting, resizing, reordering, pagination, and drag & drop.
          </p>
        </div>
        
        <DataTable
          data={sampleEmployees}
          columns={columns}
          renderExpandedRow={renderExpandedRow}
        />
      </div>
    </div>
  );
};

export default Index;
