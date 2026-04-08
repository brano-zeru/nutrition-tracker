'use client';

import * as z from 'zod';
import { fetchApi } from '@/services/fetchApi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Pages } from '@/consts';
import { getRoute } from '@/utils';
import { UserDetails, UserDTO } from '@/types';
import { GenericForm } from '@/components/GenericForm';
import { useAuth } from '@/contexts/AuthContext';

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

    const { setUser } = useAuth();

    const handleLogin = async (data: LoginFormData) => {
        try {
            const { user } = await fetchApi<{
                message: string;
                user: UserDTO;
            }>('/api/auth/login', 'POST', data);

            console.log({ user });

            if (user) {
                setUser(user);
                router.push(getRoute(Pages.HOME));
            }
        } catch (error: unknown) {
            console.error('Login failed:', (error as Error).message);
        }
    };

    return (
        <main className="min-h-screen w-full flex items-center justify-center bg-zinc-950 px-4">
            <div className="w-full max-w-md">
                <GenericForm
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
            </div>
        </main>
    );
}
