import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id: auditId } = await params;
        const { prediction } = await req.json();

        if (typeof prediction !== 'string') {
            return NextResponse.json({ error: 'Invalid prediction type' }, { status: 400 });
        }

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // --- SECURITY CHECK: Prevent updates if a report has already been generated ---
        const { data: existingReport } = await supabase
            .from('audit_reports')
            .select('id')
            .eq('audit_id', auditId)
            .limit(1)
            .single();

        if (existingReport) {
            return NextResponse.json(
                { error: 'Hypothesis is locked. A report has already been generated for this audit.' },
                { status: 403 }
            );
        }

        const { error } = await supabase
            .from('audits')
            .update({ self_prediction_text: prediction })
            .eq('id', auditId)
            .eq('user_id', user.id);

        if (error) {
            console.error('Update Prediction Error:', error);
            return NextResponse.json({ error: 'Failed to update prediction' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error('Request Error:', err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
