import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/services/auth.service';

export async function POST(request: NextRequest) {
    try {
        // 1. חילוץ הנתונים מגוף הבקשה
        const { email, password, fullName } = await request.json();
        // 2. בדיקת תקינות בסיסית (Validation)

        if (!email || !password || !fullName) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 },
            );
        }

        // 3. הרשמה באמצעות ה-Service
        const user = await AuthService.register(email, password, fullName);

        // 4. החזרת תשובה חיובית (בלי הסיסמה כמובן)
        return NextResponse.json(
            { message: 'User registered successfully', user },
            { status: 201 },
        );
    } catch (error: any) {
        // טיפול בשגיאות (למשל: משתמש כבר קיים)
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 },
        );
    }
}
