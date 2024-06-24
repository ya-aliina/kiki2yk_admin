import { NextResponse } from 'next/server';
import {
    serverTimestamp,
    updateDoc,
} from '@firebase/firestore';
import { addDoc } from 'firebase/firestore';
import { checkAuth } from '@/lib/apiUtils/auth';
import { ERRORS } from '@/lib/errors';
import { paths } from '@/lib/firebasePaths';

export const POST = async (req: Request) => {
    try {
        const userId = checkAuth();

        const body = await req.json();

        const { name } = body;
        if (!name) {
            return new NextResponse(ERRORS.MISSING_STORE_NAME, { status: 400 });
        }

        const storeData = {
            name,
            userId,
            createdAt: serverTimestamp(),
        };

        const storeRef = await addDoc(paths.storesCollection(), storeData);
        const { id } = storeRef;

        await updateDoc(paths.store(id), {
            ...storeData,
            id,
            updatedAt: serverTimestamp(),
        });

        return NextResponse.json({ id, ...storeData });
    } catch (error) {
        console.log(`STORES_POST: ${error}`);
        return new NextResponse(ERRORS.INTERNAL_SERVER_ERROR, { status: 500 });
    }
};
