export async function fetchApi<T>(
    url: string,
    method: 'GET' | 'POST' | 'DELETE' = 'GET',
    body?: object,
): Promise<T> {
    const defaultHeaders = {
        'Content-Type': 'application/json',
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
