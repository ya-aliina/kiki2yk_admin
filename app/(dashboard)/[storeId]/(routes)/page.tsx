import { doc, getDoc } from '@firebase/firestore';
import { db } from '@/lib/firebase';
import { Store } from '@/types.db';
import Heading from '@/components/heading';

interface DashboardOverviewProps {
    params: {storeId: string};
}

const DashboardOverview = async ({ params }:DashboardOverviewProps) => {
    const store = (
        await getDoc(doc(db, 'stores', params.storeId))
    ).data() as Store;

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <Heading title="Dashboard overview" description={`Store: ${store.name}`} />
        </div>
    );
};

export default DashboardOverview;
