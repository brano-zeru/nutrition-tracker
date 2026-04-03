'use client';

import * as z from 'zod';
import AuthForm from '@/components/auth/AuthForm';
import { fetchApi } from '@/services/fetchApi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Pages } from '@/consts';
import { getRoute } from '@/utils';
import { UserDTO } from '@/types';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const fields: {
        name: keyof LoginFormData;
        label: string;
        type: string;
        placeholder: string;
    }[] = [
        {
            name: 'email',
            label: 'Email Address',
            type: 'email',
            placeholder: 'name@example.com',
        },
        {
            name: 'password',
            label: 'Password',
            type: 'password',
            placeholder: '••••••••',
        },
    ];

    const router = useRouter();

    const handleLogin = async (data: LoginFormData) => {
        try {
            const result = await fetchApi<{ message: string; user: UserDTO }>(
                '/api/auth/login',
                'POST',
                data,
            );

            if (result.user) {
                router.push(getRoute(Pages.HOME));
            }
        } catch (err: unknown) {
            console.error('Login failed:', (err as Error).message);
        }
    };

    return (
        <AuthForm
            title="Nutrish"
            description="Welcome back! Sign in to continue."
            schema={loginSchema}
            fields={fields}
            onSubmit={handleLogin}
            submitLabel="Sign In"
            isSubmittingLabel="Signing in..."
            linkElement={
                <p>
                    {`Don't have an account? `}
                    <Link
                        href="/register"
                        className="text-emerald-500 hover:text-emerald-400 font-medium"
                    >
                        Sign up
                    </Link>
                </p>
            }
        />
    );
}
