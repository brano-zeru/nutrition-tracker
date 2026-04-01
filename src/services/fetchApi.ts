export async function fetchApi<T>(
    url: string,
    method: 'GET' | 'POST',
    body: object = {},
): Promise<T> {
    const defaultHeaders = {
        'Content-Type': 'application/json',
    };

    const response = await fetch(url, {
        headers: {
            ...defaultHeaders,
        },
        method,
        body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
        // זריקת שגיאה עם ההודעה מה-API או הודעה גנרית
        throw new Error(data.error || 'An unexpected error occurred');
    }

    return data as T;
}
