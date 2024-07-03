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
import { Category } from '@/types.db';
import AlertModal from '@/components/modal/alert-modal';
import ImageUpload from '@/components/image-upload';
import { storage } from '@/lib/firebase';

interface CategoryFormProps{
    initialData: Category
}

const formSchema = z.object({
    label: z.string().min(1),
    imageUrl: z.string().min(1),
});

const CategoryForm = ({ initialData }: CategoryFormProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData,
    });

    const params = useParams();
    const router = useRouter();

    const title = initialData ? 'Edit Category' : 'Create Category';
    const toastMessage = initialData ? 'Category Updated' : 'Category Created';
    const action = initialData ? 'Save Changes' : 'Create Category';

    const href = {
        category: `/${params.storeId}/categories/${params.categoryId}`,
        categoriesList: `/${params.storeId}/categories`,
    };

    const onSubmit = async (data : z.infer<typeof formSchema>) => {
        try {
            setIsLoading(true);

            if (initialData) {
                await axios.patch(`/api${href.category}`, data);
            } else {
                await axios.post(`/api${href.categoriesList}`, data);
            }
            router.push(href.categoriesList);
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
            const { imageUrl } = form.getValues();
            await deleteObject(ref(storage, imageUrl)).then(async () => {
                await axios.delete(`/api${href.category}`);
            });

            toast.success('Category Removed');
            router.refresh();
            router.push(href.categoriesList);
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
                        size="icon"
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

                    <FormField
                        control={form.control}
                        name="imageUrl"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category image</FormLabel>
                                <FormControl>
                                    <ImageUpload
                                        value={field.value ? [field.value] : []}
                                        disabled={isLoading}
                                        onChange={(url) => field.onChange(url)}
                                        onRemove={() => field.onChange('')}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-3 gap-3">
                        <FormField
                            control={form.control}
                            name="label"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isLoading}
                                            placeholder="Your category name..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <Button disabled={isLoading} type="submit" size="sm">
                        { action }
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default CategoryForm;
