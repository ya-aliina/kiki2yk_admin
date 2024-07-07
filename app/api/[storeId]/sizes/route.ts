import { NextResponse } from 'next/server';
import {
    collection,
    doc,
    getDocs,
    serverTimestamp,
    updateDoc,
} from '@firebase/firestore';
import { addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Size } from '@/types.db';
// import { checkAuth } from '@/lib/apiUtils/auth';
// import { getStoreData, verifyStoreAccess } from '@/lib/apiUtils/stores';
import { ERRORS } from '@/lib/errors';
import { paths } from '@/lib/firebasePaths';

interface SizeParams {
    params: {
        storeId: string
    }
}

export const POST = async (req: Request, { params } : SizeParams) => {
    try {
        // const userId = checkAuth();

        const body = await req.json();
        const { name, value } = body;

        if (!name) {
            return new NextResponse(ERRORS.MISSING_SIZE_NAME, { status: 400 });
        }

        if (!value) {
            return new NextResponse(ERRORS.MISSING_SIZE_VALUE, { status: 400 });
        }

        if (!params.storeId) {
            return new NextResponse(ERRORS.MISSING_SIZE_ID, { status: 400 });
        }

        // const storeData = await getStoreData(params);
        // const accessError = verifyStoreAccess(storeData, userId);
        // if (accessError) return accessError;

        const sizeData = {
            name,
            value,
            createdAt: serverTimestamp(),
        };

        const sizeRef = await addDoc(
            paths.sizesCollection(params.storeId),
            sizeData,
        );

        const { id } = sizeRef;

        await updateDoc(paths.size(params.storeId, id), {
            ...sizeData,
            id,
            updatedAt: serverTimestamp(),
        });

        return NextResponse.json({ id, ...sizeData });
    } catch (error) {
        console.log(`SIZE_POST: ${error}`);
        return new NextResponse(ERRORS.INTERNAL_SERVER_ERROR, { status: 500 });
    }
};

export const GET = async (req: Request, { params } : SizeParams) => {
    try {
        if (!params.storeId) {
            return new NextResponse(ERRORS.MISSING_STORE_ID, { status: 400 });
        }

        const sizesData = (
            await getDocs(
                paths.sizesCollection(params.storeId),
            )
        ).docs.map((docItem) => (docItem.data())) as Size[];

        return NextResponse.json(sizesData);
    } catch (error) {
        console.log(`SIZE_GET: ${error}`);
        return new NextResponse(ERRORS.INTERNAL_SERVER_ERROR, { status: 500 });
    }
};
