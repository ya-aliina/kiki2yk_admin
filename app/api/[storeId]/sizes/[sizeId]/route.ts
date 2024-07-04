import { NextResponse } from 'next/server';
import {
    deleteDoc, doc, getDoc, getDocs, serverTimestamp, updateDoc,
} from '@firebase/firestore';
import { db } from '@/lib/firebase';
import { Size } from '@/types.db';
import { checkAuth } from '@/lib/apiUtils/auth';
import { getStoreData, verifyStoreAccess } from '@/lib/apiUtils/stores';
import { ERRORS } from '@/lib/errors';
import { paths } from '@/lib/firebasePaths';

interface SizeParams {
    params: {
        storeId: string,
        sizeId: string
    }
}

export const PATCH = async (req: Request, { params } : SizeParams) => {
    try {
        // const userId = checkAuth();

        const body = await req.json();
        const { label, imageUrl } = body;

        if (!label) {
            return new NextResponse(ERRORS.MISSING_SIZE_NAME, { status: 400 });
        }

        if (!imageUrl) {
            return new NextResponse(ERRORS.MISSING_SIZE_IMAGE, { status: 400 });
        }

        if (!params.storeId) {
            return new NextResponse(ERRORS.MISSING_STORE_ID, { status: 400 });
        }

        if (!params.sizeId) {
            return new NextResponse(ERRORS.MISSING_SIZE_ID, { status: 400 });
        }

        // const storeData = await getStoreData(params);
        // const accessError = verifyStoreAccess(storeData, userId);
        // if (accessError) return accessError;

        const sizeRef = await getDoc(
            paths.size(params.storeId, params.sizeId),
        );

        if (sizeRef.exists()) {
            await updateDoc(paths.size(params.storeId, params.sizeId), {
                ...sizeRef.data(),
                label,
                imageUrl,
                updatedAt: serverTimestamp(),
            });
        } else {
            return new NextResponse(ERRORS.SIZE_NOT_FOUND, { status: 404 });
        }

        const size = (
            await getDoc(
                paths.size(params.storeId, params.sizeId),
            )
        ).data() as Size;

        return NextResponse.json(size);
    } catch (error) {
        console.log(`SIZE_PATCH: ${error}`);
        return new NextResponse(ERRORS.INTERNAL_SERVER_ERROR, { status: 500 });
    }
};

// TODO
export const DELETE = async (req: Request, { params }:SizeParams) => {
    try {
        // const userId = checkAuth();

        if (!params.storeId) {
            return new NextResponse(ERRORS.MISSING_STORE_ID, { status: 400 });
        }

        if (!params.sizeId) {
            return new NextResponse(ERRORS.MISSING_SIZE_ID, { status: 400 });
        }

        // const storeData = await getStoreData(params);
        // const accessError = verifyStoreAccess(storeData, userId);
        // if (accessError) return accessError;

        const sizeRef = doc(db, 'stores', params.storeId, 'sizes', params.sizeId);

        await deleteDoc(sizeRef);

        return NextResponse.json({ msg: 'Size deleted' });
    } catch (error) {
        console.log(`SIZE_DELETE: ${error}`);
        return new NextResponse(ERRORS.INTERNAL_SERVER_ERROR, { status: 500 });
    }
};
