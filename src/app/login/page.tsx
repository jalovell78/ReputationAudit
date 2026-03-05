"use client";

import { useState } from 'react';
import { login, signup } from './actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

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
        <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-4 selection:bg-zinc-800">
            <Card className="w-full max-w-sm bg-black/40 text-white border-zinc-800 shadow-2xl backdrop-blur-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-semibold">The Reputation Audit</CardTitle>
                    <CardDescription className="text-zinc-400">Sign in to manage your audits or create a new one.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={(formData) => handleAction(login, formData)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="fullName" className="text-zinc-300">Full Name <span className="text-zinc-500 text-xs font-normal">(required for new accounts)</span></Label>
                            <Input id="fullName" name="fullName" type="text" className="bg-zinc-900 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-zinc-600" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-zinc-300">Email</Label>
                            <Input id="email" name="email" type="email" required className="bg-zinc-900 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-zinc-600" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-zinc-300">Password</Label>
                            <Input id="password" name="password" type="password" required className="bg-zinc-900 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-zinc-600" />
                            <div className="text-right">
                                <a href="/forgot-password" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
                                    Forgot password?
                                </a>
                            </div>
                        </div>
                        {error && (
                            <p className="text-red-400 text-sm mt-2">{error}</p>
                        )}
                        <div className="flex flex-col gap-3 mt-8 pt-4">
                            <Button type="submit" disabled={loading} className="w-full bg-white text-black hover:bg-zinc-200">
                                {loading ? "Processing..." : "Log in"}
                            </Button>
                            <Button formAction={(formData) => handleAction(signup, formData)} disabled={loading} variant="secondary" className="w-full bg-zinc-800 text-zinc-200 hover:bg-zinc-700 border border-zinc-700">
                                Sign up
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
