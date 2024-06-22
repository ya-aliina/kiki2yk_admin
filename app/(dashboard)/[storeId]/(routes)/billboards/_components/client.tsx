'use client';

import { useParams, useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';

const BillboardClient = () => {
    const params = useParams();
    const router = useRouter();

    return (
        <div className="flex items-center justify-between">
            <Heading
                title="Billboards (0)"
                description="Manage Billboards for your store"
            />

            <Button onClick={() => router.push(`/${params.storeId}/billboards/new`)}>
                <Plus className="h-4 w-4 mr-2" />
                Add new
            </Button>
        </div>
    );
};

export default BillboardClient;
