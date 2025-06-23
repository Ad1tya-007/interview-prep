import { createClient } from '@supabase/server'
import { NextResponse } from 'next/server'
import { ensureUserExists } from '../actions'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      // Redirect to error page or login page with error message
      return NextResponse.redirect(new URL('/login?error=auth_callback_error', request.url))
    }

    if (!data.user) {
      return NextResponse.redirect(new URL('/login?error=no_user', request.url))
    }

    // Ensure user exists in our database
    const { error: dbError } = await ensureUserExists(data.user)
    
    if (dbError) {
      // Log the error but don't stop the flow - user is still authenticated
      console.error('Error ensuring user exists in database:', dbError)
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL('/interviews', request.url))
} 