import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI } from '@google/genai';
import Stripe from 'stripe';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

export async function POST(req: Request) {
    try {
        const { id, feedback } = await req.json();

        if (!id || !feedback) {
            return NextResponse.json({ error: 'Missing id or feedback' }, { status: 400 });
        }

        // Use the Service Role Key to bypass RLS, since this is a secure server-side operation.
        // This prevents the "violates row-level security policy" error when changing the status to 'submitted'.
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseServiceKey) {
            throw new Error("Missing Supabase URL or Service Role Key");
        }

        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // 1. Fetch the entry
        const { data: entry, error: fetchError } = await supabase
            .from('feedback_entries')
            .select('*')
            .eq('rater_link_id', id)
            .single();

        if (fetchError || !entry || entry.status === 'submitted') {
            return NextResponse.json({ error: 'Invalid or already submitted link' }, { status: 400 });
        }

        // 2. Call Gemini for Sanitization
        const prompt = `Rewrite this feedback to remove slurs/toxicity and identifiable speech patterns (slang/syntax), but strictly preserve the 'hard truth' and core meaning. Output only the sanitized text:\n\n"${feedback}"`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        const sanitizedText = response.text?.trim();

        if (!sanitizedText) {
            throw new Error("Failed to generate sanitized text");
        }

        // 3. Generate Stripe Promo Code
        let promoCodeString = null;
        const stripeKey = process.env.STRIPE_SECRET_KEY;

        if (entry.rater_email && stripeKey && stripeKey !== 'your_stripe_secret_key_here') {
            try {
                const stripe = new Stripe(stripeKey, {
                    apiVersion: '2023-10-16' as any, // fallback to typical api version typing mapping
                });

                // Find or create customer
                const customers = await stripe.customers.list({ email: entry.rater_email, limit: 1 });
                let customerId;
                if (customers.data.length > 0) {
                    customerId = customers.data[0].id;
                } else {
                    const newCustomer = await stripe.customers.create({ email: entry.rater_email });
                    customerId = newCustomer.id;
                }

                // Create a 50% off coupon
                const coupon = await stripe.coupons.create({
                    percent_off: 50,
                    duration: 'once',
                });

                // Create the promotion code restricted to the customer
                const promoCode = await stripe.promotionCodes.create({
                    coupon: coupon.id,
                    customer: customerId,
                    max_redemptions: 1,
                } as any);

                promoCodeString = promoCode.code;
            } catch (stripeErr) {
                console.warn('⚠️ Stripe API Error: Could not generate promo code.', stripeErr);
            }
        } else {
            console.warn('⚠️ Stripe Secret Key missing or using placeholder. Skipping promo code generation.');
        }

        // 4. Update Database
        const { error: updateError } = await supabase
            .from('feedback_entries')
            .update({
                original_text: feedback,
                sanitized_text: sanitizedText,
                promo_code: promoCodeString,
                status: 'submitted',
                submitted_at: new Date().toISOString(),
            })
            .eq('id', entry.id);

        if (updateError) {
            throw updateError;
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Submit Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
