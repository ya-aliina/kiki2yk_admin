import { doc, getDoc } from '@firebase/firestore';
import { db } from '@/lib/firebase';
import { Category } from '@/types.db';
import CategoryForm from '@/app/(dashboard)/[storeId]/(routes)/categories/[categoryId]/_components/category-form';

interface CategoryPageParams {
    params: {
        storeId: string,
        categoryId: string,
    }
}

const CategoryPage = async ({ params }: CategoryPageParams) => {
    const category = (await getDoc(
        doc(db, 'stores', params.storeId, 'categories', params.categoryId),
    )).data() as Category;

    return (
        <div className="flex-col">
            <CategoryForm initialData={category} />
        </div>
    );
};

export default CategoryPage;
