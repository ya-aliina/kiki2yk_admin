import { getDocs } from '@firebase/firestore';
import { format } from 'date-fns';
import SizeClient from '@/app/(dashboard)/[storeId]/(routes)/sizes/_components/client';
import { paths } from '@/lib/firebasePaths';
import { Size } from '@/types.db';
import { SizeColumns } from '@/app/(dashboard)/[storeId]/(routes)/sizes/_components/columns';

interface SizeProps {
    params: {
        storeId: string
    }
}

const Sizes = async ({ params }: SizeProps) => {
    const sizesData = (
        await getDocs(paths.sizesCollection(params.storeId))
    ).docs.map((doc) => doc.data()) as Size[];

    const formattedSizes: SizeColumns[] = sizesData.map((item) => ({
        id: item.id,
        name: item.name,
        value: item.value,
        createdAt: item.createdAt ? format(item.createdAt.toDate(), 'do MMMM, yyyy') : '',
    }));

    return (
        <div className="flex-col">
            <SizeClient data={formattedSizes} />
        </div>
    );
};

export default Sizes;
