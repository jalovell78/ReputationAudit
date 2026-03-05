import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { auditId, responses } = await req.json();
        // responses: Record<string, number>  — e.g. { communication: 4, leadership: 3, ... }

        if (!auditId || !responses || typeof responses !== 'object') {
            return NextResponse.json({ error: 'Missing auditId or responses' }, { status: 400 });
        }

        // Verify audit ownership
        const { data: audit } = await supabase.from('audits').select('id').eq('id', auditId).eq('user_id', user.id).single();
        if (!audit) return NextResponse.json({ error: 'Audit not found or access denied' }, { status: 404 });

        // Update self_audit_responses — use service role for a clean bypass
        const serviceClient = createSupabaseClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const { error } = await serviceClient
            .from('audits')
            .update({ self_audit_responses: responses })
            .eq('id', auditId);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error('Self-Audit Save Error:', err);
        return NextResponse.json({ error: 'Failed to save self-audit responses' }, { status: 500 });
    }
}
