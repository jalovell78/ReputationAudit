import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing SUPABASE env vars.");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
    const { data: entry, error: fetchErr } = await supabase.from('feedback_entries').select('rater_link_id').eq('status', 'pending').limit(1).single();

    if (fetchErr || !entry) {
        console.error("No pending feedback entries found!", fetchErr);
        return;
    }

    console.log("Testing with link ID:", entry.rater_link_id);
    const url = 'http://localhost:3000/api/submit-feedback';
    const payload = {
        id: entry.rater_link_id,
        feedback: 'Bro, honestly, this is insanely toxic syntax and u r kinda crazy fr, no cap'
    };

    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        console.log('API Status:', res.status);
        console.log('API Response:', data);

        const { data: updated } = await supabase.from('feedback_entries').select('sanitized_text, status, promo_code').eq('rater_link_id', entry.rater_link_id).single();
        console.log('Updated DB Record:', updated);
    } catch (err) {
        console.error('Fetch error:', err);
    }
}

test();
