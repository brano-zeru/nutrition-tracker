'use client';

import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';
import { Pages } from '@/consts';
import { fetchApi } from '@/services/fetchApi';
import { getRoute } from '@/utils/utils';

export function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        await fetchApi('/api/auth/logout', 'POST');
        router.push(getRoute(Pages.LOGIN));
    };

    return (
        <Button
            type="button"
            onClick={handleLogout}
            className="bg-primary text-destructive-foreground hover:bg-primary/90 shrink-0"
        >
            <span className="hidden md:inline">Logout</span>
            <LogOut />
        </Button>
    );
}
