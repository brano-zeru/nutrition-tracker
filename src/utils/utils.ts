import { Routes, Pages } from '@/consts';
import { AuthPayload } from '@/types';
import { NextRequest } from 'next/server';

type Page = (typeof Pages)[keyof typeof Pages];

export const getRoute = (page: Page) => {
    return Routes.find(({ key }) => key === page)?.path || '';
};

export const setPayloadHeaders = (
    payload: AuthPayload,
    request: NextRequest,
) => {
    const requestHeaders = new Headers(request.headers);
    const internalFields = ['iat', 'exp', 'nbf'];

    Object.entries(payload).forEach(([key, value]) => {
        if (value && !internalFields.includes(key)) {
            requestHeaders.set(`x-user-${key}`, String(value));
        }
    });

    return requestHeaders;
};
