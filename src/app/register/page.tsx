"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { toast } from "@/lib/toast";

export default function RegisterPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName.trim() || email.split("@")[0] },
      },
    });

    if (error) {
      toast({
        variant: "error",
        title: "Couldn't create your account",
        description: error.message,
      });
      setLoading(false);
      return;
    }

    toast({
      variant: "success",
      title: "Welcome to PAFUPI",
      description: "Your account is ready.",
    });

    router.push("/account");
    router.refresh();
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <Link href="/" className="auth-brand">
          <span className="auth-brand-mark">p.</span>
          <span>pafupi</span>
        </Link>

        <h1>Create your account</h1>
        <p className="auth-subtitle">
          A private space for your wellbeing. You can delete your account at
          any time.
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            <span>Display name</span>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="What should we call you?"
              autoComplete="nickname"
            />
          </label>

          <label>
            <span>Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </label>

          <label>
            <span>Password</span>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              autoComplete="new-password"
            />
          </label>

          <button type="submit" disabled={loading} className="auth-submit">
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link href="/login">Sign in</Link>
        </p>

        <p className="auth-legal">
          PAFUPI is not an emergency service. If you are in immediate danger,
          contact local emergency services.
        </p>
      </div>
    </main>
  );
}