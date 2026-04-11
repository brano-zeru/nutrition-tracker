import { USER_ID_HEADER } from '@/consts';
import { UserService } from '@/services/user.service';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const userId = request.headers.get(USER_ID_HEADER);

        if (!userId) {
            return NextResponse.json(
                { message: 'user id not provided' },
                { status: 401 },
            );
        }

        const profile = await UserService.getProfile(userId);

        if (!profile) {
            return NextResponse.json(
                { message: 'user profile not found' },
                { status: 404 },
            );
        }

        return NextResponse.json({ profile }, { status: 200 });
    } catch (error: unknown) {
        return NextResponse.json(
            {
                message:
                    'unknown error accured when trying to fetch the profile',
                error: (error as Error).message,
            },
            { status: 500 },
        );
    }
}
