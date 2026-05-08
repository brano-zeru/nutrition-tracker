import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { AUTH_COOKIE_NAME } from '@/consts';
import { UserDTO } from '@/types/dto';
import { validatedRoute } from '@/lib/validations';
import { meRequestSchema } from '@/lib/validations/schemas';
import { verifyToken } from '@/lib/auth';

export const GET = validatedRoute(
    { schemas: meRequestSchema },
    async (_request) => {
        const cookieStore = await cookies();
        const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

        if (!token) {
            return NextResponse.json({ user: null }, { status: 401 });
        }

        const payload = await verifyToken(token);

        if (!payload) {
            return NextResponse.json({ user: null }, { status: 404 });
        }

        const { user } = payload as unknown as {
            user: UserDTO;
        };

        return NextResponse.json({
            user,
            message: 'cookies returned!',
        });
    },
);
