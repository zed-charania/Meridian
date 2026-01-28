"use client";

import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

interface AuthGateProps {
  children: React.ReactNode;
}

export function AuthGate({ children }: AuthGateProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const supabase = getSupabaseBrowserClient();

  useEffect(() => {
    let isActive = true;

    async function loadSession() {
      const { data } = await supabase.auth.getSession();
      if (!isActive) return;
      setSession(data.session ?? null);
      setIsLoading(false);
    }

    loadSession();

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!isActive) return;
      setSession(nextSession);
      setIsLoading(false);
    });

    return () => {
      isActive = false;
      subscription.subscription.unsubscribe();
    };
  }, [supabase]);

  async function handleSignIn() {
    setAuthError(null);
    const redirectTo = `${window.location.origin}/auth/callback`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });

    if (error) setAuthError(error.message);
  }

  async function handleSignOut() {
    setAuthError(null);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Supabase sign out error:", error);
        setAuthError(error.message);
        return;
      }
      // Ensure local UI reflects signed-out state even if the auth listener is delayed
      setSession(null);
      // Hard refresh to clear any in-memory state that might still hold an old access token
      if (typeof window !== "undefined") window.location.href = "/";
    } catch (err) {
      console.error("Unexpected sign out error:", err);
      setAuthError(err instanceof Error ? err.message : "Unable to sign out. Please try again.");
    }
  }

  if (isLoading) {
    return (
      <div className="container">
        <div className="form-card">
          <p>Loading your session...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container">
        <div className="form-card">
          <h2>Sign in to continue</h2>
          <p className="helper-text">Use Google to access your application.</p>
          <button className="btn-next" type="button" onClick={handleSignIn}>
            Continue with Google
          </button>
          {authError && <p className="error-message">{authError}</p>}
        </div>
      </div>
    );
  }

  return (
    <>
      {children}
    </>
  );
}

