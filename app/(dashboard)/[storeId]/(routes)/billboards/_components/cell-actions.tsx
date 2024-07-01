'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { BillboardColumns } from '@/app/(dashboard)/[storeId]/(routes)/billboards/_components/columns';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {Copy, Edit, MoreVerticalIcon, Trash} from "lucide-react";

interface CellActionsProps {
    data: BillboardColumns
}

const CellActions = ({ data }: CellActionsProps) => {
    const router = useRouter();
    const params = useParams();

    const [isLoading, setIsLoading] = useState(false);
    const [open, isOpen] = useState(false);

    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button className="w-8 h-8 p-0" variant="ghost">
                        <span className="sr-only">Open</span>
                        <MoreVerticalIcon className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => {}}>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Id
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {}}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {}}>
                        <Trash className="h-4 w-4 mr-2" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export default CellActions;
