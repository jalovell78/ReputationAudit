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

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const fullName = formData.get('fullName') as string | null

    const data = {
        email,
        password,
        options: {
            data: {
                full_name: fullName
            }
        }
    }

    const { data: authData, error } = await supabase.auth.signUp(data)

    if (error) {
        return { error: error.message }
    }

    // Ensure a profiles row exists for this new user so RLS policies don't fail
    if (authData.user) {
        await supabase.from('profiles').upsert({
            id: authData.user.id,
            email: authData.user.email,
            full_name: fullName
        }, { onConflict: 'id' });
    }

    revalidatePath('/dashboard')
    redirect('/dashboard')
}

export async function logout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath('/')
    redirect('/login')
}
