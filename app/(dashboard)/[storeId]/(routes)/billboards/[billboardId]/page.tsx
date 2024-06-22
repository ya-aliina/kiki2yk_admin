import { doc, getDoc } from '@firebase/firestore';
import { db } from '@/lib/firebase';
import { Billboards } from '@/types.db';
import BillboardForm from '@/app/(dashboard)/[storeId]/(routes)/billboards/[billboardId]/_components/billboard-form';

interface BilboardPageParams {
    params: {
        storeId: string,
        billboardId: string,
    }
}

const BillboardPage = async ({ params }: BilboardPageParams) => {
    const billboard = (await getDoc(
        doc(db, 'stores', params.storeId, 'billboards', params.billboardId),
    )).data() as Billboards;

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <BillboardForm initialData={billboard} />
        </div>
    );
};

export default BillboardPage;
