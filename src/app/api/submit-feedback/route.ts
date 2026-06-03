import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI } from '@google/genai';
import Stripe from 'stripe';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

// Goal-specific framing for the sanitizer
const GOAL_CONTEXT: Record<string, string> = {
    // New specific goals
    executive_presence: 'The person is focused on executive presence, authority, upward management, and professional influence. Frame insights through that lens.',
    high_performance_leadership: 'The person is focused on high-performance leadership, team empowerment, and operational accountability. Frame insights through that lens.',
    strategic_impact: 'The person is focused on strategic impact, vision signaling, and innovation. Frame insights through that lens.',
    career_progression: 'The person is focused on career progression velocity, visibility, and corporate optics. Frame insights through that lens.',
    shadow_integration: 'The person is working on shadow integration, uncovering defense patterns, and blindspots. Frame insights through that lens.',
    relational_resonance: 'The person is focused on relational resonance, somatic presence, and co-regulation. Frame insights through that lens.',
    core_alignment: 'The person is focused on purpose, core alignment, and bridging intent with action. Frame insights through that lens.',
    conscious_presence: 'The person is focused on conscious presence, authentic voice, and visibility. Frame insights through that lens.',

    // Legacy fallbacks
    leadership_mastery: 'The person is developing leadership authority, psychological safety in their team, and influence. Frame insights through that lens.',
    personal_growth: 'The person is working on deep self-awareness, emotional patterns, and behavioural habits. Frame insights through that lens.',
    social_intelligence: 'The person is developing social perception, empathy, active listening, and relational skills. Frame insights through that lens.',
};

export async function POST(req: Request) {
    try {
        const { id, responses } = await req.json();

        if (!id || !Array.isArray(responses) || responses.length === 0) {
            return NextResponse.json({ error: 'Missing id or responses' }, { status: 400 });
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseServiceKey) {
            throw new Error('Missing Supabase URL or Service Role Key');
        }

        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // 1. Fetch the entry AND the parent audit for goal_type
        const { data: entry, error: fetchError } = await supabase
            .from('feedback_entries')
            .select('*, audits(goal_type)')
            .eq('rater_link_id', id)
            .single();

        if (fetchError || !entry || entry.status === 'submitted') {
            return NextResponse.json({ error: 'Invalid or already submitted link' }, { status: 400 });
        }

        // 2. Insert structured responses to the new rater_responses table (privileged backend client boundary)
        const responsesToInsert = responses.map((r: any) => ({
            audit_id: entry.audit_id,
            category_name: r.category_name,
            quantitative_score: r.quantitative_score,
            selected_tags: r.selected_tags || null,
            optional_text_seed: r.optional_text_seed || null,
        }));

        const { error: insertErr } = await supabase
            .from('rater_responses')
            .insert(responsesToInsert);

        if (insertErr) throw insertErr;

        // 3. Compile responses into a consolidated qualitative block for Gemini compatibility
        const compiledFeedback = responses.map((r: any) => {
            const scoreText = `${r.quantitative_score}/5`;
            const tagsText = Array.isArray(r.selected_tags) && r.selected_tags.length > 0
                ? `Attributes: ${r.selected_tags.join(', ')}`
                : 'Attributes: None selected';
            const seedText = r.optional_text_seed ? `Context: ${r.optional_text_seed}` : '';
            return `Category: ${r.category_name}\nScore: ${scoreText}\n${tagsText}\n${seedText}`.trim();
        }).join('\n\n');

        // 4. Build goal-aware sanitization prompt using compiled feedback text
        const goalType: string = (entry.audits as any)?.goal_type ?? null;
        const goalContext = goalType ? GOAL_CONTEXT[goalType] ?? '' : '';
        const raterArchetype = entry.archetype || 'Unknown';

        const prompt = `You are an expert reputation analyst and psychological synthesizer.
Relationship of Rater to Subject: ${raterArchetype}
${goalContext ? `CONTEXT: ${goalContext}` : ''}

Rewrite this feedback to:
1. Remove slurs, toxicity, and identifiable speech patterns (slang or syntax).
2. Strictly preserve the 'hard truth', core criticism, and specific behavioral observations.
3. If the goal context is provided, subtly frame the sanitized text around that growth goal.

Output only the sanitized text — no preamble, no explanation:

"${compiledFeedback}"`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        const sanitizedText = response.text?.trim();

        if (!sanitizedText) {
            throw new Error('Failed to generate sanitized text');
        }

        // 5. Generate Stripe Promo Code (Preserving legacy stubs)
        let promoCodeString = null;
        const stripeKey = process.env.STRIPE_SECRET_KEY;

        if (entry.rater_email && stripeKey && stripeKey !== 'your_stripe_secret_key_here') {
            try {
                const stripe = new Stripe(stripeKey, { apiVersion: '2023-10-16' as any });
                const customers = await stripe.customers.list({ email: entry.rater_email, limit: 1 });
                let customerId;
                if (customers.data.length > 0) {
                    customerId = customers.data[0].id;
                } else {
                    const newCustomer = await stripe.customers.create({ email: entry.rater_email });
                    customerId = newCustomer.id;
                }
                const coupon = await stripe.coupons.create({ percent_off: 50, duration: 'once' });
                const promoCode = await stripe.promotionCodes.create({
                    coupon: coupon.id,
                    customer: customerId,
                    max_redemptions: 1,
                } as any);
                promoCodeString = promoCode.code;
            } catch (stripeErr) {
                console.warn('⚠️ Stripe API Error: Could not generate promo code.', stripeErr);
            }
        }

        // 6. Update Database
        const { error: updateError } = await supabase
            .from('feedback_entries')
            .update({
                original_text: compiledFeedback,
                sanitized_text: sanitizedText,
                promo_code: promoCodeString,
                status: 'submitted',
                submitted_at: new Date().toISOString(),
            })
            .eq('id', entry.id);

        if (updateError) throw updateError;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Submit Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
