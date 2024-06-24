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
import { Billboard } from '@/types.db';
import { checkAuth } from '@/lib/apiUtils/auth';
import { getStoreData, verifyStoreAccess } from '@/lib/apiUtils/stores';
import { ERRORS } from '@/lib/errors';
import {paths} from "@/lib/firebasePaths";

interface BillboardParams {
    params: {
        storeId: string
    }
}

export const POST = async (req: Request, { params } : BillboardParams) => {
    try {
        const userId = checkAuth();

        const body = await req.json();
        const { label, imageUrl } = body;

        if (!label) {
            return new NextResponse(ERRORS.MISSING_BILLBOARD_NAME, { status: 400 });
        }

        if (!imageUrl) {
            return new NextResponse(ERRORS.MISSING_BILLBOARD_IMAGE, { status: 400 });
        }

        if (!params.storeId) {
            return new NextResponse(ERRORS.MISSING_BILLBOARD_ID, { status: 400 });
        }

        const storeData = await getStoreData(params);
        const accessError = verifyStoreAccess(storeData, userId);
        if (accessError) return accessError;

        const billboardData = {
            label,
            imageUrl,
            createdAt: serverTimestamp(),
        };

        const billboardRef = await addDoc(
            paths.billboardsCollection(params.storeId),
            billboardData,
        );

        const { id } = billboardRef;

        await updateDoc(paths.billboard(params.storeId, id), {
            ...billboardData,
            id,
            updatedAt: serverTimestamp(),
        });

        return NextResponse.json({ id, ...billboardData });
    } catch (error) {
        console.log(`BILLBOARD_POST: ${error}`);
        return new NextResponse(ERRORS.INTERNAL_SERVER_ERROR, { status: 500 });
    }
};

export const GET = async (req: Request, { params } : BillboardParams) => {
    try {
        if (!params.storeId) {
            return new NextResponse(ERRORS.MISSING_STORE_ID, { status: 400 });
        }

        const billboardsData = (
            await getDocs(
                collection(doc(db, 'stores', params.storeId), 'billboards'),
            )
        ).docs.map((docItem) => (docItem.data())) as Billboard[];

        return NextResponse.json(billboardsData);
    } catch (error) {
        console.log(`BILLBOARD_GET: ${error}`);
        return new NextResponse(ERRORS.INTERNAL_SERVER_ERROR, { status: 500 });
    }
};
