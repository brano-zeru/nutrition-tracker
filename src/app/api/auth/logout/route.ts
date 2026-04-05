import { NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME } from '@/consts';

export async function POST() {
    const response = NextResponse.json(
        { message: 'Logout successful' },
        { status: 200 },
    );

    response.cookies.set(AUTH_COOKIE_NAME, '', {
        path: '/',
        maxAge: 0,
    });

    return response;
}
