"use client";

import { useState } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import { Container, Card, Button, Input } from "@/components/ui";
import { supabaseBrowser } from "@/lib/supabase/client";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = supabaseBrowser();
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) { setLoading(false); return setError(error.message); }

    // Seed credits row on first signup (best-effort)
    if (data.user) {
      await fetch("/api/credits/checkout", { method: "POST" }).catch(()=>{});
    }

    setLoading(false);
    window.location.href = "/app/dashboard";
  }

  return (
    <>
      <Nav />
      <Container>
        <div className="max-w-md mx-auto">
          <Card>
            <h1 className="text-xl font-semibold">Create account</h1>
            <p className="text-sm text-zinc-300 mt-1">Start building your companion.</p>

            <form onSubmit={onSubmit} className="mt-5 space-y-3">
              <Input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
              <Input placeholder="Password (min 6 chars)" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
              {error && <div className="text-sm text-red-300">{error}</div>}
              <Button disabled={loading} className="w-full">{loading ? "Creating..." : "Sign up"}</Button>
            </form>

            <p className="text-xs text-zinc-400 mt-4">
              By signing up, you agree to keep content romantic but not explicit.
            </p>

            <p className="text-sm text-zinc-300 mt-3">
              Already have an account? <Link className="text-violet-300" href="/login">Login</Link>
            </p>
          </Card>
        </div>
      </Container>
    </>
  );
}
