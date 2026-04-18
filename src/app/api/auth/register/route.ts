import { AUTH_COOKIE_NAME } from '@/consts';
import { signToken } from '@/lib/auth';
import { AuthService } from '@/services/auth.service';
import { RegisterUserDTO } from '@/types';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { user, profile } = await req.json();

        if (
            !user?.email ||
            !user?.role ||
            !user?.fullName ||
            !profile?.age ||
            !profile?.height ||
            !profile?.weight ||
            !profile?.targetWeight
        ) {
            return NextResponse.json(
                {
                    error: 'required fields are missing',
                    profile,
                    user,
                },
                { status: 500 },
            );
        }

        const userResults = await AuthService.register({
            user,
            profile,
        } as RegisterUserDTO);

        if (!userResults) return null;

        const token = await signToken({
            sub: userResults.id,
            user: userResults,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 2,
        });

        const response = NextResponse.json(
            {
                message: 'User created successfully',
                user: userResults,
            },
            { status: 201 },
        );

        response.cookies.set(AUTH_COOKIE_NAME, token, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            maxAge: 60 * 60 * 2,
            path: '/',
        });

        return response;
    } catch (error: unknown) {
        return NextResponse.json(
            {
                message: 'unknown error accured on register',
                error: (error as Error).message,
            },
            { status: 500 },
        );
    }
}
