"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

export default function AuthCallbackPage() {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();

  useEffect(() => {
    async function finalizeAuth() {
      await supabase.auth.getSession();
      router.replace("/form");
    }

    finalizeAuth();
  }, [router, supabase]);

  return (
    <div className="container">
      <div className="form-card">
        <h2>Signing you in...</h2>
        <p className="helper-text">Redirecting back to your application.</p>
      </div>
    </div>
  );
}

