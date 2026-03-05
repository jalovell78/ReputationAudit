"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from 'react-markdown';

export default function ReportPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const auditId = params.id as string;
    const isSuccess = searchParams.get('success') === 'true';

    const [loading, setLoading] = useState(true);
    const [reportData, setReportData] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchReport() {
            try {
                const res = await fetch(`/api/generate-report/${auditId}`);
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || "Failed to load report");
                }

                setReportData(data.report);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        if (auditId) {
            fetchReport();
        }
    }, [auditId]);

    return (
        <div className="min-h-screen bg-zinc-950 p-4 py-8 md:p-12 selection:bg-zinc-800 text-white flex flex-col items-center">
            <div className="w-full max-w-4xl mb-8 flex items-center justify-between">
                <Link href="/dashboard" className="text-zinc-500 hover:text-white flex items-center gap-2 text-sm transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                </Link>
                {isSuccess && <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full">Payment Successful</span>}
            </div>

            {loading && !error && (
                <div className="flex flex-col items-center justify-center py-32 space-y-6">
                    <div className="relative">
                        <Loader2 className="w-12 h-12 text-zinc-500 animate-spin" />
                        <Sparkles className="w-5 h-5 text-emerald-400 absolute -top-2 -right-2 animate-pulse" />
                    </div>
                    <p className="text-zinc-400 animate-pulse text-lg">Synthesizing 5-dimensional feedback into your Reputation Audit...</p>
                </div>
            )}

            {error && (
                <Card className="w-full max-w-lg bg-red-950/20 border-red-900/50 mt-12 mx-auto">
                    <CardContent className="pt-6 flex flex-col items-center text-center space-y-4">
                        <AlertCircle className="w-12 h-12 text-red-500" />
                        <p className="text-red-200">{error}</p>
                        <Button onClick={() => router.push('/dashboard')} variant="outline" className="border-red-900/50 hover:bg-red-900/30">
                            Return to Dashboard
                        </Button>
                    </CardContent>
                </Card>
            )}

            {reportData && !loading && (
                <div className="w-full max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="mb-12 text-center space-y-4">
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter bg-gradient-to-br from-white to-zinc-500 bg-clip-text text-transparent">
                            The Radical Truth.
                        </h1>
                        <p className="text-zinc-400 text-lg">Your AI-synthesized 360-degree Reputation Audit.</p>
                    </div>

                    <Card className="bg-zinc-900 border-zinc-800 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3" />
                        <CardContent className="p-8 md:p-12 relative z-10">
                            <ReactMarkdown
                                components={{
                                    h1: ({ node, ...props }) => <h1 className="text-3xl font-black text-white mt-8 mb-4 tracking-tight" {...props} />,
                                    h2: ({ node, ...props }) => <h2 className="text-2xl font-bold text-white mt-8 mb-4 tracking-tight" {...props} />,
                                    h3: ({ node, ...props }) => <h3 className="text-xl font-bold text-zinc-100 mt-6 mb-3 tracking-tight" {...props} />,
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
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
