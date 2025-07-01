'use server';

import { createClient } from '../../../supabase/server';

type AuthResponse = {
  error?: string;
  success?: boolean;
  url?: string;
};

export async function login(email: string, password: string): Promise<AuthResponse> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function signup(email: string, password: string): Promise<AuthResponse> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  // Sign out the user after successful signup
  await supabase.auth.signOut();

  return { success: true };
}

export async function logout(): Promise<AuthResponse> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    return { error: error.message };
  }

  return { success: true };
} 

export async function signInWithGoogle(): Promise<AuthResponse> {
  const supabase = await createClient()
  const url = process.env.NEXT_PUBLIC_LINK || 'http://localhost:3000'

  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${url}/callback`,
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
    return { error: err as string }
  }
}