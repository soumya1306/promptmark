import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        return NextResponse.redirect(`${origin}${next}`);
      }
      console.error('[Auth Callback] Code exchange error:', error.message);
    } catch (err) {
      console.error('[Auth Callback] Exception exchanging code for session:', err);
    }
  }

  // If code exchange fails or no code is present, return the user to an error state or home
  return NextResponse.redirect(`${origin}/?auth_error=oauth_failed`);
}
