import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

const GOAL_LABELS: Record<string, string> = {
    career_progression: 'Career Progression',
    leadership_mastery: 'Leadership Mastery',
    personal_growth: 'Personal Growth',
    social_intelligence: 'Social Intelligence',
};

const PERCEPTION_DIMENSIONS = [
    'communication', 'leadership', 'integrity',
    'emotional_intelligence', 'reliability', 'innovation',
] as const;

function meetsThreshold(submitted: number, total: number): boolean {
    // Must have AT LEAST 3 responses, AND at least 25% of total
    return submitted >= 3 && submitted / total >= 0.25;
}

async function synthesiseReport(
    submittedEntries: any[],
    goalType: string | null,
    selfResponses: Record<string, number>
): Promise<{ markdown: string; perceptionGap: Record<string, { self: number | null; raters: number | null }> }> {

    // Group by archetype_group (fallback to archetype)
    const groups: Record<string, string[]> = {};
    for (const entry of submittedEntries) {
        const group = entry.archetype_group ?? entry.archetype;
        if (!groups[group]) groups[group] = [];
        if (entry.sanitized_text) groups[group].push(entry.sanitized_text);
    }

    // Aggregate multi-rater groups
    const aggregatedSections: string[] = [];
    for (const [group, texts] of Object.entries(groups)) {
        if (texts.length === 1) {
            aggregatedSections.push(`[${group}]\n${texts[0]}`);
        } else {
            const consensusPrompt = `Synthesise these ${texts.length} perspectives from the "${group}" group into one definitive Consensus View. Preserve critical insights, note divergence. Output only the synthesis:\n\n${texts.map((t, i) => `Rater ${i + 1}: "${t}"`).join('\n\n')}`;
            const r = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: consensusPrompt });
            aggregatedSections.push(`[${group} — Consensus of ${texts.length} raters]\n${r.text?.trim() ?? texts.join(' ')}`);
        }
    }

    const rawFeedbackBlob = aggregatedSections.join('\n\n---\n\n');
    const goalLabel = goalType ? GOAL_LABELS[goalType] ?? goalType : null;

    const prompt = `You are an elite executive coach delivering a definitive Reputation Audit.
${goalLabel ? `The subject's strategic goal is: "${goalLabel}". Ensure actionable steps align with this goal.` : ''}

AGGREGATED 360° FEEDBACK (${submittedEntries.length} rater${submittedEntries.length > 1 ? 's' : ''}):
${rawFeedbackBlob}

Deliver:
1. **The Hard Truth** — the dominant, unvarnished perception theme across all voices.
2. **Your Biggest Blindspot** — the gap between their self-perception and external reality.
3. **3 Radical Steps to Evolve Your Reputation** — specific, actionable, goal-aligned if goal is set.

Format in clean, bold, engaging Markdown. No generic intro — just the analysis.`;

    const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
    const markdown = response.text?.trim() ?? '';

    // Build perception gap data
    const perceptionGap: Record<string, { self: number | null; raters: number | null }> = {};
    for (const dim of PERCEPTION_DIMENSIONS) {
        const selfScore = selfResponses[dim] ?? null;
        const raterVals = submittedEntries
            .filter(e => e.dimension_scores?.[dim] !== undefined)
            .map(e => e.dimension_scores[dim]);
        const raterAvg = raterVals.length > 0
            ? Math.round((raterVals.reduce((a: number, b: number) => a + b, 0) / raterVals.length) * 10) / 10
            : null;
        perceptionGap[dim] = { self: selfScore, raters: raterAvg };
    }

    return { markdown, perceptionGap };
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id: auditId } = await params;

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const serviceClient = createServiceClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // Fetch audit with ownership check
        const { data: audit, error: auditErr } = await supabase
            .from('audits')
            .select('*, feedback_entries(*)')
            .eq('id', auditId)
            .eq('user_id', user.id)
            .single();

        if (auditErr || !audit) {
            return NextResponse.json({ error: 'Audit not found or access denied' }, { status: 404 });
        }

        const allEntries: any[] = audit.feedback_entries ?? [];
        const submittedEntries = allEntries.filter(e => e.status === 'submitted');
        const totalRaters = allEntries.length;
        const submittedCount = submittedEntries.length;

        // --- Threshold Check ---
        if (!meetsThreshold(submittedCount, totalRaters)) {
            return NextResponse.json({
                status: 'insufficient_feedback',
                submittedCount,
                totalRaters,
                message: `We need at least 3 responses (and 25% of your raters). You have ${submittedCount} of ${totalRaters} so far.`,
            });
        }

        // --- Fetch latest saved report ---
        const { data: latestReport } = await serviceClient
            .from('audit_reports')
            .select('*')
            .eq('audit_id', auditId)
            .order('generated_at', { ascending: false })
            .limit(1)
            .single();

        // --- Staleness Check: any new submissions since last report? ---
        const needsRegeneration = !latestReport || submittedEntries.some(
            e => e.submitted_at && latestReport && new Date(e.submitted_at) > new Date(latestReport.generated_at)
        );

        let reportMarkdown: string;
        let perceptionGap: Record<string, any>;
        let generatedAt: string;

        if (needsRegeneration) {
            console.log(`[generate-report] Regenerating for audit ${auditId} — ${submittedCount} responses, stale: ${!!latestReport}`);

            const selfResponses: Record<string, number> = audit.self_audit_responses ?? {};
            const result = await synthesiseReport(submittedEntries, audit.goal_type, selfResponses);

            // Insert new version into audit_reports
            const { data: newReport, error: insertErr } = await serviceClient
                .from('audit_reports')
                .insert({
                    audit_id: auditId,
                    report_markdown: result.markdown,
                    perception_gap: result.perceptionGap,
                    goal_type: audit.goal_type,
                    feedback_count: submittedCount,
                })
                .select()
                .single();

            if (insertErr) throw insertErr;

            reportMarkdown = result.markdown;
            perceptionGap = result.perceptionGap;
            generatedAt = newReport.generated_at;
        } else {
            console.log(`[generate-report] Serving cached report for audit ${auditId}`);
            reportMarkdown = latestReport.report_markdown;
            perceptionGap = latestReport.perception_gap ?? {};
            generatedAt = latestReport.generated_at;
        }

        const isUnlocked = audit.payment_status === 'paid' || audit.status === 'completed';
        const selfResponses: Record<string, number> = audit.self_audit_responses ?? {};

        return NextResponse.json({
            report: reportMarkdown,
            perceptionGap,
            hasPerceptionData: Object.keys(selfResponses).length > 0,
            goalType: audit.goal_type,
            goalLabel: audit.goal_type ? GOAL_LABELS[audit.goal_type] : null,
            isUnlocked,
            submittedCount,
            totalRaters,
            generatedAt,
            status: 'ready',
        });

    } catch (err: any) {
        console.error('Generate Report Error:', err);
        return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
    }
}
