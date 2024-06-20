'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import {Check, ChevronsUpDown, StoreIcon} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Store } from '@/types.db';
import { Button } from '@/components/ui/button';
import {
    Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
    typeof PopoverTrigger
>;

interface StoreSwitcherProps extends PopoverTriggerProps {
    items: Store[];
}

interface StoreDataForSwitcher {
    label: string,
    value: string,
}

const StoreSwitcher = ({ items }: StoreSwitcherProps) => {
    const [open, setOpen] = useState(false);
    const params = useParams();
    const router = useRouter();

    const formattedStores: StoreDataForSwitcher[] = items.map((item) => ({
        label: item.name,
        value: item.id,
    }));

    const currentStore = formattedStores.find(
        (item) => item.value === params.storeId,
    );

    const onStoreSelect = (store: StoreDataForSwitcher) => {
        setOpen(false);
        router.push(`/${store.value}`);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                >
                    <StoreIcon className="mr-2 h-4 w-4" />
                    {currentStore?.value
                        ? formattedStores?.find(
                            (store) => store.value === currentStore?.value,
                        )?.label
                        : 'Select store...'}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search store..." />
                    <CommandEmpty>No store found.</CommandEmpty>
                    <CommandList>
                        <CommandGroup>
                            {formattedStores?.map((store) => (
                                <CommandItem
                                    key={store.value}
                                    value={store.value}
                                    onSelect={(currentValue) => {
                                        // setValue(currentValue === value ? '' : currentValue);
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            'mr-2 h-4 w-4',
                                            currentStore?.value === store.value
                                                ? 'opacity-100'
                                                : 'opacity-0',
                                        )}
                                    />
                                    {store.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

export default StoreSwitcher;
