import { validatedRoute } from '@/lib/validations';
import { checkEmailSchema } from '@/lib/validations/schemas';
import { UserService } from '@/services/user.service';
import { NextResponse } from 'next/server';

export const GET = validatedRoute(
    { schemas: checkEmailSchema },
    async (_request, { query }) => {
        const { email } = query;

        const exists = await UserService.isEmailUsed(email);

        return NextResponse.json({ exists });
    },
);
