import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/services/auth.service';
import { signToken } from '@/lib/auth';
import { AUTH_COOKIE_NAME } from '@/consts';

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 },
            );
        }

        const user = await AuthService.login(email, password);

        if (!user) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 },
            );
        }

        const token = await signToken({
            sub: user.id,
            user,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 2,
        });

        const response = NextResponse.json(
            { message: 'Login successful', user },
            { status: 200 },
        );

        response.cookies.set(AUTH_COOKIE_NAME, token, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            maxAge: 60 * 60 * 2,
            path: '/',
        });

        return response;
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 },
        );
    }
}
