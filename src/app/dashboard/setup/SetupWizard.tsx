"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export const ARCHETYPES = [
    "Close Friend",
    "Client",
    "Family Member",
    "Critic/Hater",
    "Subordinate"
];

export function SetupWizard() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form state holding name and email for each archetype
    const [raters, setRaters] = useState(
        ARCHETYPES.map(arch => ({ archetype: arch, name: "", email: "" }))
    );

    const handleInputChange = (index: number, field: "name" | "email", value: string) => {
        const newRaters = [...raters];
        newRaters[index][field] = value;
        setRaters(newRaters);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/create-audit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ raters }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to create audit");
            }

            // Redirect to dashboard to see the newly generated links
            router.push("/dashboard");
            router.refresh();
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-2xl mx-auto bg-black/40 text-white border-zinc-800 shadow-2xl backdrop-blur-md">
            <CardHeader>
                <CardTitle className="text-2xl font-semibold">Start a New Reputation Audit</CardTitle>
                <CardDescription className="text-zinc-400">
                    Nominate 5 people across these specific archetypes to get a well-rounded, radical 360-degree review.
                    Provide their names and emails below so we can generate unique, anonymous submission links for them.
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6">
                    {raters.map((rater, index) => (
                        <div key={rater.archetype} className="p-4 rounded-lg bg-zinc-900 border border-zinc-800 space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="bg-white text-black text-sm font-bold w-6 h-6 flex items-center justify-center rounded-full">
                                    {index + 1}
                                </div>
                                <h3 className="font-medium text-lg">{rater.archetype}</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor={`name-${index}`} className="text-zinc-400 text-xs uppercase tracking-wider">Rater Name</Label>
                                    <Input
                                        id={`name-${index}`}
                                        required
                                        className="bg-zinc-950 border-zinc-700 focus-visible:ring-zinc-600"
                                        placeholder="e.g. Jane Doe"
                                        value={rater.name}
                                        onChange={(e) => handleInputChange(index, "name", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor={`email-${index}`} className="text-zinc-400 text-xs uppercase tracking-wider">Rater Email</Label>
                                    <Input
                                        id={`email-${index}`}
                                        type="email"
                                        required
                                        className="bg-zinc-950 border-zinc-700 focus-visible:ring-zinc-600"
                                        placeholder="jane@example.com"
                                        value={rater.email}
                                        onChange={(e) => handleInputChange(index, "email", e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}

                    {error && <p className="text-red-400 text-sm">{error}</p>}
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full bg-white text-black hover:bg-zinc-200" disabled={loading}>
                        {loading ? "Generating Unique Links..." : "Generate Audit & Dispatch Links"}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
