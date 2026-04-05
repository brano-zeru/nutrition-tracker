import { UserService } from '@/services/user.service';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'Missing require user id' },
                { status: 400 },
            );
        }

        const userGoals = UserService.getUserGoals(id);

        if (!userGoals) {
            return NextResponse.json(
                { error: 'failed to fetch user goals' },
                { status: 404 },
            );
        }

        return NextResponse.json({ goals: userGoals }, { status: 200 });
    } catch (error: unknown) {
        return NextResponse.json(
            {
                message: 'unknown error in fetching user goals',
                error: (error as Error).message,
            },
            { status: 500 },
        );
    }
}
