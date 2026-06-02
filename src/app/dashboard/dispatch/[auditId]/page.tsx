import { createClient } from "@/lib/supabase/server";
import { DispatchHubList } from "./DispatchHubList";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { getTenantFromHeaders } from "@/lib/tenant-server";

export default async function DispatchHubPage({ params }: { params: { auditId: string } }) {
    const { auditId } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const tenant = await getTenantFromHeaders();
    const isMirror = tenant === 'perception_mirror';

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
        return <div className="p-12 text-foreground bg-background">Audit/Reflection not found or access denied.</div>;
    }

    return (
        <div className="min-h-screen bg-background text-foreground p-4 py-12 md:p-12 transition-colors duration-300">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                    <Link href="/dashboard" className="text-muted-foreground hover:text-foreground flex items-center gap-2 mb-6 text-sm transition-colors">
                        <ArrowLeftIcon className="w-4 h-4" /> Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
                        {isMirror ? "Reflection Mirror Links" : "Dispatch Hub"}
                    </h1>
                    <p className="text-muted-foreground leading-relaxed text-sm">
                        {isMirror 
                            ? "Here are the unique invitation links for your reflection partners. Click the Mail button to open your default email client with a pre-written invite, or copy the link to send it via SMS, WhatsApp, or email."
                            : "Here are the generated unique links for your raters. Click the Mail button to open your default email client with a pre-written template, or click the copy icon to send them manually via SMS/WhatsApp."}
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

