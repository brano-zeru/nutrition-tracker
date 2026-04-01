import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
    // 1. חילוץ הטוקן מהעוגיות (אנחנו נגדיר אותו ב-Login API בהמשך)
    const token = request.cookies.get('auth-token')?.value;

    const { pathname } = request.nextUrl;

    // 2. הגדרת הנתיבים
    const isAuthPage =
        pathname.startsWith('/login') || pathname.startsWith('/register');
    const isPublicPage = pathname === '/'; // דף נחיתה אם יהיה כזה בעתיד

    // 3. לוגיקת ה-Redirect

    // א. אם המשתמש לא מחובר ומנסה להיכנס לדשבורד
    if (!token && !isAuthPage && !isPublicPage) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // ב. אם המשתמש מחובר ומנסה להיכנס ללוגין/הרשמה - שלח אותו פנימה
    if (token && isAuthPage) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // ג. אם הכל תקין - המשך כרגיל
    return NextResponse.next();
}

// 4. הגדרת ה-Matcher (על מה ה-Middleware רץ)
export const config = {
    matcher: [
        /*
         * החרגת נתיבים שלא דורשים Middleware (תמונות, קבצים סטטיים, וכו')
         * והפעלתו על כל השאר.
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
