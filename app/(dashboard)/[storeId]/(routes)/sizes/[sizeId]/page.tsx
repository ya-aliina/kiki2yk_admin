import { doc, getDoc } from '@firebase/firestore';
import { db } from '@/lib/firebase';
import { Size } from '@/types.db';
import SizeForm from '@/app/(dashboard)/[storeId]/(routes)/sizes/[sizeId]/_components/size-form';

interface SizePageParams {
    params: {
        storeId: string,
        sizeId: string,
    }
}

const SizePage = async ({ params }: SizePageParams) => {
    const size = (await getDoc(
        doc(db, 'stores', params.storeId, 'sizes', params.sizeId),
    )).data() as Size;

    return (
        <div className="flex-col">
            <SizeForm initialData={size} />
        </div>
    );
};

export default SizePage;
