"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Crown, Heart, Users, Plus, Trash2, ChevronRight, ChevronLeft } from "lucide-react";

const GOAL_OPTIONS = [
    {
        id: "career_progression",
        icon: <Briefcase className="w-6 h-6" />,
        label: "Career Progression",
        desc: "Advance faster, build executive presence, and signal leadership readiness.",
    },
    {
        id: "leadership_mastery",
        icon: <Crown className="w-6 h-6" />,
        label: "Leadership Mastery",
        desc: "Build authority, create psychological safety, and amplify team performance.",
    },
    {
        id: "personal_growth",
        icon: <Heart className="w-6 h-6" />,
        label: "Personal Growth",
        desc: "Deepen self-awareness, break limiting patterns, and evolve your character.",
    },
    {
        id: "social_intelligence",
        icon: <Users className="w-6 h-6" />,
        label: "Social Intelligence",
        desc: "Master empathy, active listening, and authentic relational influence.",
    },
];

const ARCHETYPE_GROUP_OPTIONS = [
    "Manager / Senior Leader",
    "Peer / Colleague",
    "Direct Report",
    "Client / Customer",
    "Close Friend",
    "Family Member",
    "Critic / Challenger",
];

type Rater = { name: string; email: string; archetype: string; archetype_group: string };

function createEmptyRater(): Rater {
    return { name: "", email: "", archetype: "Peer / Colleague", archetype_group: "peer" };
}

export function SetupWizard() {
    const router = useRouter();
    const [step, setStep] = useState(0); // 0 = goal, 1 = raters
    const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [raters, setRaters] = useState<Rater[]>([createEmptyRater(), createEmptyRater(), createEmptyRater()]);

    const addRater = () => {
        if (raters.length < 20) setRaters([...raters, createEmptyRater()]);
    };

    const removeRater = (i: number) => {
        if (raters.length > 1) setRaters(raters.filter((_, idx) => idx !== i));
    };

    const updateRater = (i: number, field: keyof Rater, value: string) => {
        const updated = [...raters];
        updated[i] = { ...updated[i], [field]: value };
        setRaters(updated);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (raters.length < 1) {
            setError("Add at least 1 rater to continue.");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/create-audit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ raters, goalType: selectedGoal }),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to create audit");
            }
            router.push("/dashboard");
            router.refresh();
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    // --- STEP 0: Goal Selection ---
    if (step === 0) {
        return (
            <Card className="w-full max-w-2xl mx-auto bg-black/40 text-white border-zinc-800 shadow-2xl backdrop-blur-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-semibold">What's your strategic goal?</CardTitle>
                    <CardDescription className="text-zinc-400">
                        Choose your primary growth objective. Gemini will tailor the feedback prompts and your final report to this goal.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {GOAL_OPTIONS.map((goal) => (
                        <button
                            key={goal.id}
                            type="button"
                            onClick={() => setSelectedGoal(goal.id)}
                            className={`text-left p-5 rounded-xl border transition-all space-y-2 ${selectedGoal === goal.id
                                    ? "border-emerald-500 bg-emerald-500/10"
                                    : "border-zinc-800 bg-zinc-900/60 hover:border-zinc-600"
                                }`}
                        >
                            <div className={`${selectedGoal === goal.id ? "text-emerald-400" : "text-zinc-400"}`}>
                                {goal.icon}
                            </div>
                            <p className="font-semibold text-white">{goal.label}</p>
                            <p className="text-zinc-400 text-sm leading-relaxed">{goal.desc}</p>
                        </button>
                    ))}
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="ghost" className="text-zinc-500" onClick={() => setSelectedGoal(null)}>
                        Skip goal (generic audit)
                    </Button>
                    <Button
                        className="bg-white text-black hover:bg-zinc-200 gap-2"
                        onClick={() => setStep(1)}
                    >
                        Next: Nominate Raters <ChevronRight className="w-4 h-4" />
                    </Button>
                </CardFooter>
            </Card>
        );
    }

    // --- STEP 1: Rater Nomination ---
    return (
        <Card className="w-full max-w-2xl mx-auto bg-black/40 text-white border-zinc-800 shadow-2xl backdrop-blur-md">
            <CardHeader>
                <div className="flex items-center gap-2 mb-1">
                    <button
                        type="button"
                        onClick={() => setStep(0)}
                        className="text-zinc-500 hover:text-white flex items-center gap-1 text-sm"
                    >
                        <ChevronLeft className="w-4 h-4" /> Back to Goal
                    </button>
                </div>
                <CardTitle className="text-2xl font-semibold">Nominate Your Raters</CardTitle>
                <CardDescription className="text-zinc-400">
                    Add between 1 and 20 people. We generate a unique, anonymous link for each so they can speak freely.
                    {selectedGoal && (
                        <span className="mt-1 block text-emerald-400 text-xs">
                            Goal: {GOAL_OPTIONS.find(g => g.id === selectedGoal)?.label}
                        </span>
                    )}
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    {raters.map((rater, index) => (
                        <div key={index} className="p-4 rounded-lg bg-zinc-900 border border-zinc-800 space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="bg-white text-black text-sm font-bold w-6 h-6 flex items-center justify-center rounded-full">
                                        {index + 1}
                                    </div>
                                    <h3 className="font-medium text-zinc-300">Rater {index + 1}</h3>
                                </div>
                                {raters.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeRater(index)}
                                        className="text-zinc-600 hover:text-red-400 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>

                            <div>
                                <Label className="text-zinc-400 text-xs uppercase tracking-wider mb-1 block">Role / Archetype</Label>
                                <select
                                    value={rater.archetype}
                                    onChange={(e) => {
                                        updateRater(index, "archetype", e.target.value);
                                        updateRater(index, "archetype_group", e.target.value.toLowerCase().replace(/\s*\/\s*/, "_").replace(/\s+/g, "_"));
                                    }}
                                    className="w-full bg-zinc-950 border border-zinc-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-zinc-600"
                                >
                                    {ARCHETYPE_GROUP_OPTIONS.map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <Label htmlFor={`name-${index}`} className="text-zinc-400 text-xs uppercase tracking-wider mb-1 block">Name</Label>
                                    <Input
                                        id={`name-${index}`}
                                        required
                                        className="bg-zinc-950 border-zinc-700 focus-visible:ring-zinc-600"
                                        placeholder="Jane Doe"
                                        value={rater.name}
                                        onChange={(e) => updateRater(index, "name", e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor={`email-${index}`} className="text-zinc-400 text-xs uppercase tracking-wider mb-1 block">Email</Label>
                                    <Input
                                        id={`email-${index}`}
                                        type="email"
                                        required
                                        className="bg-zinc-950 border-zinc-700 focus-visible:ring-zinc-600"
                                        placeholder="jane@example.com"
                                        value={rater.email}
                                        onChange={(e) => updateRater(index, "email", e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}

                    {raters.length < 20 && (
                        <button
                            type="button"
                            onClick={addRater}
                            className="w-full py-3 rounded-lg border-2 border-dashed border-zinc-700 text-zinc-500 hover:border-zinc-500 hover:text-zinc-300 transition-colors flex items-center justify-center gap-2 text-sm"
                        >
                            <Plus className="w-4 h-4" /> Add Another Rater
                        </button>
                    )}

                    {error && <p className="text-red-400 text-sm">{error}</p>}
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full bg-white text-black hover:bg-zinc-200" disabled={loading}>
                        {loading ? "Generating Anonymous Links..." : `Launch Audit with ${raters.length} Rater${raters.length !== 1 ? "s" : ""}`}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
