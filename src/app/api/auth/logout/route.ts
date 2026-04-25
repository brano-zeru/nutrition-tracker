import { NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME } from '@/consts';
import { validatedRoute } from '@/lib/validations';
import { logoutRequestSchema } from '@/lib/validations/schemas';

export const POST = validatedRoute(
    { schemas: logoutRequestSchema },
    async (_request) => {
        const response = NextResponse.json(
            { message: 'Logout successful' },
            { status: 200 },
        );

        response.cookies.delete(AUTH_COOKIE_NAME);

        return response;
    },
);
