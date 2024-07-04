'use client';

import { useParams, useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { DataTable } from '@/components/ui/data-table';
import { SizeColumns, columns } from '@/app/(dashboard)/[storeId]/(routes)/sizes/_components/columns';

interface SizeClientProps {
    data: SizeColumns[],
}

const SizeClient = ({ data }: SizeClientProps) => {
    const params = useParams();
    const router = useRouter();

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <Heading
                    title={`Sizes (${data.length})`}
                    description="Manage Sizes for your store"
                />

                <Button onClick={() => router.push(`/${params.storeId}/sizes/create`)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add new
                </Button>
            </div>
            <Separator />
            <DataTable searchKey="label" columns={columns} data={data} />
        </div>
    );
};

export default SizeClient;
