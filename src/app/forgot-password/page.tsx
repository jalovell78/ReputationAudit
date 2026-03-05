"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const supabase = createClient();
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
        });

        if (error) {
            setError(error.message);
        } else {
            setSent(true);
        }
        setLoading(false);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-4 selection:bg-zinc-800">
            <Card className="w-full max-w-sm bg-black/40 text-white border-zinc-800 shadow-2xl backdrop-blur-md">
                <CardHeader>
                    <Link href="/login" className="text-zinc-500 hover:text-white flex items-center gap-1 text-sm mb-2 transition-colors">
                        <ArrowLeft className="w-3 h-3" /> Back to login
                    </Link>
                    <CardTitle className="text-2xl font-semibold">Forgot your password?</CardTitle>
                    <CardDescription className="text-zinc-400">
                        Enter your email and we&apos;ll send you a secure reset link.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {sent ? (
                        <div className="flex flex-col items-center text-center gap-4 py-4">
                            <CheckCircle className="w-12 h-12 text-emerald-400" />
                            <p className="text-emerald-300 font-semibold">Reset link sent!</p>
                            <p className="text-zinc-400 text-sm">
                                Check your inbox at <strong className="text-zinc-200">{email}</strong> and click the link to set a new password.
                            </p>
                            <Link href="/login" className="text-zinc-400 hover:text-white text-sm underline transition-colors">
                                Return to login
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-zinc-300">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    autoFocus
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="bg-zinc-900 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-zinc-600"
                                />
                            </div>
                            {error && <p className="text-red-400 text-sm">{error}</p>}
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-white text-black hover:bg-zinc-200 gap-2"
                            >
                                <Mail className="w-4 h-4" />
                                {loading ? "Sending..." : "Send Reset Link"}
                            </Button>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
