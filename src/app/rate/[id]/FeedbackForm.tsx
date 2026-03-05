"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export function FeedbackForm({ id, archetype }: { id: string; archetype: string }) {
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
            <CardHeader>
                <CardTitle className="text-2xl text-zinc-100">The Reputation Audit</CardTitle>
                <CardDescription className="text-zinc-400">
                    You have been asked to provide radical, anonymous feedback as a <strong>{archetype}</strong>.
                    Your identity is masked. Be brutally honest.
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent>
                    <Textarea
                        placeholder="Type your unvarnished truth here..."
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
