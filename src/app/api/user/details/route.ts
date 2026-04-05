import { UserService } from '@/services/user.service';
import { ProfileDTO, UserDetails } from '@/types';
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

        if (!UserService.getUser(id)) {
            return NextResponse.json(
                { error: 'unknown user' },
                { status: 404 },
            );
        }

        const userDetails = await UserService.getUserDetails(id);

        if (!userDetails) {
            return NextResponse.json(
                { error: "couldn't fetch user details" },
                { status: 500 },
            );
        }

        return NextResponse.json({ userDetails }, { status: 200 });
    } catch (error: unknown) {
        return NextResponse.json(
            {
                message:
                    'unknown error accured while trying to get user details',
                error: (error as Error).message,
            },
            { status: 500 },
        );
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'Missing require user id' },
                { status: 400 },
            );
        }

        const { details } = await request.json();

        const updatedDetails = UserService.upsertProfile(
            id,
            details as Partial<ProfileDTO>,
        );

        if (!updatedDetails) {
            return NextResponse.json(
                { error: 'updated failed' },
                { status: 500 },
            );
        }

        return NextResponse.json(
            {
                message: 'details updated successfully',
                userDetails: updatedDetails,
            },
            { status: 200 },
        );
    } catch (error: unknown) {
        return NextResponse.json(
            {
                message:
                    'unknown error accured while trying to update user details',
                error: (error as Error).message,
            },
            { status: 500 },
        );
    }
}
