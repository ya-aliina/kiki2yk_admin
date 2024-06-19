import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import {
    collection, getDocs, query, where,
} from '@firebase/firestore';
import { Store } from '@/types.db';
import { db } from '@/lib/firebase';

interface SetupLayoutProps {
    children: React.ReactNode;
}

const SetupLayout = async ({ children }: SetupLayoutProps) => {
    const { userId } = auth();

    if (!userId) {
        redirect('/sign-in');
    }

    const storeSnap = await getDocs(
        query(collection(db, 'stores'), where('userId', '==', userId)),
    );

    let store = null as any;

    storeSnap.forEach((doc) => {
        store = doc.data() as Store;
    });

    if (store) {
        redirect(`/${store?.id}`);
    }

    return (
        <div>
            {children}
        </div>
    );
};

export default SetupLayout;
