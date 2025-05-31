"use server"

import { createClient } from '@supabase/server'

export async function getInterviewById(id: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not found')
  }

  const { data: interview, error } = await supabase
    .from('interviews')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    throw error
  }

  if (!interview) {
    throw new Error('Interview not found')
  }

  return { interview }
}