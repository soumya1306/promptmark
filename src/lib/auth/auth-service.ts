'use client';

import { createClient, isSupabaseConfigured } from '../supabase/client';
import { UserProfile } from '../types/workspace';

export async function signInWithGoogle() {
  const supabase = createClient();
  if (!supabase || !isSupabaseConfigured()) {
    throw new Error(
      'Supabase credentials are not configured yet. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local file.'
    );
  }

  const redirectTo = `${window.location.origin}/auth/callback`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error) {
    console.error('[AuthService] Google OAuth Sign-in Error:', error.message);
    throw error;
  }

  return data;
}

export async function signOutUser() {
  const supabase = createClient();
  if (!supabase) return;

  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('[AuthService] Sign-out Error:', error.message);
    throw error;
  }
}

export async function getCurrentUser() {
  const supabase = createClient();
  if (!supabase) return null;

  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return null;
    return user;
  } catch (err) {
    console.warn('[AuthService] Could not get user:', err);
    return null;
  }
}

export async function fetchCurrentProfile(): Promise<UserProfile | null> {
  const supabase = createClient();
  if (!supabase) return null;

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return null;
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.warn('[AuthService] Profile fetch error, returning fallback profile:', profileError.message);
      return {
        id: user.id,
        email: user.email ?? 'user@sanctuary.design',
        full_name: (user.user_metadata?.full_name as string) ?? (user.user_metadata?.name as string) ?? 'Sanctuary Author',
        avatar_url: (user.user_metadata?.avatar_url as string) ?? (user.user_metadata?.picture as string) ?? null,
        storage_quota_bytes: 262144000,
        storage_used_bytes: 0,
      };
    }

    return profile;
  } catch (err) {
    console.error('[AuthService] Exception in fetchCurrentProfile:', err);
    return null;
  }
}

export function subscribeToAuth(callback: (user: any) => void) {
  const supabase = createClient();
  if (!supabase) return () => {};

  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null);
  });

  return () => {
    subscription.unsubscribe();
  };
}
