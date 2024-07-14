'use client';

import { Trash } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import { deleteObject, ref } from '@firebase/storage';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import Heading from '@/components/heading';
import { Color } from '@/types.db';
import AlertModal from '@/components/modal/alert-modal';
import ColorPicker from '@/components/color-picker';

interface ColorFormProps{
    initialData: Color
}

const formSchema = z.object({
    name: z.string().min(1),
    value: z.string().min(1),
});

const ColorForm = ({ initialData }: ColorFormProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData,
    });

    const params = useParams();
    const router = useRouter();

    const title = initialData ? 'Edit Color' : 'Create Color';
    const toastMessage = initialData ? 'Color Updated' : 'Color Created';
    const action = initialData ? 'Save Changes' : 'Create Color';

    const href = {
        color: `/${params.storeId}/colors/${params.colorId}`,
        colorsList: `/${params.storeId}/colors`,
    };

    const onSubmit = async (data : z.infer<typeof formSchema>) => {
        try {
            setIsLoading(true);

            if (initialData) {
                await axios.patch(`/api${href.color}`, data);
            } else {
                await axios.post(`/api${href.colorsList}`, data);
            }
            router.push(href.colorsList);
            router.refresh();
            toast.success(toastMessage);
        } catch (err) {
            toast.error('Something went wrong');
        } finally {
            setIsLoading(false);
            setOpen(false);
        }
    };

    const onDelete = async () => {
        try {
            setIsLoading(true);
            await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`);
            toast.success('Color Removed');
            router.push(href.colorsList);
            router.refresh();
        } catch (err) {
            toast.error('Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={isLoading}
            />

            <div className="flex items-center justify-center">
                <Heading title={title} description="" />
                {initialData && (
                    <Button
                        disabled={isLoading}
                        variant="destructive"
                        color="icon"
                        onClick={() => { setOpen(true); }}
                    >
                        <Trash className="h-4 w-4" />
                    </Button>
                )}
            </div>
            <Separator />

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="w-full space-y-8"
                >
                    <ColorPicker />

                    <div className="grid grid-cols-3 gap-3">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Abbreviation</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isLoading}
                                            placeholder="Your color name..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="value"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isLoading}
                                            placeholder="Your color name..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <Button disabled={isLoading} type="submit" color="sm">
                        {action}
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default ColorForm;
