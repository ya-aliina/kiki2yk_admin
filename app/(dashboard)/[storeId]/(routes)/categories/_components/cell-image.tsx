'use client';

import Image from 'next/image';
import { CategoryColumns } from '@/app/(dashboard)/[storeId]/(routes)/categories/_components/columns';

interface CellImageProps{
    imageUrl: string
}

const CellImage = ({ imageUrl }: CellImageProps) => {
    return (
        <div className="overflow-hidden min-w-32  w-32 min-h-16 h-16 relative rounded-md shadow-md">
            <Image
                fill
                src={imageUrl}
                alt="Category Image"
                className="object-cover"
            />
        </div>
    );
};

export default CellImage;
