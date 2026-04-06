import { UserService } from '@/services/user.service';
import { ProfileDTO } from '@/types';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'Missing require user id' },
                { status: 400 },
            );
        }

        const { profile } = await request.json();

        if (
            !profile ||
            !profile.calorieGoal ||
            !profile.proteinGoal ||
            !profile.targetWeight
        ) {
            return NextResponse.json(
                { error: 'Missing require goals settings' },
                { status: 500 },
            );
        }

        const userGoals = UserService.setUserProfile(id, profile as ProfileDTO);

        if (!userGoals) {
            return NextResponse.json(
                { error: 'failed to set user goals' },
                { status: 404 },
            );
        }

        return NextResponse.json({ goals: userGoals }, { status: 200 });
    } catch (error: unknown) {
        return NextResponse.json(
            {
                message: 'unknown error in setting user goals',
                error: (error as Error).message,
            },
            { status: 500 },
        );
    }
}
