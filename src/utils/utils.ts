import { Routes, Pages, USER_ID_HEADER } from '@/consts';
import { AuthPayload, CalculationParams } from '@/types';
import { ActivityLevel } from '@prisma/client';
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

export const calculateRecommendedGoals = ({
    weight,
    height,
    age,
    activityLevel,
}: CalculationParams) => {
    const bmr = 10 * weight + 6.25 * height - 5 * age + 5;

    const multipliers: Record<ActivityLevel, number> = {
        SEDENTARY: 1.2,
        LIGHTLY_ACTIVE: 1.375,
        MODERATELY_ACTIVE: 1.55,
        VERY_ACTIVE: 1.725,
        EXTRA_ACTIVE: 1.9,
    };

    const tdee = bmr * (multipliers[activityLevel] || 1.2);

    const heightInMeters = height / 100;
    const idealWeight = Math.round(22 * (heightInMeters * heightInMeters));

    return {
        calories: Math.round(tdee),
        protein: Math.round(weight * 2),
        weight: idealWeight,
    };
};

export const isLocal = () => {
    return process.env.NODE_ENV === 'development';
};
