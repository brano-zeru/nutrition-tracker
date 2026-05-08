import { validatedRoute } from '@/lib/validations';
import {
    getProfileSchema,
    updateProfileSchema,
} from '@/lib/validations/schemas';
import { UserService } from '@/services/user.service';
import { NextResponse } from 'next/server';

export const GET = validatedRoute(
    {
        schemas: getProfileSchema,
        authRequired: true,
    },
    async (_request, { userId }) => {
        const profile = await UserService.getProfile(userId);

        if (!profile) {
            return NextResponse.json(
                { message: 'user profile not found' },
                { status: 404 },
            );
        }

        return NextResponse.json({ profile }, { status: 200 });
    },
);

export const PATCH = validatedRoute(
    {
        schemas: updateProfileSchema,
        authRequired: true,
    },
    async (_request, { body, userId }) => {
        const { profile } = body;

        const updateProfile = await UserService.updateProfile(userId, profile);

        return NextResponse.json({ profile: updateProfile }, { status: 200 });
    },
);
