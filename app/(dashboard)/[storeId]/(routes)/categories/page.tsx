import { getDocs } from '@firebase/firestore';
import { format } from 'date-fns';
import CategoryClient from '@/app/(dashboard)/[storeId]/(routes)/categories/_components/client';
import { paths } from '@/lib/firebasePaths';
import { Category } from '@/types.db';
import { CategoryColumns } from '@/app/(dashboard)/[storeId]/(routes)/categories/_components/columns';

interface CategoryProps {
    params: {
        storeId: string
    }
}

const Categories = async ({ params }: CategoryProps) => {
    const categoriesData = (
        await getDocs(paths.categoriesCollection(params.storeId))
    ).docs.map((doc) => doc.data()) as Category[];

    const formattedCategories: CategoryColumns[] = categoriesData.map((item) => ({
        id: item.id,
        label: item.label,
        imageUrl: item.imageUrl,
        createdAt: item.createdAt ? format(item.createdAt.toDate(), 'do MMMM, yyyy') : '',
    }));

    return (
        <div className="flex-col">
            <CategoryClient data={formattedCategories} />
        </div>
    );
};

export default Categories;
