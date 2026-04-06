import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { config } from 'dotenv';
import { AUTH_COOKIE_NAME } from '@/consts';
import { UserDetails } from '@/types';

config();

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

        if (!token) {
            return NextResponse.json({ user: null }, { status: 401 });
        }

        const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

        const { payload } = await jwtVerify(token, secret);

        const { userDetails } = payload as unknown as {
            userDetails: UserDetails;
        };

        return NextResponse.json({
            userDetails,
            message: 'cookies returned!',
        });
    } catch (error) {
        console.error('JWT Verification failed:', error);
        return NextResponse.json({ user: null }, { status: 401 });
    }
}
