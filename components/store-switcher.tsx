'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { ChevronsUpDown, Search, StoreIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Store } from '@/types.db';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandList, CommandSeparator,
} from '@/components/ui/command';
import StoreListItem from '@/components/store-list-item';
import { useStoreModal } from '@/hooks/use-store-modal';
import CreateStoreItem from '@/components/create-store-item';

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
    const [searchTerm, setSearchTerm] = useState('');
    const [filtered, setFiltered] = useState([] as StoreDataForSwitcher[]);

    const storeModal = useStoreModal();

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

    const handleSearchTerm = (e: any) => {
        setSearchTerm(e.target.value);
        setFiltered(
            formattedStores.filter(
                (store) => store.label.toLowerCase().includes(
                    searchTerm.toLowerCase(),
                ),
            ),
        );
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
                    <CommandList>
                        <div className="w-full px-2 py-1 flex items-center border rounded-md border-gray-100">
                            <Search className="mr-2 h-4 w-4 min-w-4" />
                            <input
                                type="text"
                                placeholder="Search Store..."
                                onChange={handleSearchTerm}
                                className="flex-1 w-full outline-none"
                            />
                        </div>
                        <CommandGroup heading="stores">
                            {
                                searchTerm === ''
                                    ? (
                                        formattedStores.map((store) => (
                                            <StoreListItem
                                                store={store}
                                                key={store.value}
                                                onSelect={onStoreSelect}
                                                isChecked={currentStore?.value === store.value}
                                            />
                                        ))
                                    )
                                    : filtered.length > 0
                                        ? (
                                            filtered.map((store) => (
                                                <StoreListItem
                                                    store={store}
                                                    key={store.value}
                                                    onSelect={onStoreSelect}
                                                    isChecked={currentStore?.value === store.value}
                                                />
                                            ))
                                        ) : <CommandEmpty>No Store Found</CommandEmpty>
                            }
                        </CommandGroup>
                    </CommandList>

                    <CommandSeparator />

                    <CommandList>
                        <CreateStoreItem
                            onClick={() => {
                                setOpen(false);
                                storeModal.onOpen();
                            }}
                        />
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

export default StoreSwitcher;
