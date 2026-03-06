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
    selfResponses: Record<string, number>,
    selfPredictionText?: string | null
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
    const smallGroupTexts: string[] = [];

    for (const [group, texts] of Object.entries(groups)) {
        if (texts.length <= 2) {
            smallGroupTexts.push(...texts);
        } else {
            const consensusPrompt = `Synthesise these ${texts.length} perspectives from the "${group}" group into one definitive Consensus View. Preserve critical insights, note divergence. Output only the synthesis:\n\n${texts.map((t, i) => `Rater ${i + 1}: "${t}"`).join('\n\n')}`;
            const r = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: consensusPrompt });
            aggregatedSections.push(`[${group} — Consensus of ${texts.length} raters]\n${r.text?.trim() ?? texts.join(' ')}`);
        }
    }

    if (smallGroupTexts.length > 0) {
        aggregatedSections.push(`[Anonymous Uncategorized Perspectives]\n${smallGroupTexts.map((t, i) => `Rater ${i + 1}: "${t}"`).join('\n\n')}`);
    }

    const rawFeedbackBlob = aggregatedSections.join('\n\n---\n\n');
    const goalLabel = goalType ? GOAL_LABELS[goalType] ?? goalType : null;

    const prompt = `You are a world-class, radically honest executive coach delivering a "Reputation Audit." Your tone is direct, insightful, and uncompromisingly objective. Do NOT use corporate jargon, HR-speak, or sugar-coating.

${goalLabel ? `**Strategic Context:** The subject's ultimate goal is "${goalLabel}". Frame your entire analysis around how their current reputation is either accelerating or sabotaging this goal.` : ''}

**Baseline (The Subject's Hypothesis):**
${selfPredictionText ? `"${selfPredictionText}"` : `*No hypothesis provided.*`}

**The Reality (Aggregated 360° Feedback from ${submittedEntries.length} voices across various relationships):**
${rawFeedbackBlob}

Synthesize this data and deliver the audit using EXACTLY this Markdown structure. 

### CRITICAL ANONYMITY RULES - YOU MUST OBEY THESE:
1. NEVER attribute a specific quote, sentiment, or theme to a specific relationship group (e.g., do NOT say "Your family says...", or "A colleague noted...").
2. NEVER use direct quotes from the feedback. You must paraphrase and synthesize the underlying behavioral themes.
3. Combine feedback across all domains (personal, professional, family) into unified behavioral patterns. E.g., Instead of "At work you are X, but at home you are Y", say "You exhibit a pattern of X, which fractures into Y under pressure."

NO intro and NO outro conversation. Just the output matching the markdown structure below:

### 1. The Hard Truth
Write exactly two short, punchy sentences. Sentence 1: How they are fundamentally perceived. Sentence 2: The harsh reality or underlying tension that undercuts that perception.

### 2. The Perception Gap
${selfPredictionText
            ? `Compare their hypothesis against reality. You must use EXACTLY these Markdown Header 4 elements:

#### Phantom Insecurities
(1-2 bullet points on negative things they worried about that the data proves are historically false or unnoticed).

#### Blindspots
(1-2 bullet points on critical issues or habits they have that they completely failed to predict).`
            : `Summarize the most significant gaps and blindspots in their reputation using bullet points.`}

### 3. Three Radical Steps Forward
Provide 3 highly specific, unconventional, and actionable steps to evolve their reputation ${goalLabel ? `to help them achieve "${goalLabel}"` : ''}. 
For EACH step, you MUST use this exact formatting structure:
**[Actionable Step Name]**
* **The Insight:** [One very brief sentence explaining why this step matters].
* **The Action:** [1-2 short bullet points on EXACTLY what to do, avoiding generic advice].

### 4. Your Unfair Advantage
End with a fiercely encouraging, empowering summary (max 3 sentences). Do NOT invent praise or use generic platitudes. Look at the data: what is the one undeniable strength, character trait, or hidden potential consistently recognized by their raters? Frame this specific strength as the exact weapon they will use to execute the 3 Radical Steps, overcome their blindspots, and evolve. Leave them feeling understood, capable, and ready to act.`;

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
            const result = await synthesiseReport(submittedEntries, audit.goal_type, selfResponses, audit.self_prediction_text);

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
