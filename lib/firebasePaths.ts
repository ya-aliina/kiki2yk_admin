import { collection, doc } from '@firebase/firestore';
import { db } from '@/lib/firebase';

export const paths = {
    storesCollection: () => collection(db, 'stores'),
    store: (storeId: string) => doc(db, 'stores', storeId),
    billboardsCollection: (storeId: string) => collection(db, 'stores', storeId, 'billboards'),
    billboard: (storeId: string, billboardId: string) => doc(db, 'stores', storeId, 'billboards', billboardId),
};

