'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    const msg = error.message.includes('Email not confirmed')
      ? 'Please check your email and confirm your account before signing in.'
      : error.message.includes('Invalid login credentials')
      ? 'Invalid email or password. Please try again.'
      : 'Could not sign in. Please try again.'
    redirect(`/login?error=${encodeURIComponent(msg)}`)
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { data: signUpData, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`)
  }

  // If email confirmation is required, auto-confirm via admin API
  const userId = signUpData?.user?.id
  const emailConfirmedAt = signUpData?.user?.email_confirmed_at

  if (userId && !emailConfirmedAt) {
    // Auto-confirm via service role admin API
    const adminClient = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    await adminClient.auth.admin.updateUserById(userId, {
      email_confirm: true,
    })
    // Sign in after auto-confirmation
    await supabase.auth.signInWithPassword({ email, password })
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
