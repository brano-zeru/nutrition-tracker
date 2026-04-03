import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME, Pages, Routes } from './consts';
import { getRoute, setPayloadHeaders } from './utils';
import { verifyToken } from './lib/auth';

export async function proxy(request: NextRequest) {
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
    const { pathname } = request.nextUrl;

    const isProtectedPage = Routes.filter(
        ({ isProtected }) => isProtected,
    ).find(({ path }) => pathname === path);

    const payload = token ? await verifyToken(token) : null;

    if (!token && isProtectedPage) {
        return NextResponse.redirect(
            new URL(getRoute(Pages.LOGIN), request.url),
        );
    }

    if (payload) {
        const requestHeaders = setPayloadHeaders(payload, request);

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
