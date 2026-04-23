import { AUTH_COOKIE_NAME } from '@/consts';
import { setCookies, signToken } from '@/lib/auth';
import { validatedRoute } from '@/lib/validations';
import { registerRequestSchema } from '@/lib/validations/schemas';
import { AuthService } from '@/services/auth.service';
import { RegisterUserDTO } from '@/types/dto';
import { NextResponse } from 'next/server';

export const POST = validatedRoute(
    { schemas: registerRequestSchema },
    async (_request, { body }) => {
        const { user, profile } = body;

        const userResults = await AuthService.register({
            user,
            profile,
        } as RegisterUserDTO);

        if (!userResults) {
            return NextResponse.json(
                { error: 'Registration failed' },
                { status: 400 },
            );
        }

        const token = await signToken({
            sub: userResults.id,
            user: userResults,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 2,
        });

        const response = NextResponse.json(
            {
                message: 'User created successfully',
                user: userResults,
            },
            { status: 201 },
        );

        setCookies(response, [{ identifier: AUTH_COOKIE_NAME, cookie: token }]);

        return response;
    },
);
