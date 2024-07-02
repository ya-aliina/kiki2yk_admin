import { getDocs } from '@firebase/firestore';
import { format } from 'date-fns';

import { paths } from '@/lib/firebasePaths';
import { Billboard } from '@/types.db';
import { BillboardColumns } from '@/app/(dashboard)/[storeId]/(routes)/billboards/_components/columns';
import CategoryClient from '@/app/(dashboard)/[storeId]/(routes)/categories/_components/client';

interface BillboardProps {
    params: {
        storeId: string
    }
}

const CategoriesPage = async ({ params }: BillboardProps) => {
    const billboardsData = (
        await getDocs(paths.billboardsCollection(params.storeId))
    ).docs.map((doc) => doc.data()) as Billboard[];

    const formattedBilboards: BillboardColumns[] = billboardsData.map((item) => ({
        id: item.id,
        label: item.label,
        imageUrl: item.imageUrl,
        createdAt: item.createdAt ? format(item.createdAt.toDate(), 'do MMMM, yyyy') : '',
    }));

    return (
        <div className="flex-col">
            <CategoryClient data={formattedBilboards} />
        </div>
    );
};

export default CategoriesPage;
