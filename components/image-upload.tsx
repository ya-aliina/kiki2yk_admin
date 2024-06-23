'use client';

import React, { useEffect, useState } from 'react';
import { PuffLoader } from 'react-spinners';
import { ImagePlus, Trash } from 'lucide-react';
import toast from 'react-hot-toast';
import {deleteObject, getDownloadURL, ref, uploadBytesResumable} from '@firebase/storage';
import Image from 'next/image';
import { storage } from '@/lib/firebase';
import { Button } from '@/components/ui/button';

interface ImageUploadProps {
    disabled? : boolean,
    onChange: (value : string) => void,
    onRemove: (value : string) => void,
    value: string[],
}

const ImageUpload = (props: ImageUploadProps) => {
    const {
        disabled,
        onChange,
        onRemove,
        value,
    } = props;

    const [isMounted, setIsMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState<number>(0);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    const onUpload = async (e: any) => {
        const file = e.target.files[0];
        setIsLoading(true);

        const uploadTask = uploadBytesResumable(
            ref(storage, `Images/${Date.now()}-${file.name}`),
            file,
            { contentType: file.type },
        );

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            },
            (error) => toast.error(error.message),
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    onChange(downloadURL);
                    setIsLoading(false);
                });
            },
        );
    };

    const onDelete = (url: string) => {
        onRemove(url);
        deleteObject(ref(storage, url))
            .then(
                () => toast.success('Image Removed'),
            );
    };

    return (
        <div>
            {
                value && value.length > 0
                    ? (
                        <div className="mb-4 flex items-center gap-4">
                            {value.map((url) => (
                                <div className="relative w-52 h-52 rounded-md overflow-hidden" key={url}>
                                    <Image
                                        fill
                                        sizes="(max-width: 768px)"
                                        className="object-cover"
                                        alt="Billboard Image"
                                        src={url}
                                    />
                                    <div className="absolute z-10 top-2 right-2">
                                        <Button
                                            type="button"
                                            onClick={() => onDelete(url)}
                                            variant="destructive"
                                            size="icon"
                                        >
                                            <Trash className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                    : (
                        <div
                            className="w-52 h-52 rounded-md overflow-hidden border border-dashed border-gray-200
                            hover:border-gray-400 transition-colors duration-300 flex items-center justify-center
                            flex-col gap-3"
                        >
                            {isLoading
                                ? (
                                    <div>
                                        <PuffLoader size={30} color="#555" />
                                        <p>{`${progress.toFixed(2)}%`}</p>
                                    </div>
                                )
                                : (
                                    <label htmlFor="imageUpload" className="flex w-full h-full box-border ">
                                        <div className="w-full h-full flex flex-col gap-2 items-center justify-center
                                                         cursor-pointer"
                                        >
                                            <ImagePlus className="w-4 h-4" />
                                            <p>Upload Image</p>
                                        </div>
                                        <input
                                            type="file"
                                            onChange={onUpload}
                                            accept="image/*"
                                            className="w-0 h-0"
                                            id="imageUpload"
                                        />
                                    </label>
                                )}
                        </div>
                    )
            }
        </div>
    );
};

export default ImageUpload;
