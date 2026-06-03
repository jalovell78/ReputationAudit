"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, AlertCircle, Target, Clock, Lock, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ReactMarkdown from 'react-markdown';
import { PerceptionGapChart } from "./PerceptionGapChart";

interface ReportClientViewProps {
    auditId: string;
    tenant: string;
    error?: string;
    initialData?: {
        status: string;
        report?: string | null;
        perceptionGap?: Record<string, any> | null;
        hasPerceptionData?: boolean;
        goalType?: string | null;
        goalLabel?: string | null;
        isUnlocked?: boolean;
        submittedCount?: number;
        totalRaters?: number;
        generatedAt?: string | null;
    };
}

function TeaserReport({ reportMarkdown }: { reportMarkdown: string }) {
    // Extract first ~150 words for the teaser
    const words = reportMarkdown.split(/\s+/);
    const teaser = words.slice(0, 150).join(' ');

    return (
        <div className="relative">
            {/* Teaser content */}
            <div className="max-w-none">
                <ReactMarkdown
                    components={{
                        h1: ({ node, ...props }) => <h1 className="text-3xl font-serif font-black text-foreground mt-8 mb-4 tracking-tight" {...props} />,
                        h2: ({ node, ...props }) => <h2 className="text-2xl font-serif font-bold text-foreground mt-8 mb-4 tracking-tight" {...props} />,
                        h3: ({ node, ...props }) => <h3 className="text-xl font-serif font-bold text-foreground mt-6 mb-3" {...props} />,
                        p: ({ node, ...props }) => <p className="text-foreground/90 leading-relaxed mb-6 text-lg" {...props} />,
                        strong: ({ node, ...props }) => <strong className="font-bold text-primary" {...props} />,
                    }}
                >
                    {teaser}
                </ReactMarkdown>
            </div>

            {/* Blur fade-out overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-card to-transparent pointer-events-none" />
        </div>
    );
}

export default function ReportClientView({ auditId, tenant, error, initialData }: ReportClientViewProps) {
    const router = useRouter();
    const isMirror = tenant === 'perception_mirror';

    const formattedDate = initialData?.generatedAt
        ? new Date(initialData.generatedAt).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
        })
        : null;

    // Loading State Fallback (e.g. if we want to show loading during transition)
    if (!error && !initialData) {
        return (
            <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4">
                <div className="flex flex-col items-center justify-center py-32 space-y-6">
                    <div className="relative font-sans">
                        <Users className="w-12 h-12 text-muted-foreground animate-pulse" />
                    </div>
                    <p className="text-muted-foreground animate-pulse text-lg">
                        {isMirror ? "Accessing your Perception Mirror..." : "Accessing your Reputation Audit..."}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-4 py-8 md:p-12 text-foreground flex flex-col items-center font-sans">
            <div className="w-full max-w-4xl mb-8 flex items-center justify-between flex-wrap gap-2">
                <Link href="/dashboard" className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                </Link>
                <div className="flex items-center gap-2 flex-wrap">
                    {initialData?.goalLabel && (
                        <span className="text-xs bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full flex items-center gap-1">
                            <Target className="w-3 h-3" /> {initialData.goalLabel}
                        </span>
                    )}
                    {formattedDate && (
                        <span className="text-xs bg-secondary text-muted-foreground border border-border px-3 py-1 rounded-full flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Updated {formattedDate}
                        </span>
                    )}
                </div>
            </div>

            {/* Error state */}
            {error && (
                <Card className="w-full max-w-lg bg-destructive/10 border-destructive/20 mt-12 mx-auto">
                    <CardContent className="pt-6 flex flex-col items-center text-center space-y-4">
                        <AlertCircle className="w-12 h-12 text-destructive" />
                        <p className="text-foreground">{error}</p>
                        <Button onClick={() => router.push('/dashboard')} variant="outline" className="border-destructive/20 hover:bg-destructive/25 text-foreground">
                            Return to Dashboard
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Insufficient feedback state */}
            {!error && initialData?.status === 'insufficient_feedback' && (
                <Card className="w-full max-w-lg bg-card border-border mt-12 mx-auto text-center">
                    <CardContent className="pt-8 pb-8 space-y-4">
                        <Users className="w-12 h-12 text-muted-foreground mx-auto" />
                        <h2 className="text-xl font-serif font-bold text-foreground">Not enough responses yet</h2>
                        <p className="text-muted-foreground">
                            Your report generates once at least{" "}
                            <strong className="text-foreground">
                                3 {isMirror ? "reflection partners" : "raters"}
                            </strong>{" "}
                            have responded.
                        </p>
                        <div className="bg-secondary rounded-full h-2 w-full max-w-xs mx-auto overflow-hidden">
                            <div
                                className="bg-primary h-full rounded-full transition-all"
                                style={{ 
                                    width: `${Math.min(
                                        ((initialData.submittedCount ?? 0) / Math.max(initialData.totalRaters ?? 3, 3)) * 100, 
                                        100
                                    )}%` 
                                }}
                            />
                        </div>
                        <p className="text-muted-foreground text-sm">
                            {initialData.submittedCount} of {initialData.totalRaters} {isMirror ? "reflection partners" : "raters"} responded
                        </p>
                        <Link href="/dashboard">
                            <Button variant="outline" className="border-border text-foreground hover:bg-secondary">
                                Back to Dashboard
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            )}

            {/* Report — ready */}
            {!error && initialData?.status === 'ready' && initialData.report && (
                <div className="w-full max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="mb-10 text-center space-y-3">
                        <h1 className="text-4xl md:text-5xl font-serif font-black tracking-tighter text-foreground">
                            {isMirror ? "Your Perception Mirror" : "Your Reputation Audit"}
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            Your AI-synthesised insights — based on {initialData.submittedCount} of {initialData.totalRaters} {isMirror ? "reflection partners" : "raters"}.
                        </p>
                    </div>

                    <Card className="bg-card border-border shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3" />
                        <CardContent className="p-8 md:p-12 relative z-10">
                            {initialData.isUnlocked ? (
                                // Full report for paid/completed users
                                <div className="space-y-10">
                                    {initialData.perceptionGap && (
                                        <PerceptionGapChart 
                                            perceptionGap={initialData.perceptionGap} 
                                            isMirror={isMirror}
                                        />
                                    )}
                                    <ReactMarkdown
                                        components={{
                                            h1: ({ node, ...props }) => <h1 className="text-3xl font-serif font-black text-foreground mt-8 mb-4 tracking-tight" {...props} />,
                                            h2: ({ node, ...props }) => <h2 className="text-2xl font-serif font-bold text-foreground mt-8 mb-4 tracking-tight" {...props} />,
                                            h3: ({ node, ...props }) => <h3 className="text-2xl font-serif font-bold text-foreground mt-16 mb-6 pt-10 border-t border-border first:mt-0 first:pt-0 first:border-t-0" {...props} />,
                                            h4: ({ node, ...props }) => <h4 className="text-lg font-bold text-primary mt-4 mb-2 tracking-wide uppercase" {...props} />,
                                            p: ({ node, ...props }) => <p className="text-foreground/90 leading-relaxed mb-6 text-lg" {...props} />,
                                            ul: ({ node, ...props }) => <ul className="list-disc list-outside ml-6 space-y-3 mb-6 text-foreground/90" {...props} />,
                                            ol: ({ node, ...props }) => <ol className="list-decimal list-outside ml-6 space-y-3 mb-6 text-foreground/90" {...props} />,
                                            li: ({ node, ...props }) => <li className="text-foreground/90 leading-relaxed text-lg" {...props} />,
                                            strong: ({ node, ...props }) => <strong className="font-bold text-primary" {...props} />,
                                            em: ({ node, ...props }) => <em className="italic text-muted-foreground" {...props} />,
                                            blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-primary pl-6 py-2 italic text-muted-foreground bg-secondary/30 rounded-r-lg my-8 text-lg" {...props} />,
                                        }}
                                    >
                                        {initialData.report}
                                    </ReactMarkdown>
                                </div>
                            ) : (
                                // Teaser + paywall for unpaid users
                                <>
                                    <TeaserReport reportMarkdown={initialData.report} />
                                    <div className="mt-8 pt-8 border-t border-border flex flex-col items-center text-center gap-5">
                                        <div className="bg-secondary rounded-full p-4">
                                            <Lock className="w-8 h-8 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-serif font-bold text-foreground mb-2">
                                                {isMirror ? "Your full reflection is ready" : "Your full report is ready"}
                                            </h3>
                                            <p className="text-muted-foreground max-w-sm">
                                                {isMirror 
                                                    ? "Unlock the complete analysis — your hidden shadows, growth alignment steps, and Perception Gap chart — with a one-time payment."
                                                    : "Unlock the complete analysis — your biggest blindspot, radical action steps, and Perception Gap chart — with a one-time payment."
                                                }
                                            </p>
                                        </div>
                                        <Link
                                            href={`/api/checkout?auditId=${auditId}`}
                                            className="flex items-center gap-2 bg-primary text-primary-foreground font-bold px-8 py-4 rounded-full hover:bg-primary/90 transition-colors text-base"
                                        >
                                            <Sparkles className="w-4 h-4" /> 
                                            {isMirror ? "Unlock Full Reflection" : "Unlock Full Report"}
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
