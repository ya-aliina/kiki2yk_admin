import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import {
    collection, doc, getDoc, getDocs, serverTimestamp, updateDoc,
} from '@firebase/firestore';
import { addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Billboards } from '@/types.db';

export const POST = async (req: Request, { params } : {params: {storeId: string}}) => {
    try {
        const { userId } = auth();
        const body = await req.json();

        if (!userId) {
            return new NextResponse('Un-Authorized', { status: 400 });
        }

        const { label, imageUrl } = body;

        if (!label) {
            return new NextResponse('Billboard Name is missing', { status: 400 });
        }

        if (!imageUrl) {
            return new NextResponse('Billboard Image is missing', { status: 400 });
        }

        if (!params.storeId) {
            return new NextResponse('Store Id is missing', { status: 400 });
        }

        const store = await getDoc(doc(db, 'stores', params.storeId));

        if (store.exists()) {
            const storeData = store.data();
            if (storeData?.userId !== userId) {
                return new NextResponse('Un-Authorized Acces', { status: 500 });
            }
        }

        const billboardData = {
            label,
            imageUrl,
            createdAt: serverTimestamp(),
        };

        const billboardRef = await addDoc(
            collection(db, 'stores', params.storeId, 'billboards'),
            billboardData,
        );

        const { id } = billboardRef;

        await updateDoc(doc(db, 'stores', params.storeId, 'billboards'), {
            ...billboardData,
            id,
            updatedAt: serverTimestamp(),
        });

        return NextResponse.json({ id, ...billboardData });
    } catch (error) {
        console.log(`STORES_POST: ${error}`);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
};

export const GET = async (req: Request, { params } : {params: {storeId: string}}) => {
    try {
        if (!params.storeId) {
            return new NextResponse('Store Id is missing', { status: 400 });
        }

        const billboardData = (
            await getDocs(
                collection(doc(db, 'stores', params.storeId), 'billboards'),
            )
        ).docs.map((docItem) => (docItem.data())) as Billboards[];

        return NextResponse.json(billboardData);
    } catch (error) {
        console.log(`STORES_POST: ${error}`);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
};
