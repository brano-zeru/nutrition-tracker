import { UserService } from '@/services/user.service';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');

        if (!email) {
            return NextResponse.json(
                { message: 'Email is required' },
                { status: 400 },
            );
        }

        const exists = await UserService.isEmailUsed(email);

        return NextResponse.json({ exists });
    } catch (error: unknown) {
        return NextResponse.json(
            {
                message: 'Internal server error',
                error: (error as Error).message,
            },
            { status: 500 },
        );
    }
}
