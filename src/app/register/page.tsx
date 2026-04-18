'use client';

import { RegisterForm } from '../../components/forms/RegisterForm';

export default function RegisterPage() {
    return (
        <main className="min-h-screen w-full flex flex-col items-center justify-center bg-zinc-950 px-4">
            <div className="w-full max-w-md">
                <RegisterForm />
            </div>
        </main>
    );
}
