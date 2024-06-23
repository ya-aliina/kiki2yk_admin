import { doc, getDoc } from '@firebase/firestore';
import { db } from '@/lib/firebase';
import { Billboards } from '@/types.db';
import BillboardForm from '@/app/(dashboard)/[storeId]/(routes)/billboards/[billboardId]/_components/billboard-form';

interface BillboardPageParams {
    params: {
        storeId: string,
        billboardId: string,
    }
}

const BillboardPage = async ({ params }: BillboardPageParams) => {
    const billboard = (await getDoc(
        doc(db, 'stores', params.storeId, 'billboards', params.billboardId),
    )).data() as Billboards;

    return (
        <div className="flex-col">
            <BillboardForm initialData={billboard} />
        </div>
    );
};

export default BillboardPage;
