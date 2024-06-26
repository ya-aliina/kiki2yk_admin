'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { BillboardColumns } from '@/app/(dashboard)/[storeId]/(routes)/billboards/_components/columns';

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
            CellActions
        </div>
    );
};

export default CellActions;
