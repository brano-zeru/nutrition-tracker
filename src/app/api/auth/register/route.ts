import { AuthService } from '@/services/auth.service';
import { RegisterUserDTO } from '@/types';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { user, profile } = await req.json();

        if (
            !user?.email ||
            !user?.role ||
            !user?.fullName ||
            !profile?.age ||
            !profile?.height ||
            !profile?.weight ||
            !profile?.targetWeight
        ) {
            return NextResponse.json(
                { error: 'required fields are missing' },
                { status: 500 },
            );
        }

        const userDetails = await AuthService.register({
            user,
            profile,
        } as RegisterUserDTO);

        return NextResponse.json(
            {
                message: 'User created successfully',
                userDetails,
            },
            { status: 201 },
        );
    } catch (error: unknown) {
        return NextResponse.json(
            {
                message: 'unknown error accured on register',
                error: (error as Error).message,
            },
            { status: 500 },
        );
    }
}
