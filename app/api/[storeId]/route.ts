import { NextResponse } from 'next/server';
import {
    deleteDoc,
    getDoc,
    updateDoc,
} from '@firebase/firestore';
import { Store } from '@/types.db';
import { checkAuth } from '@/lib/apiUtils/auth';
import { ERRORS } from '@/lib/errors';
import {paths} from "@/lib/firebasePaths";

interface StoreParams {
    params: {
        storeId: string
    }
}

export const PATCH = async (req: Request, { params }:StoreParams) => {
    try {
        const userId = checkAuth();

        if (!params.storeId) {
            return new NextResponse(ERRORS.MISSING_STORE_ID, { status: 400 });
        }

        const body = await req.json();

        const { name } = body;
        if (!name) {
            return new NextResponse(ERRORS.MISSING_STORE_NAME, { status: 400 });
        }

        const storeRef = paths.store(params.storeId);
        await updateDoc(storeRef, { name });

        const store = (await getDoc(storeRef)).data() as Store;

        return NextResponse.json(store);
    } catch (error) {
        console.log(`STORE_PATCH: ${error}`);
        return new NextResponse(ERRORS.INTERNAL_SERVER_ERROR, { status: 500 });
    }
};

export const DELETE = async (req: Request, { params }:StoreParams) => {
    try {
        const userId = checkAuth();

        if (!params.storeId) {
            return new NextResponse(ERRORS.MISSING_STORE_ID, { status: 400 });
        }

        const storeRef = paths.store(params.storeId);
        await deleteDoc(storeRef);

        return NextResponse.json({ msg: 'Store deleted' });
    } catch (error) {
        console.log(`STORE_DELETE: ${error}`);
        return new NextResponse(ERRORS.INTERNAL_SERVER_ERROR, { status: 500 });
    }
};
