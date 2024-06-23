import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { doc, getDoc } from '@firebase/firestore';
import { db } from '@/lib/firebase';
import SettingsForm from '@/app/(dashboard)/[storeId]/(routes)/settings/_components/settings-form';
import { Store } from '@/types.db';

interface SettingsPageProps {
    params: { storeId: string}
}

const SettingsPage = async ({ params }:SettingsPageProps) => {
    const { userId } = auth();
    if (!userId) {
        redirect('/sign-in');
    }

    const store = (await getDoc(doc(db, 'stores', params.storeId))).data() as Store;

    if (!store || store.userId !== userId) {
        redirect('/');
    }

    return (
        <div className="flex-col">
            <SettingsForm initialData={store} />
        </div>
    );
};

export default SettingsPage;
