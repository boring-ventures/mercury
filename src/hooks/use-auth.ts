import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  /**
   * Sign in with email and password
   * @param email User's email
   * @param password Plain text password - Supabase Auth handles hashing internally
   */
  const signIn = async (email: string, password: string) => {
    // Send plain password to Supabase Auth - it handles password hashing internally
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    if (data?.session) {
      setSession(data.session);
      setUser(data.session.user);
      await supabase.auth.setSession(data.session);
      return data.session;
    }
  };

  /**
   * Sign up with email and password
   * @param email User's email
   * @param password Plain text password - Supabase Auth handles hashing internally
   */
  const signUp = async (
    email: string,
    password: string
  ): Promise<{
    success: boolean;
    user: User | null;
    session: Session | null;
    confirmEmail: boolean;
    error: Error | null;
  }> => {
    try {
      // Get the site URL from the environment or current location
      const siteUrl =
        process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;

      // Send plain password to Supabase Auth - it handles password hashing internally
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${siteUrl}/auth/callback`,
          data: {
            email_confirmed: false,
          },
        },
      });

      if (error) {
        throw error;
      }

      // For email confirmation sign-ups, we won't get a session immediately
      // The user needs to verify their email first
      // Note: Profile creation is handled in two places:
      // 1. On the client during signup (in sign-up-form.tsx) with user-provided data
      // 2. As a fallback in auth/callback route if the client-side creation failed

      return {
        success: true,
        user: data.user,
        session: data.session,
        confirmEmail: true,
        error: null,
      };
    } catch (error) {
      console.error("Sign up error:", error);
      return {
        success: false,
        user: null,
        session: null,
        confirmEmail: false,
        error: error as Error,
      };
    }
  };

  /**
   * Sign in with OAuth provider (Google)
   */
  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    setSession(null);
    router.push("/");
  };

  return {
    user,
    session,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
  };
}
