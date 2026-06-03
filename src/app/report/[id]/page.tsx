import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getTenantFromHeaders } from "@/lib/tenant-server";
import ReportClientView from "./ReportClientView";

const GOAL_LABELS: Record<string, string> = {
    career_progression: "Career Progression",
    leadership_mastery: "Leadership Mastery",
    personal_growth: "Personal Growth",
    social_intelligence: "Social Intelligence",
};

function meetsThreshold(submitted: number, total: number): boolean {
    // Must have AT LEAST 3 responses, AND at least 25% of total
    return submitted >= 3 && (total > 0 ? (submitted / total >= 0.25) : false);
}

export default async function ReportPage({ params }: { params: { id: string } }) {
    const { id: auditId } = await params;
    const tenant = await getTenantFromHeaders();

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch audit with ownership check
    const { data: audit, error: auditErr } = await supabase
        .from('audits')
        .select('*, feedback_entries(*)')
        .eq('id', auditId)
        .eq('user_id', user.id)
        .single();

    if (auditErr || !audit) {
        return <ReportClientView auditId={auditId} tenant={tenant} error="Report not found or access denied" />;
    }

    const allEntries: any[] = audit.feedback_entries ?? [];
    const submittedEntries = allEntries.filter(e => e.status === 'submitted');
    const totalRaters = allEntries.length;
    const submittedCount = submittedEntries.length;

    // Threshold Check
    if (!meetsThreshold(submittedCount, totalRaters)) {
        return (
            <ReportClientView 
                auditId={auditId} 
                tenant={tenant} 
                initialData={{
                    status: 'insufficient_feedback',
                    submittedCount,
                    totalRaters,
                }} 
            />
        );
    }

    // Fetch latest report
    const { data: latestReport } = await supabase
        .from('audit_reports')
        .select('*')
        .eq('audit_id', auditId)
        .order('generated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

    const isUnlocked = audit.payment_status === 'paid' || audit.status === 'completed';
    const selfResponses = audit.self_audit_responses ?? {};

    return (
        <ReportClientView 
            auditId={auditId} 
            tenant={tenant} 
            initialData={{
                status: 'ready',
                report: latestReport?.report_markdown || null,
                perceptionGap: latestReport?.perception_gap || null,
                hasPerceptionData: Object.keys(selfResponses).length > 0,
                goalType: audit.goal_type,
                goalLabel: audit.goal_type ? GOAL_LABELS[audit.goal_type] : null,
                isUnlocked,
                submittedCount,
                totalRaters,
                generatedAt: latestReport?.generated_at || null,
            }} 
        />
    );
}
