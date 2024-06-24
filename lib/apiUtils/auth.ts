import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { ERRORS } from '@/lib/errors';

/**
 * Checks if the user is authenticated and returns the user ID.
 * Throws an error response if the user is not authenticated.
 * @returns {string | null} The authenticated user's ID, or null if not authenticated.
 */
export const checkAuth = ():string | null => {
    const { userId } = auth();

    if (!userId) {
        new NextResponse(ERRORS.UNAUTHORIZED, { status: 401 });
        return null;
    }

    return userId;
};
