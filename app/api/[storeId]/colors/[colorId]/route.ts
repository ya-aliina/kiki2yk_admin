import { NextResponse } from 'next/server';
import {
    deleteDoc, doc, getDoc, getDocs, serverTimestamp, updateDoc,
} from '@firebase/firestore';
import { db } from '@/lib/firebase';
import { Color } from '@/types.db';
import { checkAuth } from '@/lib/apiUtils/auth';
import { getStoreData, verifyStoreAccess } from '@/lib/apiUtils/stores';
import { ERRORS } from '@/lib/errors';
import { paths } from '@/lib/firebasePaths';

interface ColorParams {
    params: {
        storeId: string,
        colorId: string
    }
}

export const PATCH = async (req: Request, { params } : ColorParams) => {
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
            return new NextResponse(ERRORS.MISSING_STORE_ID, { status: 400 });
        }

        if (!params.colorId) {
            return new NextResponse(ERRORS.MISSING_COLOR_ID, { status: 400 });
        }

        // const storeData = await getStoreData(params);
        // const accessError = verifyStoreAccess(storeData, userId);
        // if (accessError) return accessError;

        const colorRef = await getDoc(
            paths.color(params.storeId, params.colorId),
        );

        if (colorRef.exists()) {
            await updateDoc(paths.color(params.storeId, params.colorId), {
                ...colorRef.data(),
                name,
                value,
                updatedAt: serverTimestamp(),
            });
        } else {
            return new NextResponse(ERRORS.COLOR_NOT_FOUND, { status: 404 });
        }

        const color = (
            await getDoc(
                paths.color(params.storeId, params.colorId),
            )
        ).data() as Color;

        return NextResponse.json(color);
    } catch (error) {
        console.log(`COLOR_PATCH: ${error}`);
        return new NextResponse(ERRORS.INTERNAL_SERVER_ERROR, { status: 500 });
    }
};

// TODO
export const DELETE = async (req: Request, { params }:ColorParams) => {
    try {
        // const userId = checkAuth();

        if (!params.storeId) {
            return new NextResponse(ERRORS.MISSING_STORE_ID, { status: 400 });
        }

        if (!params.colorId) {
            return new NextResponse(ERRORS.MISSING_COLOR_ID, { status: 400 });
        }

        // const storeData = await getStoreData(params);
        // const accessError = verifyStoreAccess(storeData, userId);
        // if (accessError) return accessError;

        const colorRef = doc(db, 'stores', params.storeId, 'colors', params.colorId);

        await deleteDoc(colorRef);

        return NextResponse.json({ msg: 'Color deleted' });
    } catch (error) {
        console.log(`COLOR_DELETE: ${error}`);
        return new NextResponse(ERRORS.INTERNAL_SERVER_ERROR, { status: 500 });
    }
};
