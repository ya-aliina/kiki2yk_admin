'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import CellImage from '@/app/(dashboard)/[storeId]/(routes)/categories/_components/cell-image';
import { Button } from '@/components/ui/button';
import CellActions from '@/app/(dashboard)/[storeId]/(routes)/categories/_components/cell-actions';

export type CategoryColumns = {
    id: string,
    label: string,
    imageUrl: string,
    createdAt: string
}

export const columns: ColumnDef<CategoryColumns>[] = [
    {
        accessorKey: 'imageUrl',
        header: 'Image',
        cell: ({ row }) => {
            const { imageUrl } = row.original;
            return (
                <CellImage imageUrl={imageUrl} />
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
                    Category Name
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
