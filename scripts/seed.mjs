import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in process.env");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    try {
        // 1. Create a dummy user
        const email = `test_${Date.now()}@test.com`;
        console.log(`Creating dummy user: ${email}`);
        const { data: userAuth, error: authErr } = await supabase.auth.admin.createUser({
            email,
            password: 'password123',
            email_confirm: true
        });

        if (authErr) throw authErr;
        const userId = userAuth.user.id;

        // 2. Insert profile
        const { error: profileErr } = await supabase.from('profiles').insert({
            id: userId,
            email: email,
            full_name: 'Test Setup User'
        });
        if (profileErr) throw profileErr;

        // 3. Create Audit
        const { data: audit, error: auditErr } = await supabase.from('audits').insert({
            user_id: userId
        }).select().single();
        if (auditErr) throw auditErr;

        // 4. Create Feedback Entry
        const { data: entry, error: entryErr } = await supabase.from('feedback_entries').insert({
            audit_id: audit.id,
            archetype: 'Critic/Hater',
            rater_email: 'cynical_reviewer@test.com',
            rater_name: 'Cynical Reviewer'
        }).select().single();
        if (entryErr) throw entryErr;

        console.log(`SUCCESS: Test record injected!`);
        console.log(`Link: http://localhost:3000/rate/${entry.rater_link_id}`);

    } catch (err) {
        console.error("Error setting up data:", err);
    }
}

main();
