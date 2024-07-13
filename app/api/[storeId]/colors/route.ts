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
import { Category } from '@/types.db';
// import { checkAuth } from '@/lib/apiUtils/auth';
// import { getStoreData, verifyStoreAccess } from '@/lib/apiUtils/stores';
import { ERRORS } from '@/lib/errors';
import { paths } from '@/lib/firebasePaths';

interface CategoryParams {
    params: {
        storeId: string
    }
}

export const POST = async (req: Request, { params } : CategoryParams) => {
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
            return new NextResponse(ERRORS.MISSING_CATEGORY_ID, { status: 400 });
        }

        // const storeData = await getStoreData(params);
        // const accessError = verifyStoreAccess(storeData, userId);
        // if (accessError) return accessError;

        const categoryData = {
            label,
            imageUrl,
            createdAt: serverTimestamp(),
        };

        const categoryRef = await addDoc(
            paths.categoriesCollection(params.storeId),
            categoryData,
        );

        const { id } = categoryRef;

        await updateDoc(paths.category(params.storeId, id), {
            ...categoryData,
            id,
            updatedAt: serverTimestamp(),
        });

        return NextResponse.json({ id, ...categoryData });
    } catch (error) {
        console.log(`CATEGORY_POST: ${error}`);
        return new NextResponse(ERRORS.INTERNAL_SERVER_ERROR, { status: 500 });
    }
};

export const GET = async (req: Request, { params } : CategoryParams) => {
    try {
        if (!params.storeId) {
            return new NextResponse(ERRORS.MISSING_STORE_ID, { status: 400 });
        }

        const categoriesData = (
            await getDocs(
                collection(doc(db, 'stores', params.storeId), 'categories'),
            )
        ).docs.map((docItem) => (docItem.data())) as Category[];

        return NextResponse.json(categoriesData);
    } catch (error) {
        console.log(`CATEGORY_GET: ${error}`);
        return new NextResponse(ERRORS.INTERNAL_SERVER_ERROR, { status: 500 });
    }
};
