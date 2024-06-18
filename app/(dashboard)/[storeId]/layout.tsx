import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import {
    collection, getDocs, query, where,
} from '@firebase/firestore';
import { db } from '@/lib/firebase';
import { Store } from '@/types.db';
import Navbar from '@/components/navbar';

interface DashboardLayoutProps {
    children: React.ReactNode,
    params: { storeId: string }
}

const DashboardLayout = async ({ children, params }: DashboardLayoutProps) => {
    const { userId } = auth();

    // проверяем авторизован ли пользователь
    if (!userId) {
        redirect('/sign-in');
    }

    // достаем из БД коллекции магазинов, которые принадлежат данному пользователю и выбираем 1, которые подходит по id
    const storeSnap = await getDocs(
        query(
            collection(db, 'stores'),
            where('userId', '==', userId),
            where('id', '==', params.storeId),
        ),
    );

    // создаем пустую переменную для дальнейшего хранения данных о магащине
    let store;

    // Проходимся по данным и записываем в переменную
    storeSnap.forEach((doc) => {
        store = doc.data() as Store;
    });

    // Если магазин с таким id не найден, то перенаправляем на главную
    if (!store) {
        redirect('/');
    }

    return (
        <div>
            <Navbar />
            {children}
        </div>
    );
};

export default DashboardLayout;
