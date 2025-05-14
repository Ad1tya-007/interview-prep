'use server'

import { createClient } from '@supabase/server'

export async function sendOtp(email: string) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithOtp({
    email,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function verifyOtp(email: string, token: string) {
  const supabase = await createClient()

  const { error, data } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email',
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true, user: data.user }
}

export async function logout() {
  const supabase = await createClient()
  
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    return { error: error.message }
  }

  return { success: true }
} 

export async function signInWithGoogle() {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `http://localhost:3000/auth/callback`,
        skipBrowserRedirect: true // This prevents automatic redirect
      },
    })

    if (error) {
      
      return { error: error.message }
    }

    if (data?.url) {
      return { success: true, url: data.url }
    } else {
      return { error: 'Failed to generate authentication URL' }
    }
  } catch (err) {
    return { error: err }
  }
}

