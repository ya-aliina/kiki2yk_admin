import { collection, doc } from '@firebase/firestore';
import { db } from '@/lib/firebase';

export const paths = {
    storesCollection: () => collection(db, 'stores'),
    store: (storeId: string) => doc(db, 'stores', storeId),
    categoriesCollection: (storeId: string) => collection(db, 'stores', storeId, 'categories'),
    category: (storeId: string, categoryId: string) => doc(db, 'stores', storeId, 'categories', categoryId),
    sizesCollection: (storeId: string) => collection(db, 'stores', storeId, 'categories'),
    size: (storeId: string, categoryId: string) => doc(db, 'stores', storeId, 'categories', categoryId),
};
