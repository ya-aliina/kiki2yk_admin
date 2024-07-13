import { getDocs } from '@firebase/firestore';
import { format } from 'date-fns';
import ColorClient from '@/app/(dashboard)/[storeId]/(routes)/colors/_components/client';
import { paths } from '@/lib/firebasePaths';
import { Color } from '@/types.db';
import { ColorColumns } from '@/app/(dashboard)/[storeId]/(routes)/colors/_components/columns';

interface ColorProps {
    params: {
        storeId: string
    }
}

const Colors = async ({ params }: ColorProps) => {
    const colorsData = (
        await getDocs(paths.colorsCollection(params.storeId))
    ).docs.map((doc) => doc.data()) as Color[];

    const formattedColors: ColorColumns[] = colorsData.map((item) => ({
        id: item.id,
        name: item.name,
        value: item.value,
        createdAt: item.createdAt ? format(item.createdAt.toDate(), 'do MMMM, yyyy') : '',
    }));

    return (
        <div className="flex-col">
            <ColorClient data={formattedColors} />
        </div>
    );
};

export default Colors;
