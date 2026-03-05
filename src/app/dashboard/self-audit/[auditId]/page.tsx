"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";

const DIMENSIONS = [
    { key: "communication", label: "Communication", desc: "How clearly and openly do I communicate?" },
    { key: "leadership", label: "Leadership", desc: "How effectively do I inspire and guide others?" },
    { key: "integrity", label: "Integrity", desc: "How consistently do I act with honesty and ethics?" },
    { key: "emotional_intelligence", label: "Emotional Intelligence", desc: "How well do I understand and manage emotions (mine and others')?" },
    { key: "reliability", label: "Reliability", desc: "How dependably do I follow through on commitments?" },
    { key: "innovation", label: "Innovation", desc: "How often do I bring creative, original thinking?" },
];

const LIKERT = [
    { value: 1, label: "Poor" },
    { value: 2, label: "Below Average" },
    { value: 3, label: "Average" },
    { value: 4, label: "Above Average" },
    { value: 5, label: "Excellent" },
];

const GOAL_LABELS: Record<string, string> = {
    career_progression: "Career Progression",
    leadership_mastery: "Leadership Mastery",
    personal_growth: "Personal Growth",
    social_intelligence: "Social Intelligence",
};

export default function SelfAuditPage() {
    const params = useParams();
    const router = useRouter();
    const auditId = params.auditId as string;

    const [goalType, setGoalType] = useState<string | null>(null);
    const [responses, setResponses] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(false);
    const [fetchingAudit, setFetchingAudit] = useState(true);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchAudit() {
            const supabase = createClient();
            const { data } = await supabase
                .from("audits")
                .select("goal_type, self_audit_responses")
                .eq("id", auditId)
                .single();
            if (data) {
                setGoalType(data.goal_type);
                if (data.self_audit_responses) {
                    setResponses(data.self_audit_responses);
                    setSubmitted(true);
                }
            }
            setFetchingAudit(false);
        }
        fetchAudit();
    }, [auditId]);

    const setScore = (dim: string, score: number) => {
        setResponses(prev => ({ ...prev, [dim]: score }));
    };

    const allAnswered = DIMENSIONS.every(d => responses[d.key] !== undefined);

    const handleSubmit = async () => {
        if (!allAnswered) return;
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/self-audit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ auditId, responses }),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to save self-audit");
            }
            setSubmitted(true);
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (fetchingAudit) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-zinc-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-white p-4 py-10 md:p-12 flex flex-col items-center">
            <div className="w-full max-w-2xl mb-6">
                <Link href="/dashboard" className="text-zinc-500 hover:text-white flex items-center gap-2 text-sm transition-colors mb-6">
                    <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                </Link>
                <div className="mb-8 text-center space-y-2">
                    <h1 className="text-3xl md:text-4xl font-black tracking-tighter">Self-Audit</h1>
                    <p className="text-zinc-400">Rate yourself honestly across 6 dimensions. This unlocks your Perception Gap analysis in the final report.</p>
                    {goalType && (
                        <span className="inline-block text-xs font-semibold text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 rounded-full px-3 py-1">
                            Goal: {GOAL_LABELS[goalType] ?? goalType}
                        </span>
                    )}
                </div>
            </div>

            {submitted ? (
                <Card className="w-full max-w-2xl bg-emerald-950/20 border-emerald-900/50">
                    <CardContent className="pt-8 text-center space-y-4">
                        <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
                        <p className="text-emerald-300 font-semibold text-lg">Self-Audit Complete!</p>
                        <p className="text-zinc-400">Your self-scores are saved. Once your raters submit, your Perception Gap chart will be ready in the final report.</p>
                        <Button onClick={() => router.push("/dashboard")} className="bg-white text-black hover:bg-zinc-200">
                            Return to Dashboard
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <Card className="w-full max-w-2xl bg-black/40 border-zinc-800 shadow-2xl">
                    <CardHeader>
                        <CardTitle className="text-xl">Rate yourself on each dimension</CardTitle>
                        <CardDescription className="text-zinc-400">Be brutally honest — your raters are.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        {DIMENSIONS.map(dim => (
                            <div key={dim.key}>
                                <div className="mb-3">
                                    <p className="font-bold text-white">{dim.label}</p>
                                    <p className="text-zinc-400 text-sm">{dim.desc}</p>
                                </div>
                                <div className="flex gap-2 flex-wrap">
                                    {LIKERT.map(option => (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() => setScore(dim.key, option.value)}
                                            className={`flex-1 min-w-[60px] py-2 px-3 rounded-lg border text-sm font-medium transition-all ${responses[dim.key] === option.value
                                                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                                                    : "border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-500"
                                                }`}
                                        >
                                            <div className="font-bold text-lg leading-none mb-0.5">{option.value}</div>
                                            <div className="text-xs leading-tight">{option.label}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {error && <p className="text-red-400 text-sm">{error}</p>}
                    </CardContent>
                    <CardFooter>
                        <Button
                            onClick={handleSubmit}
                            disabled={loading || !allAnswered}
                            className="w-full bg-white text-black hover:bg-zinc-200 gap-2 disabled:opacity-40"
                        >
                            {loading ? (
                                <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                            ) : (
                                <><CheckCircle className="w-4 h-4" /> Submit Self-Assessment</>
                            )}
                        </Button>
                    </CardFooter>
                </Card>
            )}
        </div>
    );
}
