import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// Stripe requires the raw body to construct the event
export const config = {
    api: {
        bodyParser: false,
    },
};

export async function POST(req: Request) {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!stripeKey || !webhookSecret) {
        return NextResponse.json({ error: 'Stripe configuration missing' }, { status: 500 });
    }

    const stripe = new Stripe(stripeKey, { apiVersion: '2023-10-16' as any });
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
        return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
    }

    try {
        const body = await req.text();
        const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object as Stripe.Checkout.Session;
            const auditId = session.metadata?.audit_id;

            if (auditId) {
                // Use Service Role to bypass RLS securely
                const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
                const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
                const supabase = createClient(supabaseUrl, supabaseServiceKey);

                const { error } = await supabase
                    .from('audits')
                    .update({
                        payment_status: 'paid',
                        status: 'completed'
                    })
                    .eq('id', auditId);

                if (error) {
                    console.error("Webhook Supabase Update Error:", error);
                    throw error;
                }

                console.log(`✅ Audit ${auditId} successfully unlocked via Stripe.`);
            }
        }

        return NextResponse.json({ received: true }, { status: 200 });
    } catch (error: any) {
        console.error("Webhook Error:", error.message);
        return NextResponse.json({ error: `Webhook Error: ${error.message}` }, { status: 400 });
    }
}
