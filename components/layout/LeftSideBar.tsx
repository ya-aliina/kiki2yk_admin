import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';
import { navLinks } from '@/lib/constants';

const LeftSideBar = () => {
    return (
        <div className="h-screen left-0 top-0 sticky p-10 flex flex-col gap-16 bg-blue-2 shadow-xl max-lg:hidden">
            <Image src="/logo.png" alt="logo" width={170} height={170} />

            <div className="flex flex-col gap-12">
                { navLinks.map((link) => (
                    <Link href={link.url} key={link.label} className="flex gap-4 text-body-medium">
                        {link.icon}
                        <span>{link.label}</span>
                    </Link>
                )) }
            </div>

            <div className="flex gap-4 text-body-medium items-center">
                <UserButton />
                <span>Edit profile</span>
            </div>
        </div>
    );
};

export default LeftSideBar;
