import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { CheckoutButton } from "./CheckoutButton";
import { LogoutButton } from "./LogoutButton";
import { PredictionModule } from "./PredictionModule";
import { GenerateReportButton } from "./GenerateReportButton";

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return null; // Handled by middleware
    }

    // Fetch user's audits
    const { data: audits } = await supabase
        .from("audits")
        .select("*, feedback_entries(*), audit_reports(id)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    return (
        <div className="min-h-screen bg-zinc-950 text-white p-4 py-12 md:p-12 selection:bg-zinc-800">
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-4">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight mb-2">My Reputation Audits</h1>
                    <p className="text-zinc-400">Manage your active and completed 360-degree reviews.</p>
                </div>
                <div className="flex items-center gap-3">
                    <LogoutButton />
                    <Link href="/dashboard/setup">
                        <Button className="bg-white text-black hover:bg-zinc-200">Start New Audit</Button>
                    </Link>
                </div>
            </div>

            <div className="max-w-4xl mx-auto space-y-6">
                {(!audits || audits.length === 0) ? (
                    <div className="text-center py-20 border border-dashed border-zinc-800 rounded-lg bg-black/20">
                        <h3 className="text-xl font-medium mb-2 text-zinc-300">No audits found</h3>
                        <p className="text-zinc-500 mb-6">You haven't requested any feedback yet.</p>
                        <Link href="/dashboard/setup">
                            <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-900">
                                Setup your first Audit
                            </Button>
                        </Link>
                    </div>
                ) : (
                    audits.map((audit) => {
                        const total = audit.feedback_entries.length;
                        const completed = audit.feedback_entries.filter((e: any) => e.status === 'submitted').length;
                        const isUnlocked = audit.payment_status === 'paid' || audit.status === 'completed';
                        const progressPercent = total > 0 ? (completed / total) * 100 : 0;
                        const hasReport = audit.audit_reports && audit.audit_reports.length > 0;
                        const isLocked = hasReport;

                        return (
                            <Card key={audit.id} className="bg-zinc-900 border-zinc-800 text-white shadow-xl relative overflow-hidden">
                                {isUnlocked && (
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-500/20 to-transparent pointer-events-none rounded-tr-lg" />
                                )}
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="text-xl flex items-center gap-2">
                                                Audit Request
                                                {audit.goal_type && (
                                                    <Badge variant="outline" className="border-indigo-500/30 text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20">
                                                        {audit.goal_type.split('_').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                                    </Badge>
                                                )}
                                                {isUnlocked && <Badge className="bg-emerald-500 text-black hover:bg-emerald-400">UNLOCKED</Badge>}
                                            </CardTitle>
                                            <CardDescription className="text-zinc-400 mt-1">
                                                Created on {new Date(audit.created_at).toLocaleDateString()}
                                            </CardDescription>
                                        </div>
                                        <Badge variant={completed === total ? "default" : "outline"} className={completed === total ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20" : "border-zinc-700 text-zinc-400"}>
                                            {completed} / {total} Received
                                        </Badge>
                                    </div>
                                    {!isUnlocked && (
                                        <div className="mt-4 space-y-2">
                                            <div className="flex justify-between text-xs font-medium">
                                                <span className="text-zinc-400">Feedback Progress</span>
                                                <span className="text-zinc-300">{Math.round(progressPercent)}%</span>
                                            </div>
                                            <div className="w-full bg-zinc-800 rounded-full h-2">
                                                <div
                                                    className="bg-zinc-100 h-2 rounded-full transition-all duration-500 ease-out"
                                                    style={{ width: `${progressPercent}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                    <PredictionModule auditId={audit.id} initialText={audit.self_prediction_text} isLocked={isLocked} />
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {audit.feedback_entries.map((entry: any) => (
                                            <div key={entry.id} className="p-3 rounded-md bg-black/40 border border-zinc-800/50 flex flex-col gap-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-medium text-zinc-200">{entry.archetype}</span>
                                                    {entry.status === 'submitted' ? (
                                                        <Badge variant="outline" className="text-xs bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Received</Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="text-xs border-zinc-700 text-zinc-500">Pending</Badge>
                                                    )}
                                                </div>
                                                <p className="text-xs text-zinc-500">{entry.rater_name} ({entry.rater_email})</p>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                                <CardFooter className="pt-2 flex flex-col gap-3">
                                    {isUnlocked ? (
                                        hasReport ? (
                                            <Link href={`/report/${audit.id}`} className="w-full">
                                                <Button className="w-full bg-zinc-800 text-white hover:bg-zinc-700 font-bold border-none transition-colors">
                                                    View Final Report
                                                </Button>
                                            </Link>
                                        ) : (
                                            <GenerateReportButton auditId={audit.id} />
                                        )
                                    ) : completed === total ? (
                                        <CheckoutButton auditId={audit.id} />
                                    ) : (
                                        <Link href={`/dashboard/dispatch/${audit.id}`} className="w-full">
                                            <Button className="w-full bg-white text-black hover:bg-zinc-200">
                                                View Dispatch Hub & Links
                                            </Button>
                                        </Link>
                                    )}
                                </CardFooter>
                            </Card>
                        )
                    })
                )}
            </div>
        </div>
    );
}
