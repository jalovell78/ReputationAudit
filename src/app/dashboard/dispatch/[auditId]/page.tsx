import { createClient } from "@/lib/supabase/server";
import { DispatchHubList } from "./DispatchHubList";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";

export default async function DispatchHubPage({ params }: { params: { auditId: string } }) {
    const { auditId } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: entries } = await supabase
        .from("feedback_entries")
        .select("*")
        .eq("audit_id", auditId)
        .order("created_at", { ascending: true });

    const { data: audit } = await supabase
        .from("audits")
        .select(`
            goal_type,
            profiles (
                full_name
            )
        `)
        .eq("id", auditId)
        .single();

    if (!entries || entries.length === 0) {
        return <div className="p-12 text-white">Audit not found or access denied.</div>;
    }

    return (
        <div className="min-h-screen bg-zinc-950 p-4 py-12 md:p-12 selection:bg-zinc-800">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                    <Link href="/dashboard" className="text-zinc-500 hover:text-white flex items-center gap-2 mb-6 text-sm transition-colors">
                        <ArrowLeftIcon className="w-4 h-4" /> Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Dispatch Hub</h1>
                    <p className="text-zinc-400 leading-relaxed text-sm">
                        Here are your 5 generated unique links. Click the <strong>Mail</strong> button to open your default email client with a pre-written template, or click the copy icon to send them manually via SMS/WhatsApp.
                    </p>
                </div>

                <DispatchHubList
                    entries={entries}
                    goalType={audit?.goal_type}
                    userName={((audit?.profiles as any)?.full_name || "")?.split(' ')[0]}
                />
            </div>
        </div>
    );
}
