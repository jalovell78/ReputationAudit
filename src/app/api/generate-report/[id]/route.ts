import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        // In Next.js 15+, params is a promise. Wait for it just in case:
        const resolvedParams = await params;
        const auditId = resolvedParams.id;

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Securely fetch audit, ensuring user owns it and it's unlocked
        const { data: audit, error } = await supabase
            .from('audits')
            .select('*, feedback_entries(*)')
            .eq('id', auditId)
            .eq('user_id', user.id)
            .single();

        if (error || !audit) {
            console.error("Audit Fetch Failed:", { auditId, userId: user.id, error });
            return NextResponse.json({ error: 'Audit not found or access denied' }, { status: 404 });
        }

        const isUnlocked = audit.payment_status === 'paid' || audit.status === 'completed';
        if (!isUnlocked) {
            return NextResponse.json({ error: 'Report is locked. Please complete checkout.' }, { status: 403 });
        }

        const allSubmitted = audit.feedback_entries.every((e: any) => e.status === 'submitted');
        if (!allSubmitted) {
            return NextResponse.json({ error: 'All 5 feedback entries must be submitted first.' }, { status: 400 });
        }

        // Format all feedback into a single blob for Gemini
        const rawFeedbackList = audit.feedback_entries.map((entry: any) =>
            `[Archetype: ${entry.archetype}]\n${entry.sanitized_text}`
        ).join('\n\n---\n\n');

        const prompt = `
      You are an elite executive coach and psychological profiler. 
      Analyze the following 360-degree feedback gathered from 5 distinct archetypes regarding the user.

      FEEDBACK DATA:
      ${rawFeedbackList}
      
      Tasks:
      1. Synthesize the core "Hard Truth" - what is the dominant, unvarnished theme they need to hear?
      2. Identify their biggest blindspot.
      3. List 3 distinct actionable, radical steps they must take to evolve their reputation.
      
      Format the output in clean, bold, engaging Markdown. Do not include a generic intro/outro, just give the analysis.
    `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        const reportMarkdown = response.text?.trim();

        return NextResponse.json({
            report: reportMarkdown,
            generatedAt: new Date().toISOString()
        });

    } catch (err: any) {
        console.error("Generate Report Error:", err);
        return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
    }
}
