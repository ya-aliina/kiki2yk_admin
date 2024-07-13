import { doc, getDoc } from '@firebase/firestore';
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { ERRORS } from '@/lib/errors';
import { Store } from '@/types.db';

interface StoreParams {
    storeId: string,
}

/**
 * Fetches store data from Firestore based on the provided storeId.
 * Throws an error if the store is not found or if there is an internal server error.
 *
 * @param {StoreParams} params - The parameters object containing storeId.
 * @returns {Promise<Store>} The store data fetched from Firestore.
 * @throws {Error} If the store is not found or an internal server error occurs.
 */
export const getStoreData = async ({ storeId }: StoreParams): Promise<Store> => {
    try {
        const storeSnapshot = await getDoc(doc(db, 'stores', storeId));

        if (!storeSnapshot.exists()) {
            throw new Error(ERRORS.STORE_NOT_FOUND);
        }

        return storeSnapshot.data() as Store;
    } catch (error) {
        console.error('Error fetching store data:', error);
        throw new Error(ERRORS.INTERNAL_SERVER_ERROR);
    }
};

/**
 * Verifies access to a store based on the provided storeData and userId.
 * Returns a NextResponse if access is unauthorized; otherwise, returns null.
 *
 * @param {Store} storeData - The store data to check against userId.
 * @param {string | null} userId - The user ID to verify access.
 * @returns {NextResponse | null} A NextResponse if unauthorized, otherwise null.
 */
export const verifyStoreAccess = (storeData: Store, userId: string | null): NextResponse | null => {
    if (storeData?.userId !== userId) {
        return new NextResponse(ERRORS.UNAUTHORIZED_ACCESS, { status: 401 });
    }
    return null;
};
