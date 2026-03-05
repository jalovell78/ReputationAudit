"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export function FeedbackForm({ id, archetype, subjectName, goalType }: { id: string; archetype: string; subjectName: string; goalType: string | null }) {
    const [feedback, setFeedback] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/submit-feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, feedback }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to submit feedback");
            }

            router.refresh(); // Refresh the page to show the Thank You state
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-lg mx-auto mt-12 bg-black/40 text-white border-zinc-800 shadow-2xl backdrop-blur-md">
            <CardHeader className="space-y-4">
                <CardTitle className="text-2xl text-zinc-100">
                    The Reputation Audit for <span className="capitalize">{subjectName}</span>
                </CardTitle>

                <div className="space-y-4 text-zinc-400">
                    <p>
                        <span className="capitalize">{subjectName}</span> has asked for your radical, anonymous feedback to help them with their goal of <strong>{goalType ? goalType.replace('_', ' ') : 'personal development'}</strong>. You are providing this as a <strong>{archetype}</strong>.
                    </p>

                    <p className="text-center font-medium text-emerald-400/90 bg-emerald-950/30 py-2 rounded-md border border-emerald-900/50">
                        Your identity is strictly masked.
                    </p>

                    <p className="text-sm">
                        Your words will be summarized by AI and blended with other raters before <span className="capitalize">{subjectName}</span> ever sees it.
                    </p>
                </div>
            </CardHeader>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <CardContent>
                    <Textarea
                        placeholder={`1. What is ${subjectName}'s biggest blind spot regarding ${goalType ? goalType.replace('_', ' ') : 'their development'}?\n2. What is a hard truth they need to hear but no one will tell them?\n3. What is their greatest un-leveraged strength?`}
                        className="min-h-[200px] bg-zinc-900 border-zinc-700 text-zinc-200 placeholder:text-zinc-500 focus-visible:ring-zinc-600 focus-visible:border-zinc-500"
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        disabled={loading}
                        required
                    />
                    {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full bg-white text-black hover:bg-zinc-200" disabled={loading}>
                        {loading ? "Sanitizing & Submitting..." : "Submit Anonymous Truth"}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
