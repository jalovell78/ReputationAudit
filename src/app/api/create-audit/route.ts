import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
    try {
        const supabase = await createClient();

        // Ensure user is authenticated
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { raters } = await req.json();

        if (!Array.isArray(raters) || raters.length !== 5) {
            return NextResponse.json({ error: 'Exactly 5 raters are required.' }, { status: 400 });
        }

        // 1. Create the Parent Audit Record
        const { data: audit, error: auditErr } = await supabase
            .from('audits')
            .insert({ user_id: user.id, status: 'in_progress' })
            .select()
            .single();

        if (auditErr) throw auditErr;

        // 2. Map payload to feedback_entries rows
        const entriesToInsert = raters.map(r => ({
            audit_id: audit.id,
            archetype: r.archetype,
            rater_name: r.name,
            rater_email: r.email,
        }));

        // 3. Insert all 5 feedback_entries. The DB default gen_random_uuid() handles generating the rater_link_id.
        const { error: entriesErr } = await supabase
            .from('feedback_entries')
            .insert(entriesToInsert);

        if (entriesErr) throw entriesErr;

        return NextResponse.json({ success: true, auditId: audit.id });
    } catch (error: any) {
        console.error('Create Audit Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
