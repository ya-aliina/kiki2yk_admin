'use client';

import { Trash } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import Heading from '@/components/heading';
import { Billboards } from '@/types.db';
import AlertModal from '@/components/modal/alert-modal';

interface BillboardFormProps{
    initialData: Billboards
}

const formSchema = z.object({
    label: z.string().min(1),
    imageUrl: z.string().min(1),
});

const BillboardForm = ({ initialData }: BillboardFormProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData,
    });

    const params = useParams();
    const router = useRouter();

    const title = initialData ? 'Edit Billboard' : 'Create Billboard';
    const toastMessage = initialData ? 'Billboard Updated' : 'Billboard Created';
    const action = initialData ? 'Save Changes' : 'Create Billboard';

    const onSubmit = async (data : z.infer<typeof formSchema>) => {
        try {
            setIsLoading(true);

            const response = await axios.patch(`/api/stores/${params.storeId}`, data);
            toast.success('Store Updated');
            router.refresh();
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

            const response = await axios.delete(`/api/stores/${params.storeId}`);
            toast.success('Store Removed');
            router.refresh();
            router.push('/');
        } catch (err) {
            toast.error('Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={isLoading}
            />

            <div className="flex items-center justify-center">
                <Heading title={title} description="" />
                { initialData
                    && (
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
                    <div className="grid grid-cols-3 gap-3">
                        <FormField
                            control={form.control}
                            name="imageUrl"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Billboard Image<FormLabel/>
                                    <FormControl>
                                        <ImageUpload />
                                    </FormControl>
                                <FormItem/>
                            )}
                        />


                        <FormField
                            control={form.control}
                            name="label"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isLoading}
                                            placeholder="Your billboard name..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <Button disabled={isLoading} type="submit" size="sm">
                        Save Changes
                    </Button>
                </form>
            </Form>

        </>
    );
};

export default BillboardForm;
