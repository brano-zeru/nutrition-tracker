export const Pages = {
    HOME: 'home',
    LOGIN: 'login',
    REGISTER: 'register',
} as const;

interface Route {
    key: string;
    path: string;
    isProtected?: boolean;
}

export const Routes: Route[] = [
    { key: Pages.HOME, path: '/', isProtected: true },
    { key: Pages.LOGIN, path: '/login' },
    { key: Pages.REGISTER, path: '/register' },
];

export const AUTH_COOKIE_NAME = 'auth-token';
