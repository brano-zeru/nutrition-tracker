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
