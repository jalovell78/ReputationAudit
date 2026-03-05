import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { auditId } = await req.json();
        if (!auditId) {
            return NextResponse.json({ error: 'Missing auditId' }, { status: 400 });
        }

        // Verify Audit belongs to user and is ready to unlock
        const { data: audit, error: auditErr } = await supabase
            .from('audits')
            .select('*, feedback_entries(*)')
            .eq('id', auditId)
            .eq('user_id', user.id)
            .single();

        if (auditErr || !audit) {
            return NextResponse.json({ error: 'Audit not found or access denied' }, { status: 404 });
        }

        // Check if Stripe is configured
        const stripeKey = process.env.STRIPE_SECRET_KEY;
        if (!stripeKey || stripeKey === 'your_stripe_secret_key_here') {
            // Development fallback: If no stripe keys, just unlock it instantly
            console.warn("Stripe key missing - Auto unlocking for development.");

            const supabaseService = createSupabaseClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.SUPABASE_SERVICE_ROLE_KEY!
            );

            const { error: fallbackErr } = await supabaseService.from('audits').update({ payment_status: 'paid', status: 'completed' }).eq('id', auditId);
            if (fallbackErr) {
                console.error("Fallback Update Error:", fallbackErr);
            }
            return NextResponse.json({ checkoutUrl: `/report/${auditId}` });
        }

        const stripe = new Stripe(stripeKey, {
            apiVersion: '2023-10-16' as any,
        });

        // Create Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'The Reputation Audit - Final Report Unlock',
                            description: 'Unlock your AI-synthesized, radical 360-degree feedback report.',
                        },
                        unit_amount: 4900, // $49.00
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/report/${auditId}?success=true`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard?canceled=true`,
            client_reference_id: user.id,
            metadata: {
                audit_id: auditId,
            },
        });

        if (!session.url) {
            throw new Error("Failed to generate Stripe session URL.");
        }

        // Save session ID to the audit record
        await supabase.from('audits').update({ stripe_session_id: session.id }).eq('id', auditId);

        return NextResponse.json({ checkoutUrl: session.url });
    } catch (error: any) {
        console.error('Stripe Checkout Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
