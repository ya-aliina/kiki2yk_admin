import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';
import { Menu } from 'lucide-react';
import { navLinks } from '@/lib/constants';

const TopBar = () => {
    return (
        <div className="sticky top-0 z-0 flex w-full justify-between items-center px-8 py-4 bg-blue-2 shadow-xl lg:hidden">

            <Image src="/logo.png" alt="logo" width={170} height={170} />

            <div className="flex gap-8 max-md:hidden">
                { navLinks.map((link) => (
                    <Link href={link.url} key={link.label} className="flex gap-4 text-body-medium">
                        <span>{link.label}</span>
                    </Link>
                )) }
            </div>

            <div className="flex gap-4 items-center">
                <Menu className="cursor-pointer md:hidden" />
                <UserButton />
            </div>

        </div>
    );
};

export default TopBar;
