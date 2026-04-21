import { TIME_ZONE_HEADER } from '@/consts';

type METHOD = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

export async function fetchApi<T>(
    url: string,
    method: METHOD = 'GET',
    body?: object,
): Promise<T> {
    const defaultHeaders = {
        'Content-Type': 'application/json',
        [TIME_ZONE_HEADER]: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };

    const response = await fetch(url, {
        headers: {
            ...defaultHeaders,
        },
        method,
        ...(body ? { body: JSON.stringify(body) } : {}),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'An unexpected error occurred');
    }

    return data as T;
}
