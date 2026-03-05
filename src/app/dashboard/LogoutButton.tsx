'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { logout } from '@/app/login/actions';

export function LogoutButton() {
    const [loading, setLoading] = useState(false);

    async function handleLogout() {
        setLoading(true);
        await logout();
        // redirect is handled by server action
    }

    return (
        <Button
            variant="outline"
            onClick={handleLogout}
            disabled={loading}
            className="border-zinc-800 bg-transparent text-zinc-400 hover:bg-white hover:text-black transition-all"
        >
            {loading ? "Logging out..." : "Log Out"}
        </Button>
    );
}
