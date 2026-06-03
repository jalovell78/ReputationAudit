import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getTenantFromHeaders } from '@/lib/tenant-server';
import { getRaterEmailTemplate } from '@/lib/emailTemplates';
import { Resend } from 'resend';
import { waitUntil } from '@vercel/functions';

// Helper to asynchronously send emails in the background using Resend API.
// This function must not be awaited inside the request handler; instead, it is passed to req.waitUntil().
async function sendEmailsInBackground(
    entries: any[],
    goalType: string | null,
    userName: string | undefined,
    origin: string,
    platformSource: string
) {
    try {
        const resendApiKey = process.env.REPUTATIONAUDIT_PRODUCTION;
        if (!resendApiKey) {
            console.error('[Email Dispatch] REPUTATIONAUDIT_PRODUCTION is not defined in the environment.');
            return;
        }
        const resend = new Resend(resendApiKey);

        const fromEmail = platformSource === 'perception_mirror'
            ? '"The Perception Mirror" <hello@theperceptionmirror.com>'
            : '"RepStanding" <audit@repstanding.com>';

        const emailPromises = entries.map(async (entry) => {
            // Absolute path overrides per brand constraints. Falling back to host origin in local dev.
            let baseDomain = platformSource === 'perception_mirror'
                ? 'https://www.theperceptionmirror.com'
                : 'https://www.repstanding.com';

            if (process.env.NODE_ENV === 'development') {
                baseDomain = origin;
            }

            const shareUrl = `${baseDomain}/rate/${entry.rater_link_id}`;
            const template = getRaterEmailTemplate(
                goalType,
                entry.archetype_group || entry.archetype,
                entry.rater_name,
                shareUrl,
                userName
            );

            try {
                const response = await resend.emails.send({
                    from: fromEmail,
                    to: entry.rater_email,
                    subject: template.subject,
                    text: template.body,
                });
                console.log(`[Email Dispatch] Successfully sent email to ${entry.rater_email}:`, response);
            } catch (err) {
                console.error(`[Email Dispatch] Error sending email to ${entry.rater_email}:`, err);
            }
        });

        await Promise.all(emailPromises);
    } catch (error) {
        console.error('[Email Dispatch] Critical background sending error:', error);
    }
}

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();

        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { raters, goalType } = await req.json();

        if (!Array.isArray(raters) || raters.length < 1 || raters.length > 20) {
            return NextResponse.json({ error: 'Between 1 and 20 raters are required.' }, { status: 400 });
        }

        // Fetch the creator's full name from their profile to sign off the emails.
        const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', user.id)
            .single();
        const userName = profile?.full_name || undefined;

        // Resolve active tenant from headers list.
        const platformSource = await getTenantFromHeaders();

        // 1. Create the Parent Audit Record — include goal_type if provided
        const { data: audit, error: auditErr } = await supabase
            .from('audits')
            .insert({ user_id: user.id, status: 'in_progress', goal_type: goalType ?? null })
            .select()
            .single();

        if (auditErr) throw auditErr;

        // 2. Map payload to feedback_entries rows
        const entriesToInsert = raters.map(r => ({
            audit_id: audit.id,
            archetype: r.archetype,
            archetype_group: r.archetype_group ?? r.archetype,
            rater_name: r.name,
            rater_email: r.email,
        }));

        // 3. Insert all feedback_entries. DB default gen_random_uuid() handles rater_link_id.
        const { data: insertedEntries, error: entriesErr } = await supabase
            .from('feedback_entries')
            .insert(entriesToInsert)
            .select('rater_email, rater_name, rater_link_id, archetype, archetype_group');

        if (entriesErr) throw entriesErr;

        // 4. Trigger non-blocking email dispatch in the background execution pipeline.
        // Vercel's waitUntil prevents freezing the route execution thread prior to promise completion.
        const origin = new URL(req.url).origin;
        waitUntil(
            sendEmailsInBackground(
                insertedEntries || [],
                goalType,
                userName,
                origin,
                platformSource
            )
        );

        return NextResponse.json({ success: true, auditId: audit.id });
    } catch (error: any) {
        console.error('Create Audit Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
