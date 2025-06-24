'use server';

import { createClient } from '../../../supabase/server';

type AuthResponse = {
  error?: string;
  success?: boolean;
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