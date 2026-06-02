"use client";

import { useState } from 'react';
import { login, signup } from './actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTenant } from '@/components/tenant-context';

export default function LoginPage() {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { tenant, config } = useTenant();
    const isMirror = tenant === 'perception_mirror';

    async function handleAction(action: typeof login | typeof signup, formData: FormData) {
        setLoading(true);
        setError(null);
        const result = await action(formData);
        if (result && 'error' in result) {
            setError(result.error);
        }
        setLoading(false);
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4 transition-colors duration-300">
            <Card className="w-full max-w-sm bg-card text-card-foreground border-border shadow-2xl backdrop-blur-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-serif font-bold text-foreground">{config.title}</CardTitle>
                    <CardDescription className="text-muted-foreground">
                        {isMirror 
                            ? "Sign in to manage your reflections or begin a new journey." 
                            : "Sign in to manage your audits or create a new one."}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={(formData) => handleAction(login, formData)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="fullName" className="text-foreground">
                                Full Name <span className="text-muted-foreground text-xs font-normal">(required for new accounts)</span>
                            </Label>
                            <Input id="fullName" name="fullName" type="text" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-foreground">Email</Label>
                            <Input id="email" name="email" type="email" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-foreground">Password</Label>
                            <Input id="password" name="password" type="password" required />
                            <div className="text-right">
                                <a href="/forgot-password" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                                    Forgot password?
                                </a>
                            </div>
                        </div>
                        {error && (
                            <p className="text-destructive text-sm mt-2">{error}</p>
                        )}
                        <div className="flex flex-col gap-3 mt-8 pt-4">
                            <Button type="submit" disabled={loading} className="w-full">
                                {loading ? "Processing..." : "Log in"}
                            </Button>
                            <Button formAction={(formData) => handleAction(signup, formData)} disabled={loading} variant="secondary" className="w-full">
                                Sign up
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

