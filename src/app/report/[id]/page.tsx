"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, Loader2, AlertCircle, Target, Clock, Lock, Users } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from 'react-markdown';
import { PerceptionGapChart } from "./PerceptionGapChart";

const GOAL_LABELS: Record<string, string> = {
    career_progression: "Career Progression",
    leadership_mastery: "Leadership Mastery",
    personal_growth: "Personal Growth",
    social_intelligence: "Social Intelligence",
};

function TeaserReport({ reportMarkdown }: { reportMarkdown: string }) {
    // Extract first ~150 words for the teaser
    const words = reportMarkdown.split(/\s+/);
    const teaser = words.slice(0, 150).join(' ');

    return (
        <div className="relative">
            {/* Teaser content */}
            <div className="prose-invert max-w-none">
                <ReactMarkdown
                    components={{
                        h1: ({ node, ...props }) => <h1 className="text-3xl font-black text-white mt-8 mb-4 tracking-tight" {...props} />,
                        h2: ({ node, ...props }) => <h2 className="text-2xl font-bold text-white mt-8 mb-4 tracking-tight" {...props} />,
                        h3: ({ node, ...props }) => <h3 className="text-xl font-bold text-zinc-100 mt-6 mb-3" {...props} />,
                        p: ({ node, ...props }) => <p className="text-zinc-300 leading-relaxed mb-6 text-lg" {...props} />,
                        strong: ({ node, ...props }) => <strong className="font-bold text-emerald-400" {...props} />,
                    }}
                >
                    {teaser}
                </ReactMarkdown>
            </div>

            {/* Blur fade-out overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-zinc-900 to-transparent" />
        </div>
    );
}

export default function ReportPage() {
    const params = useParams();
    const router = useRouter();
    const auditId = params.id as string;

    const [loading, setLoading] = useState(true);
    const [reportData, setReportData] = useState<string | null>(null);
    const [perceptionGap, setPerceptionGap] = useState<Record<string, { self: number | null; raters: number | null }> | null>(null);
    const [hasPerceptionData, setHasPerceptionData] = useState(false);
    const [goalLabel, setGoalLabel] = useState<string | null>(null);
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [generatedAt, setGeneratedAt] = useState<string | null>(null);
    const [submittedCount, setSubmittedCount] = useState(0);
    const [totalRaters, setTotalRaters] = useState(0);
    const [status, setStatus] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchReport() {
            try {
                const res = await fetch(`/api/generate-report/${auditId}`);
                const data = await res.json();

                if (!res.ok) throw new Error(data.error || "Failed to load report");

                setStatus(data.status);
                setSubmittedCount(data.submittedCount ?? 0);
                setTotalRaters(data.totalRaters ?? 0);

                if (data.status === 'ready') {
                    setReportData(data.report);
                    setPerceptionGap(data.perceptionGap ?? null);
                    setHasPerceptionData(data.hasPerceptionData ?? false);
                    setGoalLabel(data.goalLabel ?? null);
                    setIsUnlocked(data.isUnlocked ?? false);
                    setGeneratedAt(data.generatedAt ?? null);
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        if (auditId) fetchReport();
    }, [auditId]);

    const formattedDate = generatedAt
        ? new Date(generatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
        : null;

    return (
        <div className="min-h-screen bg-zinc-950 p-4 py-8 md:p-12 selection:bg-zinc-800 text-white flex flex-col items-center">
            <div className="w-full max-w-4xl mb-8 flex items-center justify-between flex-wrap gap-2">
                <Link href="/dashboard" className="text-zinc-500 hover:text-white flex items-center gap-2 text-sm transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                </Link>
                <div className="flex items-center gap-2 flex-wrap">
                    {goalLabel && (
                        <span className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-full flex items-center gap-1">
                            <Target className="w-3 h-3" /> {goalLabel}
                        </span>
                    )}
                    {formattedDate && (
                        <span className="text-xs bg-zinc-800 text-zinc-400 border border-zinc-700 px-3 py-1 rounded-full flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Updated {formattedDate}
                        </span>
                    )}
                </div>
            </div>

            {/* Loading state */}
            {loading && (
                <div className="flex flex-col items-center justify-center py-32 space-y-6">
                    <div className="relative">
                        <Loader2 className="w-12 h-12 text-zinc-500 animate-spin" />
                        <Sparkles className="w-5 h-5 text-emerald-400 absolute -top-2 -right-2 animate-pulse" />
                    </div>
                    <p className="text-zinc-400 animate-pulse text-lg">Synthesising your Reputation Audit...</p>
                </div>
            )}

            {/* Error state */}
            {error && !loading && (
                <Card className="w-full max-w-lg bg-red-950/20 border-red-900/50 mt-12 mx-auto">
                    <CardContent className="pt-6 flex flex-col items-center text-center space-y-4">
                        <AlertCircle className="w-12 h-12 text-red-500" />
                        <p className="text-red-200">{error}</p>
                        <Button onClick={() => router.push('/dashboard')} variant="outline" className="border-red-900/50">
                            Return to Dashboard
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Insufficient feedback state */}
            {!loading && !error && status === 'insufficient_feedback' && (
                <Card className="w-full max-w-lg bg-zinc-900 border-zinc-800 mt-12 mx-auto text-center">
                    <CardContent className="pt-8 pb-8 space-y-4">
                        <Users className="w-12 h-12 text-zinc-500 mx-auto" />
                        <h2 className="text-xl font-bold text-white">Not enough responses yet</h2>
                        <p className="text-zinc-400">
                            Your report generates once at least <strong className="text-white">3 raters</strong> have responded.
                        </p>
                        <div className="bg-zinc-800 rounded-full h-2 w-full max-w-xs mx-auto overflow-hidden">
                            <div
                                className="bg-emerald-500 h-full rounded-full transition-all"
                                style={{ width: `${Math.min((submittedCount / Math.max(totalRaters, 3)) * 100, 100)}%` }}
                            />
                        </div>
                        <p className="text-zinc-500 text-sm">{submittedCount} of {totalRaters} raters responded</p>
                        <Link href="/dashboard">
                            <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                                Back to Dashboard
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            )}

            {/* Report — ready */}
            {!loading && !error && status === 'ready' && reportData && (
                <div className="w-full max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="mb-10 text-center space-y-3">
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter bg-gradient-to-br from-white to-zinc-500 bg-clip-text text-transparent">
                            The Radical Truth.
                        </h1>
                        <p className="text-zinc-400 text-lg">
                            Your AI-synthesised 360° Reputation Audit — based on {submittedCount} of {totalRaters} raters.
                        </p>
                    </div>

                    {/* Perception Gap Chart — only if self-audit completed */}
                    {isUnlocked && perceptionGap && hasPerceptionData && (
                        <PerceptionGapChart perceptionGap={perceptionGap} />
                    )}

                    {/* Self-audit nudge (unpaid users don't see chart yet, but can do self-audit) */}
                    {!hasPerceptionData && (
                        <div className="mb-8 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-sm flex items-center justify-between gap-4">
                            <div>
                                <strong className="text-indigo-200">Unlock your Perception Gap chart!</strong>
                                <p className="text-indigo-400 mt-0.5">Complete the Self-Audit to compare your self-scores to your raters'.</p>
                            </div>
                            <Link href={`/dashboard/self-audit/${auditId}`} className="shrink-0 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
                                Start
                            </Link>
                        </div>
                    )}

                    <Card className="bg-zinc-900 border-zinc-800 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3" />
                        <CardContent className="p-8 md:p-12 relative z-10">
                            {isUnlocked ? (
                                // Full report for paid users
                                <ReactMarkdown
                                    components={{
                                        h1: ({ node, ...props }) => <h1 className="text-3xl font-black text-white mt-8 mb-4 tracking-tight" {...props} />,
                                        h2: ({ node, ...props }) => <h2 className="text-2xl font-bold text-white mt-8 mb-4 tracking-tight" {...props} />,
                                        h3: ({ node, ...props }) => <h3 className="text-2xl font-bold text-white mt-16 mb-6 pt-10 border-t border-zinc-800" {...props} />,
                                        h4: ({ node, ...props }) => <h4 className="text-lg font-bold text-emerald-400 mt-4 mb-2 tracking-wide uppercase" {...props} />,
                                        p: ({ node, ...props }) => <p className="text-zinc-300 leading-relaxed mb-6 text-lg" {...props} />,
                                        ul: ({ node, ...props }) => <ul className="list-disc list-outside ml-6 space-y-3 mb-6 text-zinc-300" {...props} />,
                                        ol: ({ node, ...props }) => <ol className="list-decimal list-outside ml-6 space-y-3 mb-6 text-zinc-300" {...props} />,
                                        li: ({ node, ...props }) => <li className="text-zinc-300 leading-relaxed text-lg" {...props} />,
                                        strong: ({ node, ...props }) => <strong className="font-bold text-emerald-400" {...props} />,
                                        em: ({ node, ...props }) => <em className="italic text-zinc-400" {...props} />,
                                        blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-emerald-500 pl-6 py-2 italic text-zinc-400 bg-black/20 rounded-r-lg my-8 text-lg" {...props} />,
                                    }}
                                >
                                    {reportData}
                                </ReactMarkdown>
                            ) : (
                                // Teaser + paywall for unpaid users
                                <>
                                    <TeaserReport reportMarkdown={reportData} />
                                    <div className="mt-8 pt-8 border-t border-zinc-800 flex flex-col items-center text-center gap-5">
                                        <div className="bg-zinc-800/60 rounded-full p-4">
                                            <Lock className="w-8 h-8 text-zinc-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white mb-2">Your full report is ready</h3>
                                            <p className="text-zinc-400 max-w-sm">
                                                Unlock the complete analysis — your biggest blindspot, radical action steps, and Perception Gap chart — with a one-time payment.
                                            </p>
                                        </div>
                                        <Link
                                            href={`/api/checkout?auditId=${auditId}`}
                                            className="flex items-center gap-2 bg-white text-black font-bold px-8 py-4 rounded-full hover:bg-zinc-100 transition-colors text-base"
                                        >
                                            <Sparkles className="w-4 h-4" /> Unlock Full Report
                                        </Link>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
