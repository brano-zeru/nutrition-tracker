'use client';

import { useRouter } from 'next/navigation';
import { Button } from './ui/button';

export function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/login');
    };

    return (
        <Button
            type="button"
            onClick={handleLogout}
            className="bg-primary text-destructive-foreground hover:bg-primary/90 shrink-0"
        >
            <span className="hidden sm:inline">Logout</span>
        </Button>
    );
}
