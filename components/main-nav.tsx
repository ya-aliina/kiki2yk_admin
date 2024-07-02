'use client';

import { useParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface routesItem {
    href: string;
    name: string;
}

// eslint-disable-next-line no-unused-vars
const MainNav = ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => {
    const pathName = usePathname();
    const params = useParams();

    const routes:routesItem[] = [
        {
            href: `/${params.storeId}`,
            name: 'Overview',
        },
        {
            href: `/${params.storeId}/settings`,
            name: 'Settings',
        },
        {
            href: `/${params.storeId}/billboards`,
            name: 'Billboards',
        },
        {
            href: `/${params.storeId}/categories`,
            name: 'Categories',
        },
    ];
    return (
        <div className={cn('flex items-center space-x-4 lg:space-x-6 pl-6')}>
            {routes.map((route) => (
                <Link
                    key={route.href}
                    href={route.href}
                    className={cn(
                        'text-sm font-medium transition-colors hover: text-primary',
                        pathName === route.href
                            ? 'text-black dark:text-white'
                            : 'text-muted-foreground',
                    )}
                >
                    {route.name}
                </Link>
            ))}
        </div>
    );
};

export default MainNav;
