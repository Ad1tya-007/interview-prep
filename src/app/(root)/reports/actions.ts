"use server";

import { createClient } from "@supabase/server";

export async function getReportsOfCurrentUser() {
  const supabase = await createClient();

 const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not found')
  }

  const { data: reports, error } = await supabase
    .from("reports")
    .select(`
      *,
      interviews (
        type,
        role,
        tags,
        level
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
  }

  return { reports: reports || [] };
}