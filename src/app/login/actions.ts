'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData): Promise<{ error: string } | void> {
    const supabase = await createClient()

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/dashboard')
    redirect('/dashboard')
}

export async function signup(formData: FormData): Promise<{ error: string } | void> {
    const supabase = await createClient()

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { data: authData, error } = await supabase.auth.signUp(data)

    if (error) {
        return { error: error.message }
    }

    // Ensure a profiles row exists for this new user so RLS policies don't fail
    if (authData.user) {
        await supabase.from('profiles').upsert({
            id: authData.user.id,
            email: authData.user.email
        }, { onConflict: 'id' });
    }

    revalidatePath('/dashboard')
    redirect('/dashboard')
}
