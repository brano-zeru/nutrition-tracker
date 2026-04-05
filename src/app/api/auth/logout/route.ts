import { NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME } from '@/consts';

export async function POST() {
    const response = NextResponse.json(
        { message: 'Logout successful' },
        { status: 200 },
    );

    response.cookies.delete(AUTH_COOKIE_NAME);

    return response;
}
