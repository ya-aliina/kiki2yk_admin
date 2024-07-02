'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import {
    Copy, Edit, MoreVerticalIcon, Trash,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { deleteObject, ref } from '@firebase/storage';
import axios from 'axios';
import { BillboardColumns } from '@/app/(dashboard)/[storeId]/(routes)/billboards/_components/columns';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { storage } from '@/lib/firebase';
import AlertModal from '@/components/modal/alert-modal';

interface CellActionsProps {
    data: BillboardColumns
}

const CellActions = ({ data }: CellActionsProps) => {
    const router = useRouter();
    const params = useParams();

    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const onCopy = (id: string) => {
        navigator.clipboard.writeText(id);
        toast.success('Billboard is copied to clipboard');
    };

    const onDelete = async () => {
        try {
            setIsLoading(true);
            await deleteObject(ref(storage, data.imageUrl)).then(async () => {
                await axios.delete(`/api/${params.storeId}/billboards/${data.id}`);
            });

            location.reload();
            router.push(`/${params.storeId}/billboards`);
            toast.success('Billboard Removed');
        } catch (err) {
            toast.error('Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={isLoading}
            />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button className="w-8 h-8 p-0" variant="ghost">
                        <span className="sr-only">Open</span>
                        <MoreVerticalIcon className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onCopy(data.id)}>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Id
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => router.push(`/${params.storeId}/billboards/${data.id}`)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setOpen(true)}>
                        <Trash className="h-4 w-4 mr-2" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export default CellActions;
