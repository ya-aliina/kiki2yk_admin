'use client';

import { Trash } from 'lucide-react';
import { Store } from '@/types.db';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useState} from "react";
import {useParams, useRouter} from "next/navigation";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import axios from "axios";
import toast from "react-hot-toast";

interface SettingsFormProps{
    initialData: Store
}

const formSchema = z.object({
    name: z
        .string()
        .min(2, { message: 'Store name should be minimum 2 characters' }),
});

const SettingsForm = ({ initialData }: SettingsFormProps) => {

    console.log(initialData)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
    });

    const [isLoading, setIsLoading] = useState(false);
    const params = useParams()
    const router = useRouter()

    const onSubmit = async (data : z.infer<typeof formSchema>) => {
        try {
            setIsLoading(true);
            const response = await axios.patch(`/api/stores${params.storeId}`, data);
            const storeId = response.data.id;
            toast.success('Store Updated');
            window.location.assign(`/${storeId}`);
        } catch (err) {
            toast.error('Something went wrong');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <div className="flex items-center justify-center">
                <Heading title="Settings" description="Manage Store Preferences" />
                <Button variant="destructive" size="icon" onClick={() => {}}>
                    <Trash className="h-4 w-4" />
                </Button>

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
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isLoading}
                                            placeholder="Your store name..."
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

export default SettingsForm;
