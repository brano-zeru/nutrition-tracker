import { SignJWT, jwtVerify } from 'jose';
import { AuthPayload } from '@/types';
import { appConfig } from '@/config';
import { NextResponse } from 'next/server';

const SECRET = new TextEncoder().encode(appConfig.jwtAuthSecret);

export async function signToken(payload: AuthPayload) {
    return await new SignJWT({ ...payload })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('2h')
        .sign(SECRET);
}

export async function verifyToken(token: string): Promise<AuthPayload | null> {
    try {
        const { payload } = await jwtVerify(token, SECRET);
        return payload as unknown as AuthPayload;
    } catch (error: unknown) {
        console.error('error: ', JSON.stringify((error as Error).message));
        return null;
    }
}

export async function setCookies(
    response: NextResponse,
    cookies: { identifier: string; cookie: string }[],
) {
    cookies.forEach(({ identifier, cookie }) =>
        response.cookies.set(identifier, cookie, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            maxAge: 60 * 60 * 2,
            path: '/',
        }),
    );
}
