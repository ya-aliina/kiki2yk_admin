import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import {
    collection, doc, serverTimestamp, updateDoc,
} from '@firebase/firestore';
import { addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// eslint-disable-next-line consistent-return
export const POST = async (req: Request) => {
    try {
        const { userId } = auth();
        const body = await req.json();

        if (!userId) {
            return new NextResponse('Un-Authorized', { status: 400 });
        }

        const { name } = body;

        if (!name) {
            return new NextResponse('Store Name is missing', { status: 400 });
        }

        const storeData = {
            name,
            userId,
            createdAt: serverTimestamp(),
        };

        // Add the data to the Firestore and retrive its reference id
        const storeRef = await addDoc(collection(db, 'stores'), storeData);
        // Get the reference id
        const { id } = storeRef;

        await updateDoc(doc(db, 'stores', id), {
            ...storeData,
            id,
            updatedAt: serverTimestamp(),
        });

        return NextResponse.json({ id, ...storeData });
    } catch (error) {
        console.log(`STORES_POST: ${error}`);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
};
