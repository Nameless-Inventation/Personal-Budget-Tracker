'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  try {
    const supabase = await createClient()
    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    }
    const { error } = await supabase.auth.signInWithPassword(data)
    if (error) return redirect('/login?message=' + encodeURIComponent(error.message))
  } catch (e: any) {
    if (e.message === 'NEXT_REDIRECT') throw e;
    return redirect('/login?message=' + encodeURIComponent(e.message))
  }
  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  try {
    const supabase = await createClient()
    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    }
    const { error } = await supabase.auth.signUp(data)
    if (error) return redirect('/login?message=' + encodeURIComponent(error.message))
  } catch (e: any) {
    if (e.message === 'NEXT_REDIRECT') throw e;
    return redirect('/login?message=' + encodeURIComponent(e.message))
  }
  revalidatePath('/', 'layout')
  redirect('/login?message=Check email to continue sign in process')
}

export async function signout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
