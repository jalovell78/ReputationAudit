import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

export async function GET(req: Request, { params }: { params: Promise<{ auditId: string }> }) {
    try {
        const { auditId } = await params;

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        // Verify audit ownership
        const { data: audit } = await supabase.from('audits').select('id').eq('id', auditId).eq('user_id', user.id).single();
        if (!audit) return NextResponse.json({ error: 'Audit not found or access denied' }, { status: 404 });

        // Use service role to fetch all entries
        const serviceClient = createSupabaseClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const { data: entries } = await serviceClient
            .from('feedback_entries')
            .select('*')
            .eq('audit_id', auditId)
            .eq('status', 'submitted');

        if (!entries || entries.length === 0) {
            return NextResponse.json({ groupSentiments: {} });
        }

        // Group by archetype_group (fallback to archetype for backward compat)
        const groups: Record<string, string[]> = {};
        for (const entry of entries) {
            const group = entry.archetype_group ?? entry.archetype;
            if (!groups[group]) groups[group] = [];
            if (entry.sanitized_text) groups[group].push(entry.sanitized_text);
        }

        // For groups with >1 rater, synthesise a consensus view via Gemini
        const groupSentiments: Record<string, string> = {};
        for (const [group, texts] of Object.entries(groups)) {
            if (texts.length === 1) {
                groupSentiments[group] = texts[0];
            } else {
                const prompt = `You are an elite analyst synthesising multiple perspectives about the same person from the archetype group: "${group}".
                
Multiple raters in this group said:
${texts.map((t, i) => `Rater ${i + 1}: "${t}"`).join('\n\n')}

Synthesise these into a single, definitive "Consensus View" that:
1. Captures the dominant theme across all raters.
2. Notes any significant divergence between raters.
3. Preserves critical insights even if only mentioned once.

Output only the Consensus View — no preamble:`;

                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                });
                groupSentiments[group] = response.text?.trim() ?? texts.join(' ');
            }
        }

        return NextResponse.json({ groupSentiments });
    } catch (err: any) {
        console.error('Aggregate Sentiment Error:', err);
        return NextResponse.json({ error: 'Failed to aggregate sentiment' }, { status: 500 });
    }
}
