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
import { Color } from '@/types.db';
// import { checkAuth } from '@/lib/apiUtils/auth';
// import { getStoreData, verifyStoreAccess } from '@/lib/apiUtils/stores';
import { ERRORS } from '@/lib/errors';
import { paths } from '@/lib/firebasePaths';

interface ColorParams {
    params: {
        storeId: string
    }
}

export const POST = async (req: Request, { params } : ColorParams) => {
    try {
        // const userId = checkAuth();

        const body = await req.json();
        const { name, value } = body;

        if (!name) {
            return new NextResponse(ERRORS.MISSING_COLOR_NAME, { status: 400 });
        }

        if (!value) {
            return new NextResponse(ERRORS.MISSING_COLOR_VALUE, { status: 400 });
        }

        if (!params.storeId) {
            return new NextResponse(ERRORS.MISSING_COLOR_ID, { status: 400 });
        }

        // const storeData = await getStoreData(params);
        // const accessError = verifyStoreAccess(storeData, userId);
        // if (accessError) return accessError;

        const colorData = {
            name,
            value,
            createdAt: serverTimestamp(),
        };

        const colorRef = await addDoc(
            paths.colorsCollection(params.storeId),
            colorData,
        );

        const { id } = colorRef;

        await updateDoc(paths.color(params.storeId, id), {
            ...colorData,
            id,
            updatedAt: serverTimestamp(),
        });

        return NextResponse.json({ id, ...colorData });
    } catch (error) {
        console.log(`COLOR_POST: ${error}`);
        return new NextResponse(ERRORS.INTERNAL_SERVER_ERROR, { status: 500 });
    }
};

export const GET = async (req: Request, { params } : ColorParams) => {
    try {
        if (!params.storeId) {
            return new NextResponse(ERRORS.MISSING_STORE_ID, { status: 400 });
        }

        const colorsData = (
            await getDocs(
                paths.colorsCollection(params.storeId),
            )
        ).docs.map((docItem) => (docItem.data())) as Color[];

        return NextResponse.json(colorsData);
    } catch (error) {
        console.log(`COLOR_GET: ${error}`);
        return new NextResponse(ERRORS.INTERNAL_SERVER_ERROR, { status: 500 });
    }
};
