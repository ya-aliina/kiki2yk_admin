import { UserButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import {
    collection, getDocs, query, where,
} from '@firebase/firestore';
import MainNav from '@/components/main-nav';
import StoreSwitcher from '@/components/store-switcher';
import { db } from '@/lib/firebase';
import { Store } from '@/types.db';

const Navbar = async () => {
    const { userId } = auth();

    if (!userId) {
        redirect('/sign-in');
    }

    const storeSnap = await getDocs(
        query(
            collection(db, 'stores'),
            where('userId', '==', userId),
        ),
    );

    // const stores = [] as Store[];
    const stores = [
        {
            name: 'test-31',
            id: 'sot0nAExLF8yFok6kCqt',
        },
        {
            name: 'test',
            id: 'tnAxZjzEpLc4wen8cUFM',
        },
    ];
    // storeSnap.forEach((store) => (
    //     stores.push(store)
    // ));

    return (
        <nav className="border-b">
            <div className="flex h-16 items-center px-4">
                <StoreSwitcher items={stores} />
                {/* routes */}
                <MainNav />
                {/* userProfile */}
                <div className="ml-auto">
                    <UserButton afterSignOutUrl="/" />
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
