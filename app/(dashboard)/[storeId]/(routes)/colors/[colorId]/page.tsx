import { doc, getDoc } from '@firebase/firestore';
import { db } from '@/lib/firebase';
import { Color } from '@/types.db';
import ColorForm from '@/app/(dashboard)/[storeId]/(routes)/colors/[colorId]/_components/color-form';

interface ColorPageParams {
    params: {
        storeId: string,
        colorId: string,
    }
}

const ColorPage = async ({ params }: ColorPageParams) => {
    const color = (await getDoc(
        doc(db, 'stores', params.storeId, 'colors', params.colorId),
    )).data() as Color;

    return (
        <div className="flex-col">
            <ColorForm initialData={color} />
        </div>
    );
};

export default ColorPage;
