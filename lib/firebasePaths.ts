import { collection, doc } from '@firebase/firestore';
import { db } from '@/lib/firebase';

export const paths = {
    storesCollection: () => collection(db, 'stores'),
    store: (storeId: string) => doc(db, 'stores', storeId),
    categoriesCollection: (storeId: string) => collection(db, 'stores', storeId, 'billboards'),
    category: (storeId: string, billboardId: string) => doc(db, 'stores', storeId, 'billboards', billboardId),
};
