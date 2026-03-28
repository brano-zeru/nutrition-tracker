'use client';

import * as z from 'zod';
import AuthForm from '@/components/auth/AuthForm';
import Link from 'next/link';
import { fetchApi } from '@/services/fetchApi';
import { useRouter } from 'next/navigation';

const registerSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const fields: { name: keyof RegisterFormData; label: string; type: string; placeholder: string }[] = [
    { name: 'fullName', label: 'Full Name', type: 'text', placeholder: 'John Doe' },
    { name: 'email', label: 'Email Address', type: 'email', placeholder: 'name@example.com' },
    { name: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
  ];

  const router = useRouter();

  const handleRegister = async (data: RegisterFormData) => {
      const {email, password, fullName} = data;
      try {
        const response = await fetchApi<{message: string, user: any}>('/api/auth/register', 'POST', {
            email,
            password,
            fullName,
        });
        
        if (response.user) {
          router.push('/login');
        }
      } catch (error: unknown) {
        console.log('error: ', JSON.stringify((error as Error).message))
      }
  };

  return (
    <AuthForm
      title="Join Nutrish"
      description="Start your nutrition journey today."
      schema={registerSchema}
      fields={fields}
      onSubmit={handleRegister}
      submitLabel="Create Account"
      isSubmittingLabel="Creating account..."
      linkElement={
        <p>
          {`Already have an account? `}
          <Link href="/login" className="text-emerald-500 hover:text-emerald-400 font-medium">
            Log in
          </Link>
        </p>
      }
    />
  );
}