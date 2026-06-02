"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Briefcase, Crown, Heart, Users, Plus, Trash2, ChevronRight, ChevronLeft, ArrowLeft } from "lucide-react";
import { useTenant } from "@/components/tenant-context";

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
    
    const { tenant, config } = useTenant();
    const isMirror = tenant === 'perception_mirror';

    const GOAL_OPTIONS = [
        {
            id: "career_progression",
            icon: <Briefcase className="w-6 h-6" />,
            label: isMirror ? "Professional Alignment" : "Career Progression",
            desc: isMirror 
                ? "Advance with alignment, build authentic presence, and signal collaborative readiness." 
                : "Advance faster, build executive presence, and signal leadership readiness.",
        },
        {
            id: "leadership_mastery",
            icon: <Crown className="w-6 h-6" />,
            label: isMirror ? "Conscious Leadership" : "Leadership Mastery",
            desc: isMirror 
                ? "Build collaborative authority, create deep trust, and lift team spirit." 
                : "Build authority, create psychological safety, and amplify team performance.",
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
            setError(isMirror ? "Add at least 1 reflection partner to continue." : "Add at least 1 rater to continue.");
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
            <div className="w-full max-w-4xl mx-auto">
                <div className="mb-8 pl-1">
                    <h1 className="text-4xl font-serif font-bold tracking-tight text-foreground mb-2">
                        {isMirror ? "Configure Reflection" : "Configure Audit"}
                    </h1>
                    <p className="text-muted-foreground">Step 1 of 2: Select your development objective.</p>
                </div>
                <Card className="w-full bg-card text-card-foreground border-border shadow-2xl backdrop-blur-md">
                    <CardHeader>
                        <div className="flex items-center gap-2 mb-2">
                            <Link href="/dashboard" className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm transition-colors w-fit">
                                <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                            </Link>
                        </div>
                        <CardTitle className="text-2xl font-serif font-semibold text-foreground">What's your primary goal?</CardTitle>
                        <CardDescription className="text-muted-foreground">
                            {isMirror 
                                ? "Choose your primary growth objective. Gemini will tailor the reflection prompts and your final report to this goal."
                                : "Choose your primary growth objective. Gemini will tailor the feedback prompts and your final report to this goal."}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {GOAL_OPTIONS.map((goal) => (
                            <button
                                key={goal.id}
                                type="button"
                                onClick={() => setSelectedGoal(goal.id)}
                                className={`text-left p-5 rounded-xl border transition-all space-y-2 cursor-pointer ${selectedGoal === goal.id
                                    ? "border-primary bg-primary/10"
                                    : "border-border bg-secondary/20 hover:border-primary/50"
                                    }`}
                            >
                                <div className={`${selectedGoal === goal.id ? "text-primary" : "text-muted-foreground"}`}>
                                    {goal.icon}
                                </div>
                                <p className="font-semibold text-foreground">{goal.label}</p>
                                <p className="text-muted-foreground text-sm leading-relaxed">{goal.desc}</p>
                            </button>
                        ))}
                    </CardContent>
                    <CardFooter className="flex justify-between flex-wrap gap-4 pt-4">
                        <Button variant="ghost" className="text-muted-foreground" onClick={() => setSelectedGoal(null)}>
                            {isMirror ? "Skip goal (generic reflection)" : "Skip goal (generic audit)"}
                        </Button>
                        <Button
                            className="rounded-full font-bold gap-2"
                            onClick={() => setStep(1)}
                        >
                            Next: {isMirror ? "Nominate Inner Circle" : "Nominate Raters"} <ChevronRight className="w-4 h-4" />
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    // --- STEP 1: Rater Nomination ---
    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="mb-8 pl-1">
                <h1 className="text-4xl font-serif font-bold tracking-tight text-foreground mb-2">
                    {isMirror ? "Configure Reflection" : "Configure Audit"}
                </h1>
                <p className="text-muted-foreground">Step 2 of 2: Define your roster.</p>
            </div>
            <Card className="w-full max-w-2xl mx-auto bg-card text-card-foreground border-border shadow-2xl backdrop-blur-md">
                <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                        <button
                            type="button"
                            onClick={() => setStep(0)}
                            className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm transition-colors cursor-pointer"
                        >
                            <ChevronLeft className="w-4 h-4" /> Back to Goal
                        </button>
                        <Link href="/dashboard" className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm transition-colors w-fit">
                            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                        </Link>
                    </div>
                    <CardTitle className="text-2xl font-serif font-semibold text-foreground">
                        {isMirror ? "Invite Your Inner Circle" : "Nominate Your Raters"}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                        {isMirror 
                            ? "Add between 1 and 20 people. We generate a unique, anonymous link for each so they can share gentle, honest reflections."
                            : "Add between 1 and 20 people. We generate a unique, anonymous link for each so they can speak freely."}
                        {selectedGoal && (
                            <span className="mt-1 block text-primary text-xs font-semibold">
                                Goal: {GOAL_OPTIONS.find(g => g.id === selectedGoal)?.label}
                            </span>
                        )}
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        {raters.map((rater, index) => (
                            <div key={index} className="p-4 rounded-lg bg-secondary/30 border border-border space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="bg-primary text-primary-foreground text-sm font-bold w-6 h-6 flex items-center justify-center rounded-full">
                                            {index + 1}
                                        </div>
                                        <h3 className="font-serif font-medium text-foreground">
                                            {isMirror ? `Partner ${index + 1}` : `Rater ${index + 1}`}
                                        </h3>
                                    </div>
                                    {raters.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeRater(index)}
                                            className="text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>

                                <div>
                                    <Label className="text-muted-foreground text-xs uppercase tracking-wider mb-1 block">Role / Archetype</Label>
                                    <select
                                        value={rater.archetype}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            const group = val.toLowerCase().replace(/\s*\/\s*/g, "_").replace(/\s+/g, "_");
                                            setRaters(prev => {
                                                const updated = [...prev];
                                                updated[index] = { ...updated[index], archetype: val, archetype_group: group };
                                                return updated;
                                            });
                                        }}
                                        className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                    >
                                        {ARCHETYPE_GROUP_OPTIONS.map(opt => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                        <Label htmlFor={`name-${index}`} className="text-muted-foreground text-xs uppercase tracking-wider mb-1 block">Name</Label>
                                        <Input
                                            id={`name-${index}`}
                                            required
                                            placeholder="Jane Doe"
                                            value={rater.name}
                                            onChange={(e) => updateRater(index, "name", e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor={`email-${index}`} className="text-muted-foreground text-xs uppercase tracking-wider mb-1 block">Email</Label>
                                        <Input
                                            id={`email-${index}`}
                                            type="email"
                                            required
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
                                className="w-full py-3 rounded-lg border-2 border-dashed border-border text-muted-foreground hover:border-primary hover:text-foreground transition-colors flex items-center justify-center gap-2 text-sm cursor-pointer"
                            >
                                <Plus className="w-4 h-4" /> {isMirror ? "Add Another Partner" : "Add Another Rater"}
                            </button>
                        )}

                        {error && <p className="text-destructive text-sm">{error}</p>}
                    </CardContent>
                    <CardFooter>
                        <Button
                            type="submit"
                            className="w-full font-bold rounded-full"
                            disabled={loading || raters.filter(r => r.email && r.email.includes('@')).length < 3}
                        >
                            {loading
                                ? (isMirror ? "Generating Reflection Links..." : "Generating Anonymous Links...")
                                : raters.filter(r => r.email && r.email.includes('@')).length < 3
                                    ? "Minimum 3 valid emails required"
                                    : isMirror
                                        ? `Launch Mirror with ${raters.filter(r => r.name && r.email).length} Partners`
                                        : `Launch Audit with ${raters.filter(r => r.name && r.email).length} Raters`
                            }
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}

