'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import CellImage from '@/app/(dashboard)/[storeId]/(routes)/sizes/_components/cell-image';
import { Button } from '@/components/ui/button';
import CellActions from '@/app/(dashboard)/[storeId]/(routes)/sizes/_components/cell-actions';

export type SizeColumns = {
    id: string,
    name: string,
    value: string,
    createdAt: string
}

export const columns: ColumnDef<SizeColumns>[] = [
    {
        accessorKey: 'imageUrl',
        header: 'Image',
        cell: ({ row }) => {
            const { value } = row.original;
            return (
                <CellImage value={value} />
            );
        },
    },
    {
        accessorKey: 'label',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Size Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },

    },
    {
        accessorKey: 'createdAt',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => <CellActions data={row.original} />,
    },
];
