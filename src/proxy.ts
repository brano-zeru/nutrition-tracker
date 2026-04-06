import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME, Pages, Routes } from './consts';
import { getRoute, setPayloadHeaders } from './utils';
import { jwtVerify } from 'jose';
import { appConfig } from './config';
import { AuthPayload } from './types';

export async function proxy(request: NextRequest) {
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
    const { pathname } = request.nextUrl;

    const isProtectedPage = Routes.filter(
        ({ isProtected }) => isProtected,
    ).find(({ path }) => pathname === path);

    let payload = null;

    if (token) {
        try {
            const secret = new TextEncoder().encode(appConfig.jwtAuthSecret!);

            const { payload: decodedPayload } = await jwtVerify(token, secret);
            payload = decodedPayload;
        } catch (error) {
            console.error('Middleware JWT verification failed:', error);
            payload = null;
        }
    }

    if (!payload && isProtectedPage) {
        return NextResponse.redirect(
            new URL(getRoute(Pages.LOGIN), request.url),
        );
    }

    if (payload) {
        const requestHeaders = setPayloadHeaders(
            payload as unknown as AuthPayload,
            request,
        );

        return NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        });
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
