import { NextResponse } from 'next/server';
import {
    deleteDoc, doc, getDoc, getDocs, serverTimestamp, updateDoc,
} from '@firebase/firestore';
import { db } from '@/lib/firebase';
import { Billboard } from '@/types.db';
import {checkAuth} from "@/lib/apiUtils/auth";
import {getStoreData, verifyStoreAccess} from "@/lib/apiUtils/stores";
import {ERRORS} from "@/lib/errors";
import {paths} from "@/lib/firebasePaths";

interface BillboardParams {
    params: {
        storeId: string,
        billboardId: string
    }
}

export const PATCH = async (req: Request, { params } : BillboardParams) => {
    try {
        // const userId = checkAuth();

        const body = await req.json();
        const { label, imageUrl } = body;

        if (!label) {
            return new NextResponse(ERRORS.MISSING_BILLBOARD_NAME, { status: 400 });
        }

        if (!imageUrl) {
            return new NextResponse(ERRORS.MISSING_BILLBOARD_IMAGE, { status: 400 });
        }

        if (!params.storeId) {
            return new NextResponse(ERRORS.MISSING_STORE_ID, { status: 400 });
        }

        if (!params.billboardId) {
            return new NextResponse(ERRORS.MISSING_BILLBOARD_ID, { status: 400 });
        }

        // const storeData = await getStoreData(params);
        // const accessError = verifyStoreAccess(storeData, userId);
        // if (accessError) return accessError;

        const billboardRef = await getDoc(
            paths.billboard(params.storeId, params.billboardId),
        );

        if (billboardRef.exists()) {
            await updateDoc(paths.billboard(params.storeId, params.billboardId), {
                ...billboardRef.data(),
                label,
                imageUrl,
                updatedAt: serverTimestamp(),
            });
        } else {
            return new NextResponse(ERRORS.BILLBOARD_NOT_FOUND, { status: 404 });
        }

        const billboard = (
            await getDoc(
                paths.billboard(params.storeId, params.billboardId),
            )
        ).data() as Billboard;

        return NextResponse.json(billboard);
    } catch (error) {
        console.log(`BILLBOARD_PATCH: ${error}`);
        return new NextResponse(ERRORS.INTERNAL_SERVER_ERROR, { status: 500 });
    }
};

// TODO
export const DELETE = async (req: Request, { params }:BillboardParams) => {
    try {
        // const userId = checkAuth();

        if (!params.storeId) {
            return new NextResponse(ERRORS.MISSING_STORE_ID, { status: 400 });
        }

        if (!params.billboardId) {
            return new NextResponse(ERRORS.MISSING_BILLBOARD_ID, { status: 400 });
        }

        // const storeData = await getStoreData(params);
        // const accessError = verifyStoreAccess(storeData, userId);
        // if (accessError) return accessError;

        const billboardRef = doc(db, 'stores', params.storeId, 'billboards', params.billboardId);

        await deleteDoc(billboardRef);

        return NextResponse.json({ msg: 'Billboard deleted' });
    } catch (error) {
        console.log(`BILLBOARD_DELETE: ${error}`);
        return new NextResponse(ERRORS.INTERNAL_SERVER_ERROR, { status: 500 });
    }
};
