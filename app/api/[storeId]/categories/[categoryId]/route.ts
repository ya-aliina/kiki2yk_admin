import { NextResponse } from 'next/server';
import {
    deleteDoc, doc, getDoc, getDocs, serverTimestamp, updateDoc,
} from '@firebase/firestore';
import { db } from '@/lib/firebase';
import { Category } from '@/types.db';
import { checkAuth } from '@/lib/apiUtils/auth';
import { getStoreData, verifyStoreAccess } from '@/lib/apiUtils/stores';
import { ERRORS } from '@/lib/errors';
import { paths } from '@/lib/firebasePaths';

interface CategoryParams {
    params: {
        storeId: string,
        categoryId: string
    }
}

export const PATCH = async (req: Request, { params } : CategoryParams) => {
    try {
        // const userId = checkAuth();

        const body = await req.json();
        const { label, imageUrl } = body;

        if (!label) {
            return new NextResponse(ERRORS.MISSING_CATEGORY_NAME, { status: 400 });
        }

        if (!imageUrl) {
            return new NextResponse(ERRORS.MISSING_CATEGORY_IMAGE, { status: 400 });
        }

        if (!params.storeId) {
            return new NextResponse(ERRORS.MISSING_STORE_ID, { status: 400 });
        }

        if (!params.categoryId) {
            return new NextResponse(ERRORS.MISSING_CATEGORY_ID, { status: 400 });
        }

        // const storeData = await getStoreData(params);
        // const accessError = verifyStoreAccess(storeData, userId);
        // if (accessError) return accessError;

        const categoryRef = await getDoc(
            paths.category(params.storeId, params.categoryId),
        );

        if (categoryRef.exists()) {
            await updateDoc(paths.category(params.storeId, params.categoryId), {
                ...categoryRef.data(),
                label,
                imageUrl,
                updatedAt: serverTimestamp(),
            });
        } else {
            return new NextResponse(ERRORS.CATEGORY_NOT_FOUND, { status: 404 });
        }

        const category = (
            await getDoc(
                paths.category(params.storeId, params.categoryId),
            )
        ).data() as Category;

        return NextResponse.json(category);
    } catch (error) {
        console.log(`CATEGORY_PATCH: ${error}`);
        return new NextResponse(ERRORS.INTERNAL_SERVER_ERROR, { status: 500 });
    }
};

// TODO
export const DELETE = async (req: Request, { params }:CategoryParams) => {
    try {
        // const userId = checkAuth();

        if (!params.storeId) {
            return new NextResponse(ERRORS.MISSING_STORE_ID, { status: 400 });
        }

        if (!params.categoryId) {
            return new NextResponse(ERRORS.MISSING_CATEGORY_ID, { status: 400 });
        }

        // const storeData = await getStoreData(params);
        // const accessError = verifyStoreAccess(storeData, userId);
        // if (accessError) return accessError;

        const categoryRef = doc(db, 'stores', params.storeId, 'categorys', params.categoryId);

        await deleteDoc(categoryRef);

        return NextResponse.json({ msg: 'Category deleted' });
    } catch (error) {
        console.log(`CATEGORY_DELETE: ${error}`);
        return new NextResponse(ERRORS.INTERNAL_SERVER_ERROR, { status: 500 });
    }
};
