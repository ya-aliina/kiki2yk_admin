'use client';

import { PopoverTrigger } from '@/components/ui/popover';
import { Store } from '@/types.db';
import {useParams, usePathname} from "next/navigation";

type PopoverTrigger = Rect.ComponentPropsWithoutRef<typeof PopoverTrigger>
interface StoreSwitcherProps extends PopoverTrigger {
    items: Store[]
}

const StoreSwitcher = ({ items }: StoreSwitcherProps) => {
    const pathName = usePathname();
    const params = useParams();

    const formattedStoresInfo = items.map((item) => {

    })

    return (
        <div />
    );
};

export default StoreSwitcher;
