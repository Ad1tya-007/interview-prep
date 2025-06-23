"use server"

import { createClient } from '@supabase/server'

export async function getInterviewsOfCurrentUser() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not found')
  }

  const { data: interviews, error } = await supabase
    .from('interviews')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return { interviews: interviews || [] }
}

export async function deleteInterview(id: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not found')
  }

  const { error } = await supabase
    .from('interviews')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    throw error
  }

  return { success: true }
}

interface UpdateInterviewData {
  role: string;
  description: string;
  level: string;
  type: string;
  tags: string[];
}

export async function updateInterview(id: string, data: UpdateInterviewData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not found')
  }

  const { data: updatedInterview, error } = await supabase
    .from('interviews')
    .update({
      role: data.role,
      description: data.description,
      tags: data.tags,
    })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    throw error
  }

  return updatedInterview
}
