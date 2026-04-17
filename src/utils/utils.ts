import { Routes, Pages, USER_ID_HEADER } from '@/consts';
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

    requestHeaders.set(USER_ID_HEADER, payload.sub);

    return requestHeaders;
};

// this function is used in the useRegisterForm to accumulate data between form steps
export const accumulateData = <T, K extends keyof T>(
    prevData: Partial<T>,
    newData: Partial<T[K]>,
    scope: K,
): Partial<T> => {
    return {
        ...prevData,
        [scope]: {
            ...(prevData[scope] || {}),
            ...newData,
        },
    };
};

export const isProtectedPage = (pathname: string) => {
    return Routes.filter(({ isProtected }) => isProtected).find(
        ({ path }) => pathname === path,
    );
};
