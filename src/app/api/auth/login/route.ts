import { NextResponse } from 'next/server';
import { AuthService } from '@/services/auth.service';
import { setCookies, signToken } from '@/lib/auth';
import { AUTH_COOKIE_NAME } from '@/consts';
import { validatedRoute } from '@/lib/validations';
import { loginRequestSchema } from '@/lib/validations/schemas';

export const POST = validatedRoute(
    {
        schemas: loginRequestSchema,
    },
    async (_request, { body }) => {
        const { email, password } = body;

        const user = await AuthService.login(email, password);

        if (!user) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 },
            );
        }

        const token = await signToken({
            sub: user.id,
            user,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 2,
        });

        const response = NextResponse.json(
            { message: 'Login successful', user },
            { status: 200 },
        );

        setCookies(response, [{ identifier: AUTH_COOKIE_NAME, cookie: token }]);

        return response;
    },
);
