import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

// The six perception dimensions used in the Radar Chart + Self-Audit
export const PERCEPTION_DIMENSIONS = [
    'communication',
    'leadership',
    'integrity',
    'emotional_intelligence',
    'reliability',
    'innovation',
] as const;

export type PerceptionDimension = (typeof PERCEPTION_DIMENSIONS)[number];

const GOAL_LABELS: Record<string, string> = {
    career_progression: 'Career Progression',
    leadership_mastery: 'Leadership Mastery',
    personal_growth: 'Personal Growth',
    social_intelligence: 'Social Intelligence',
};

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id: auditId } = await params;

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { data: audit, error } = await supabase
            .from('audits')
            .select('*, feedback_entries(*)')
            .eq('id', auditId)
            .eq('user_id', user.id)
            .single();

        if (error || !audit) {
            console.error('Audit Fetch Failed:', { auditId, userId: user.id, error });
            return NextResponse.json({ error: 'Audit not found or access denied' }, { status: 404 });
        }

        const isUnlocked = audit.payment_status === 'paid' || audit.status === 'completed';
        if (!isUnlocked) {
            return NextResponse.json({ error: 'Report is locked. Please complete checkout.' }, { status: 403 });
        }

        const submittedEntries = audit.feedback_entries.filter((e: any) => e.status === 'submitted');
        const totalEntries = audit.feedback_entries.length;

        // Require at least 60% of raters to have submitted (or all if 1–2 raters)
        const minRequired = totalEntries <= 2 ? totalEntries : Math.ceil(totalEntries * 0.6);
        if (submittedEntries.length < minRequired) {
            return NextResponse.json({
                error: `At least ${minRequired} of your ${totalEntries} raters must submit before generating the report.`
            }, { status: 400 });
        }

        // Build multi-voice aggregated feedback — group by archetype_group or archetype
        const groups: Record<string, string[]> = {};
        for (const entry of submittedEntries) {
            const group = entry.archetype_group ?? entry.archetype;
            if (!groups[group]) groups[group] = [];
            if (entry.sanitized_text) groups[group].push(entry.sanitized_text);
        }

        // Synthesise groups with multiple raters
        const aggregatedSections: string[] = [];
        for (const [group, texts] of Object.entries(groups)) {
            if (texts.length === 1) {
                aggregatedSections.push(`[${group}]\n${texts[0]}`);
            } else {
                const consensusPrompt = `Synthesise these ${texts.length} perspectives from the "${group}" group into one definitive Consensus View. Preserve critical insights, note divergence. Output only the synthesis:\n\n${texts.map((t, i) => `Rater ${i + 1}: "${t}"`).join('\n\n')}`;
                const consensusResponse = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: consensusPrompt,
                });
                aggregatedSections.push(`[${group} — Consensus of ${texts.length} raters]\n${consensusResponse.text?.trim() ?? texts.join(' ')}`);
            }
        }

        const rawFeedbackBlob = aggregatedSections.join('\n\n---\n\n');

        const goalType = audit.goal_type ?? null;
        const goalLabel = goalType ? GOAL_LABELS[goalType] ?? goalType : null;

        // Build perception gap data from self-audit
        const selfResponses: Record<string, number> = audit.self_audit_responses ?? {};
        const raterScores: Record<string, number[]> = {};
        for (const dim of PERCEPTION_DIMENSIONS) {
            raterScores[dim] = [];
        }

        // Compute per-dimension rater averages from submitted entries
        for (const entry of submittedEntries) {
            if (entry.dimension_scores && typeof entry.dimension_scores === 'object') {
                for (const dim of PERCEPTION_DIMENSIONS) {
                    const val = (entry.dimension_scores as Record<string, number>)[dim];
                    if (typeof val === 'number') raterScores[dim].push(val);
                }
            }
        }

        const perceptionGap: Record<string, { self: number | null; raters: number | null }> = {};
        for (const dim of PERCEPTION_DIMENSIONS) {
            const selfScore = selfResponses[dim] ?? null;
            const raterAvg = raterScores[dim].length > 0
                ? Math.round((raterScores[dim].reduce((a, b) => a + b, 0) / raterScores[dim].length) * 10) / 10
                : null;
            perceptionGap[dim] = { self: selfScore, raters: raterAvg };
        }

        // Final report synthesis prompt
        const prompt = `You are an elite executive coach and psychological profiler delivering a definitive Reputation Audit.
${goalLabel ? `The subject's strategic goal is: "${goalLabel}". Ensure the actionable steps align with this goal.` : ''}

AGGREGATED 360° FEEDBACK DATA:
${rawFeedbackBlob}

Deliver:
1. **The Hard Truth** — the dominant, unvarnished perception theme across all voices.
2. **Your Biggest Blindspot** — the gap between their self-perception and external reality.
3. **3 Radical Steps to Evolve Your Reputation** — specific, actionable, goal-aligned if goal is set.

Format output in clean, bold, engaging Markdown. No generic intro — just the analysis.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        const reportMarkdown = response.text?.trim();

        return NextResponse.json({
            report: reportMarkdown,
            perceptionGap,
            hasPerceptionData: Object.values(selfResponses).length > 0,
            goalType,
            goalLabel,
            generatedAt: new Date().toISOString(),
        });

    } catch (err: any) {
        console.error('Generate Report Error:', err);
        return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
    }
}
