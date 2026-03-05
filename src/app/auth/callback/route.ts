import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// This route is called by Supabase after the user clicks the password reset link in their email.
// It exchanges the code for a session and redirects the user to the reset-password page.
export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? '/reset-password';

    if (code) {
        const supabase = await createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
            return NextResponse.redirect(`${origin}${next}`);
        }
    }

    // If something went wrong, redirect back to login with an error message
    return NextResponse.redirect(`${origin}/login?error=Invalid+or+expired+password+reset+link`);
}
