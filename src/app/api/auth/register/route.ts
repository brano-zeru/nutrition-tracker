import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/services/auth.service';

export async function POST(request: NextRequest) {
    try {
        const { email, password, fullName } = await request.json();

        if (!email || !password || !fullName) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 },
            );
        }

        const user = await AuthService.register(email, password, fullName);

        return NextResponse.json(
            { message: 'User registered successfully', user },
            { status: 201 },
        );
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 },
        );
    }
}
