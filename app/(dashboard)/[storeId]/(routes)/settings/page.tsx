import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { doc, getDoc } from '@firebase/firestore';
import { db } from '@/lib/firebase';
import SettingsForm from '@/app/(dashboard)/[storeId]/(routes)/settings/components/settings-form';
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
            <div className="flex-1 space-y-5 p-8 pt-6">
                <SettingsForm initialData={store} />
            </div>
        </div>
    );
};

export default SettingsPage;
